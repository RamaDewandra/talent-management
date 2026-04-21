<?php

namespace App\Services;

use App\Models\Assessment;
use App\Models\AssessmentPeriod;
use App\Models\User;

class DashboardService
{
    public function __construct(
        private AssessmentScoringService $scoringService
    ) {}

    public function getSummary(?int $periodId = null): array
    {
        $query = Assessment::query();

        if ($periodId) {
            $query->where('assessment_period_id', $periodId);
        }

        $totalAssessments = $query->count();
        $submittedAssessments = (clone $query)->where('status', 'submitted')->count();
        $draftAssessments = (clone $query)->where('status', 'draft')->count();

        $totalEmployees = User::whereHas('role', function ($q) {
            $q->where('name', 'Employee');
        })->count();

        $assessedEmployees = Assessment::query()
            ->when($periodId, fn($q) => $q->where('assessment_period_id', $periodId))
            ->where('status', 'submitted')
            ->distinct('employee_id')
            ->count('employee_id');

        $activePeriod = AssessmentPeriod::active()->first();

        $categoryDistribution = $this->getCategoryDistribution($periodId);

        return [
            'total_assessments' => $totalAssessments,
            'submitted_assessments' => $submittedAssessments,
            'draft_assessments' => $draftAssessments,
            'total_employees' => $totalEmployees,
            'assessed_employees' => $assessedEmployees,
            'completion_rate' => $totalEmployees > 0
                ? round(($assessedEmployees / $totalEmployees) * 100, 1)
                : 0,
            'active_period' => $activePeriod ? [
                'id' => $activePeriod->id,
                'name' => $activePeriod->name,
                'start_date' => $activePeriod->start_date->format('Y-m-d'),
                'end_date' => $activePeriod->end_date->format('Y-m-d'),
            ] : null,
            'category_distribution' => $categoryDistribution,
        ];
    }

    public function get9BoxMatrix(?int $periodId = null): array
    {
        return $this->scoringService->get9BoxData($periodId);
    }

    private function getCategoryDistribution(?int $periodId = null): array
    {
        $query = Assessment::query()
            ->where('status', 'submitted')
            ->whereNotNull('talent_category');

        if ($periodId) {
            $query->where('assessment_period_id', $periodId);
        }

        return $query->groupBy('talent_category')
            ->selectRaw('talent_category, count(*) as count')
            ->pluck('count', 'talent_category')
            ->toArray();
    }
}
