<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePotentialIndicatorRequest;
use App\Http\Resources\PotentialIndicatorResource;
use App\Models\PotentialIndicator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PotentialIndicatorController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $indicators = PotentialIndicator::orderBy('name')->get();

        return PotentialIndicatorResource::collection($indicators);
    }

    public function store(StorePotentialIndicatorRequest $request): JsonResponse
    {
        $indicator = PotentialIndicator::create($request->validated());

        return response()->json([
            'message' => 'Potential indicator created successfully.',
            'data' => new PotentialIndicatorResource($indicator),
        ], 201);
    }

    public function update(StorePotentialIndicatorRequest $request, PotentialIndicator $potentialIndicator): JsonResponse
    {
        $potentialIndicator->update($request->validated());

        return response()->json([
            'message' => 'Potential indicator updated successfully.',
            'data' => new PotentialIndicatorResource($potentialIndicator),
        ]);
    }

    public function destroy(PotentialIndicator $potentialIndicator): JsonResponse
    {
        if (!request()->user()->isHR()) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $potentialIndicator->delete();

        return response()->json([
            'message' => 'Potential indicator deleted successfully.',
        ]);
    }
}
