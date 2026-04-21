<?php

namespace App\Services;

use App\Models\Assessment;
use App\Models\AssessmentScore;
use App\Models\PerformanceIndicator;
use App\Models\PotentialIndicator;
use Illuminate\Support\Facades\DB;

class AssessmentScoringService
{
    private const LOW_THRESHOLD = 2.5;
    private const HIGH_THRESHOLD = 3.5;

    public function calculateAndSubmit(Assessment $assessment): Assessment
    {
        return DB::transaction(function () use ($assessment) {
            $performanceScore = $this->calculateWeightedScore(
                $assessment,
                'performance'
            );
            $potentialScore = $this->calculateWeightedScore(
                $assessment,
                'potential'
            );

            $talentCategory = $this->determineTalentCategory(
                $performanceScore,
                $potentialScore
            );

            $assessment->update([
                'performance_score' => $performanceScore,
                'potential_score' => $potentialScore,
                'talent_category' => $talentCategory,
                'status' => 'submitted',
            ]);

            return $assessment->fresh();
        });
    }

    public function calculateWeightedScore(Assessment $assessment, string $type): float
    {
        $scores = $assessment->scores()
            ->where('indicator_type', $type)
            ->get();

        if ($scores->isEmpty()) {
            return 0;
        }

        $indicators = $type === 'performance'
            ? PerformanceIndicator::active()->get()->keyBy('id')
            : PotentialIndicator::active()->get()->keyBy('id');

        $totalWeight = 0;
        $weightedSum = 0;

        foreach ($scores as $score) {
            $indicator = $indicators->get($score->indicator_id);
            if ($indicator) {
                $weight = (float) $indicator->weight;
                $totalWeight += $weight;
                $weightedSum += $score->score * $weight;
            }
        }

        return $totalWeight > 0 ? round($weightedSum / $totalWeight, 2) : 0;
    }

    public function determineTalentCategory(float $performanceScore, float $potentialScore): string
    {
        $performanceLevel = $this->getLevel($performanceScore);
        $potentialLevel = $this->getLevel($potentialScore);

        return $this->getTalentCategoryFromLevels($performanceLevel, $potentialLevel);
    }

    private function getLevel(float $score): string
    {
        if ($score < self::LOW_THRESHOLD) {
            return 'Low';
        }

        if ($score > self::HIGH_THRESHOLD) {
            return 'High';
        }

        return 'Medium';
    }

    private function getTalentCategoryFromLevels(string $performance, string $potential): string
    {
        $matrix = [
            'High' => [
                'High' => 'Star',
                'Medium' => 'High Performer',
                'Low' => 'Solid Performer',
            ],
            'Medium' => [
                'High' => 'High Potential',
                'Medium' => 'Core Player',
                'Low' => 'Average Performer',
            ],
            'Low' => [
                'High' => 'Inconsistent Player',
                'Medium' => 'Underperformer',
                'Low' => 'Risk',
            ],
        ];

        return $matrix[$performance][$potential] ?? 'Unclassified';
    }

    public function isAssessmentComplete(Assessment $assessment): bool
    {
        $activePerformanceCount = PerformanceIndicator::active()->count();
        $activePotentialCount = PotentialIndicator::active()->count();

        $performanceScoresCount = $assessment->performanceScores()->count();
        $potentialScoresCount = $assessment->potentialScores()->count();

        return $performanceScoresCount >= $activePerformanceCount
            && $potentialScoresCount >= $activePotentialCount;
    }

    public function get9BoxData(?int $periodId = null): array
    {
        $query = Assessment::query()
            ->where('status', 'submitted')
            ->whereNotNull('talent_category');

        if ($periodId) {
            $query->where('assessment_period_id', $periodId);
        }

        $assessments = $query->with(['employee.department', 'employee.role'])->get();

        $categories = [
            'Star' => [],
            'High Performer' => [],
            'Solid Performer' => [],
            'High Potential' => [],
            'Core Player' => [],
            'Average Performer' => [],
            'Inconsistent Player' => [],
            'Underperformer' => [],
            'Risk' => [],
        ];

        foreach ($assessments as $assessment) {
            $category = $assessment->talent_category;
            if (isset($categories[$category])) {
                $categories[$category][] = [
                    'id' => $assessment->id,
                    'employee_id' => $assessment->employee_id,
                    'employee_name' => $assessment->employee->name,
                    'department' => $assessment->employee->department?->name,
                    'performance_score' => $assessment->performance_score,
                    'potential_score' => $assessment->potential_score,
                ];
            }
        }

        return $categories;
    }
}
