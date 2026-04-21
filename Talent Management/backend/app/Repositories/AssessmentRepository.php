<?php

namespace App\Repositories;

use App\Models\Assessment;
use Illuminate\Database\Eloquent\Collection;

class AssessmentRepository
{
    public function create(array $data): Assessment
    {
        return Assessment::create($data);
    }

    public function update(Assessment $assessment, array $data): Assessment
    {
        $assessment->update($data);
        return $assessment->fresh();
    }

    public function find(int $id): ?Assessment
    {
        return Assessment::find($id);
    }

    public function findWithRelations(int $id): ?Assessment
    {
        return Assessment::with([
            'employee.department',
            'employee.role',
            'manager',
            'assessmentPeriod',
            'scores',
        ])->find($id);
    }

    public function getByEmployee(int $employeeId): Collection
    {
        return Assessment::where('employee_id', $employeeId)
            ->with(['manager', 'assessmentPeriod', 'scores'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getByManager(int $managerId): Collection
    {
        return Assessment::where('manager_id', $managerId)
            ->with(['employee', 'assessmentPeriod', 'scores'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getByPeriod(int $periodId): Collection
    {
        return Assessment::where('assessment_period_id', $periodId)
            ->with(['employee', 'manager', 'scores'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function existsForEmployeeInPeriod(int $employeeId, int $periodId): bool
    {
        return Assessment::where('employee_id', $employeeId)
            ->where('assessment_period_id', $periodId)
            ->exists();
    }
}
