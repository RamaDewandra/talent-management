<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AssessmentResource;
use App\Http\Resources\UserResource;
use App\Models\Assessment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    /**
     * Get all employees (HR sees all, Manager sees own department).
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = User::with(['role', 'department']);

        // Manager only sees their own department
        if ($user->isManager()) {
            $query->where('department_id', $user->department_id);
        }

        $employees = $query->orderBy('name')->get();

        return response()->json(['data' => UserResource::collection($employees)]);
    }

    /**
     * Get a single employee profile with their full assessment history.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $employee = User::with(['role', 'department'])->findOrFail($id);

        if ($user->isManager() && $employee->department_id !== $user->department_id) {
            abort(403, 'Unauthorized access to employee profile.');
        }

        // All submitted assessments ordered by period
        $assessments = Assessment::with(['assessmentPeriod', 'manager'])
            ->where('employee_id', $id)
            ->where('status', 'submitted')
            ->join('assessment_periods', 'assessments.assessment_period_id', '=', 'assessment_periods.id')
            ->orderBy('assessment_periods.start_date')
            ->select('assessments.*')
            ->get();

        $trendData = $assessments->map(fn($a) => [
            'period_name'       => $a->assessmentPeriod->name,
            'performance_score' => (float) $a->performance_score,
            'potential_score'   => (float) $a->potential_score,
            'talent_category'   => $a->talent_category,
        ]);

        // Latest category
        $latest = $assessments->last();

        return response()->json([
            'data' => [
                'employee'        => new UserResource($employee),
                'latest_category' => $latest?->talent_category,
                'latest_performance' => $latest ? (float) $latest->performance_score : null,
                'latest_potential'   => $latest ? (float) $latest->potential_score : null,
                'history'         => $trendData,
                'assessments'     => AssessmentResource::collection($assessments),
            ],
        ]);
    }
}
