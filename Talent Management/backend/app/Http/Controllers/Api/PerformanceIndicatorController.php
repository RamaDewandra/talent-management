<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePerformanceIndicatorRequest;
use App\Http\Resources\PerformanceIndicatorResource;
use App\Models\PerformanceIndicator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PerformanceIndicatorController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $indicators = PerformanceIndicator::orderBy('category')
            ->orderBy('name')
            ->get();

        return PerformanceIndicatorResource::collection($indicators);
    }

    public function store(StorePerformanceIndicatorRequest $request): JsonResponse
    {
        $indicator = PerformanceIndicator::create($request->validated());

        return response()->json([
            'message' => 'Performance indicator created successfully.',
            'data' => new PerformanceIndicatorResource($indicator),
        ], 201);
    }

    public function update(StorePerformanceIndicatorRequest $request, PerformanceIndicator $performanceIndicator): JsonResponse
    {
        $performanceIndicator->update($request->validated());

        return response()->json([
            'message' => 'Performance indicator updated successfully.',
            'data' => new PerformanceIndicatorResource($performanceIndicator),
        ]);
    }

    public function destroy(PerformanceIndicator $performanceIndicator): JsonResponse
    {
        if (!request()->user()->isHR()) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $performanceIndicator->delete();

        return response()->json([
            'message' => 'Performance indicator deleted successfully.',
        ]);
    }
}
