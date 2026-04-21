<?php

namespace App\Services;

use App\Models\Assessment;
use App\Models\AssessmentPeriod;
use App\Models\AssessmentScore;
use App\Models\User;
use App\Repositories\AssessmentRepository;
use Illuminate\Support\Facades\DB;

class AssessmentService
{
    public function __construct(
        private AssessmentRepository $repository,
        private AssessmentScoringService $scoringService
    ) {}

    public function createAssessment(array $data, User $manager): Assessment
    {
        return DB::transaction(function () use ($data, $manager) {
            $assessment = $this->repository->create([
                'employee_id' => $data['employee_id'],
                'manager_id' => $manager->id,
                'assessment_period_id' => $data['assessment_period_id'],
                'status' => 'draft',
            ]);

            if (!empty($data['scores'])) {
                $this->saveScores($assessment, $data['scores']);
            }

            return $assessment->load(['employee', 'manager', 'assessmentPeriod', 'scores']);
        });
    }

    public function updateAssessment(Assessment $assessment, array $data): Assessment
    {
        if ($assessment->isSubmitted()) {
            throw new \Exception('Cannot edit a submitted assessment.');
        }

        return DB::transaction(function () use ($assessment, $data) {
            if (!empty($data['scores'])) {
                $this->saveScores($assessment, $data['scores']);
            }

            return $assessment->fresh(['employee', 'manager', 'assessmentPeriod', 'scores']);
        });
    }

    public function submitAssessment(Assessment $assessment): Assessment
    {
        if ($assessment->isSubmitted()) {
            throw new \Exception('Assessment is already submitted.');
        }

        if (!$this->scoringService->isAssessmentComplete($assessment)) {
            throw new \Exception('Cannot submit incomplete assessment. All indicators must be scored.');
        }

        return $this->scoringService->calculateAndSubmit($assessment);
    }

    private function saveScores(Assessment $assessment, array $scores): void
    {
        foreach ($scores as $score) {
            AssessmentScore::updateOrCreate(
                [
                    'assessment_id' => $assessment->id,
                    'indicator_type' => $score['indicator_type'],
                    'indicator_id' => $score['indicator_id'],
                ],
                [
                    'score' => $score['score'],
                ]
            );
        }
    }

    public function getAssessmentsForManager(User $manager, array $filters = [])
    {
        $query = Assessment::query()
            ->where('manager_id', $manager->id)
            ->with(['employee', 'assessmentPeriod', 'scores']);

        if (!empty($filters['period_id'])) {
            $query->where('assessment_period_id', $filters['period_id']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('created_at', 'desc')->paginate(15);
    }

    public function getAllAssessments(array $filters = [])
    {
        $query = Assessment::query()
            ->with(['employee.department', 'manager', 'assessmentPeriod', 'scores']);

        if (!empty($filters['period_id'])) {
            $query->where('assessment_period_id', $filters['period_id']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['department_id'])) {
            $query->whereHas('employee', function ($q) use ($filters) {
                $q->where('department_id', $filters['department_id']);
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate(15);
    }
}
