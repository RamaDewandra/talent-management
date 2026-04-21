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

    public function getSummary(?int $periodId = null, ?User $user = null): array
    {
        $query = Assessment::query();

        if ($periodId) {
            $query->where('assessment_period_id', $periodId);
        }

        $totalAssessments = $query->count();
        $submittedAssessments = (clone $query)->where('status', 'submitted')->count();
        $draftAssessments = (clone $query)->where('status', 'draft')->count();

        $empQuery = User::whereHas('role', function ($q) {
            $q->where('name', 'Employee');
        });
        $totalEmployees = $empQuery->count();

        /*
         * Completion Rate Logic (Dipakai untuk Semua Kondisi):
         * 
         * Rate = Total Submitted / Total Assessment × 100
         * Jika All Periods: 39 submitted dari 47 total = 82.9%
         * Jika Per Periode: 7 submitted dari 15 total = 46.7%
         * 
         * Ini menghilangkan logika lama yang menghitung berdasarkan total karyawan di sistem,
         * karena HR ingin melihat rasio pengisian assessment secara riil.
         */
        $completionRate = $totalAssessments > 0
            ? min(100, round(($submittedAssessments / $totalAssessments) * 100, 1))
            : 0;
        
        $assessedEmployees = $submittedAssessments; // Digunakan sebagai angka numerator di card UI

        $activePeriod = AssessmentPeriod::active()->first();
        $categoryDistribution = $this->getCategoryDistribution($periodId, $user);

        return [
            'total_assessments'    => $totalAssessments,
            'submitted_assessments'=> $submittedAssessments,
            'draft_assessments'    => $draftAssessments,
            'total_employees'      => $totalEmployees,
            'assessed_employees'   => $assessedEmployees,
            'completion_rate'      => $completionRate,
            'active_period' => $activePeriod ? [
                'id'         => $activePeriod->id,
                'name'       => $activePeriod->name,
                'start_date' => $activePeriod->start_date->format('Y-m-d'),
                'end_date'   => $activePeriod->end_date->format('Y-m-d'),
            ] : null,
            'category_distribution' => $categoryDistribution,
        ];
    }

    public function get9BoxMatrix(?int $periodId = null, ?User $user = null): array
    {
        return $this->scoringService->get9BoxData($periodId, $user);
    }

    private function getCategoryDistribution(?int $periodId = null, ?User $user = null): array
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
