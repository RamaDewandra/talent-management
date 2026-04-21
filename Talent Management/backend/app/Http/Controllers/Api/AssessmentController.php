<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAssessmentRequest;
use App\Http\Requests\UpdateAssessmentRequest;
use App\Http\Resources\AssessmentResource;
use App\Models\Assessment;
use App\Repositories\AssessmentRepository;
use App\Services\AssessmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssessmentController extends Controller
{
    public function __construct(
        private AssessmentService $assessmentService,
        private AssessmentRepository $assessmentRepository
    ) {}

    public function index(Request $request)
    {
        $user = $request->user();
        $filters = $request->only(['period_id', 'status', 'department_id']);

        if ($user->isHR()) {
            $assessments = $this->assessmentService->getAllAssessments($filters);
        } else {
            $assessments = $this->assessmentService->getAssessmentsForManager($user, $filters);
        }

        return AssessmentResource::collection($assessments);
    }

    public function store(StoreAssessmentRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();

        // Check if assessment already exists for this employee in this period
        if ($this->assessmentRepository->existsForEmployeeInPeriod(
            $data['employee_id'],
            $data['assessment_period_id']
        )) {
            return response()->json([
                'message' => 'An assessment already exists for this employee in the selected period.',
            ], 422);
        }

        $assessment = $this->assessmentService->createAssessment($data, $user);

        return response()->json([
            'message' => 'Assessment created successfully.',
            'data' => new AssessmentResource($assessment),
        ], 201);
    }

    public function show(Assessment $assessment): AssessmentResource
    {
        $assessment->load([
            'employee.department',
            'employee.role',
            'manager',
            'assessmentPeriod',
            'scores.performanceIndicator',
            'scores.potentialIndicator',
        ]);

        return new AssessmentResource($assessment);
    }

    public function update(UpdateAssessmentRequest $request, Assessment $assessment): JsonResponse
    {
        try {
            $assessment = $this->assessmentService->updateAssessment(
                $assessment,
                $request->validated()
            );

            return response()->json([
                'message' => 'Assessment updated successfully.',
                'data' => new AssessmentResource($assessment),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function submit(Request $request, Assessment $assessment): JsonResponse
    {
        $user = $request->user();

        // Check authorization
        if (!$user->isHR() && $assessment->manager_id !== $user->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        try {
            $assessment = $this->assessmentService->submitAssessment($assessment);

            return response()->json([
                'message' => 'Assessment submitted successfully.',
                'data' => new AssessmentResource($assessment->load([
                    'employee.department',
                    'manager',
                    'assessmentPeriod',
                    'scores',
                ])),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
