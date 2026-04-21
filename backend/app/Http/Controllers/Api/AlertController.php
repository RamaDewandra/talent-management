<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\AssessmentPeriod;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AlertController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $alerts = [];
        $today  = Carbon::today();

        // 1. Periode aktif yang akan berakhir ≤ 7 hari
        $activePeriods = AssessmentPeriod::where('status', 'active')->get();
        foreach ($activePeriods as $period) {
            $daysLeft = $today->diffInDays($period->end_date, false);
            if ($daysLeft >= 0 && $daysLeft <= 7) {
                $alerts[] = [
                    'type'    => 'warning',
                    'icon'    => '⏰',
                    'title'   => 'Period Ending Soon',
                    'message' => "Period \"{$period->name}\" ends in {$daysLeft} day(s) on {$period->end_date->format('d M Y')}.",
                ];
            }
        }

        // 2. Jumlah assessment masih Draft di periode aktif
        $activePeriod = AssessmentPeriod::active()->first();
        if ($activePeriod) {
            // Scope queries to manager's department if applicable
            $deptId = $user->isManager() ? $user->department_id : null;

            $draftQuery = Assessment::where('assessment_period_id', $activePeriod->id)->where('status', 'draft');
            if ($deptId) {
                $draftQuery->whereHas('employee', fn($q) => $q->where('department_id', $deptId));
            }
            $draftCount = $draftQuery->count();

            if ($draftCount > 0) {
                $alerts[] = [
                    'type'    => 'info',
                    'icon'    => '📝',
                    'title'   => 'Pending Submissions',
                    'message' => "{$draftCount} assessment(s) in \"{$activePeriod->name}\" are still in Draft and need to be submitted.",
                ];
            }

            // 3. Karyawan belum dinilai sama sekali di periode aktif
            $employeeQuery = User::whereHas('role', fn($q) => $q->where('name', 'Employee'));
            if ($deptId) $employeeQuery->where('department_id', $deptId);
            $totalEmployees = $employeeQuery->count();

            $assessedQuery = Assessment::where('assessment_period_id', $activePeriod->id)->distinct('employee_id');
            if ($deptId) {
                $assessedQuery->whereHas('employee', fn($q) => $q->where('department_id', $deptId));
            }
            $assessedEmployees = $assessedQuery->count('employee_id');
            $unassessed = $totalEmployees - $assessedEmployees;

            if ($unassessed > 0) {
                $alerts[] = [
                    'type'    => 'danger',
                    'icon'    => '👥',
                    'title'   => 'Employees Not Yet Assessed',
                    'message' => "{$unassessed} employee(s) have no assessment yet in period \"{$activePeriod->name}\".",
                ];
            }
        }

        // 4. Informasi jika tidak ada periode aktif
        if ($activePeriods->isEmpty()) {
            $alerts[] = [
                'type'    => 'info',
                'icon'    => '📅',
                'title'   => 'No Active Period',
                'message' => 'There is currently no active assessment period. Please activate one from HR Settings.',
            ];
        }

        return response()->json(['data' => $alerts]);
    }
}
