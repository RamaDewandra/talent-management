<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService
    ) {}

    public function summary(Request $request): JsonResponse
    {
        $periodId = $request->query('period_id');

        $summary = $this->dashboardService->getSummary($periodId);

        return response()->json([
            'data' => $summary,
        ]);
    }

    public function nineBox(Request $request): JsonResponse
    {
        $periodId = $request->query('period_id');

        $matrix = $this->dashboardService->get9BoxMatrix($periodId);

        return response()->json([
            'data' => $matrix,
        ]);
    }
}
