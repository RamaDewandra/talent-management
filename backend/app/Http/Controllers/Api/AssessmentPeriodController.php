<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAssessmentPeriodRequest;
use App\Http\Requests\UpdateAssessmentPeriodRequest;
use App\Http\Resources\AssessmentPeriodResource;
use App\Models\AssessmentPeriod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AssessmentPeriodController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $periods = AssessmentPeriod::withCount('assessments')
            ->orderBy('created_at', 'desc')
            ->get();

        return AssessmentPeriodResource::collection($periods);
    }

    public function store(StoreAssessmentPeriodRequest $request): JsonResponse
    {
        $period = AssessmentPeriod::create($request->validated());

        return response()->json([
            'message' => 'Assessment period created successfully.',
            'data' => new AssessmentPeriodResource($period),
        ], 201);
    }

    public function show(AssessmentPeriod $period): AssessmentPeriodResource
    {
        return new AssessmentPeriodResource($period->loadCount('assessments'));
    }

    public function update(UpdateAssessmentPeriodRequest $request, AssessmentPeriod $period): JsonResponse
    {
        $period->update($request->validated());

        return response()->json([
            'message' => 'Assessment period updated successfully.',
            'data' => new AssessmentPeriodResource($period),
        ]);
    }

    public function activate(AssessmentPeriod $period): JsonResponse
    {
        if (!request()->user()->isHR()) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        // Deactivate other active periods
        AssessmentPeriod::where('status', 'active')->update(['status' => 'draft']);

        $period->update(['status' => 'active']);

        return response()->json([
            'message' => 'Assessment period activated successfully.',
            'data' => new AssessmentPeriodResource($period),
        ]);
    }

    public function close(AssessmentPeriod $period): JsonResponse
    {
        if (!request()->user()->isHR()) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $period->update(['status' => 'closed']);

        return response()->json([
            'message' => 'Assessment period closed successfully.',
            'data' => new AssessmentPeriodResource($period),
        ]);
    }
}
