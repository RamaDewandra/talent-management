<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AssessmentResource;
use App\Http\Resources\UserResource;
use App\Models\Assessment;
use App\Models\AssessmentPeriod;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    /**
     * Trend data: average performance & potential per assessment period.
     */
    public function trends(Request $request): JsonResponse
    {
        $periods = AssessmentPeriod::orderBy('start_date')->get();

        $trends = $periods->map(function ($period) {
            $assessments = Assessment::where('assessment_period_id', $period->id)
                ->where('status', 'submitted')
                ->whereNotNull('performance_score')
                ->get();

            return [
                'period_id'   => $period->id,
                'period_name' => $period->name,
                'avg_performance' => $assessments->avg('performance_score')
                    ? round($assessments->avg('performance_score'), 2) : null,
                'avg_potential' => $assessments->avg('potential_score')
                    ? round($assessments->avg('potential_score'), 2) : null,
                'total_assessed' => $assessments->count(),
            ];
        });

        return response()->json(['data' => $trends]);
    }

    /**
     * Department summary: avg scores and talent category breakdown.
     */
    public function departmentSummary(Request $request): JsonResponse
    {
        $periodId = $request->query('period_id');

        $departments = Department::with(['users.assessmentsAsEmployee' => function ($q) use ($periodId) {
            $q->where('status', 'submitted')
              ->when($periodId, fn($q2) => $q2->where('assessment_period_id', $periodId));
        }])->get();

        $result = $departments->map(function ($dept) {
            $assessments = $dept->users->flatMap(fn($u) => $u->assessmentsAsEmployee);

            $categoryDist = $assessments
                ->whereNotNull('talent_category')
                ->groupBy('talent_category')
                ->map(fn($g) => $g->count());

            return [
                'department_id'   => $dept->id,
                'department_name' => $dept->name,
                'total_employees' => $dept->users->count(),
                'assessed'        => $assessments->count(),
                'avg_performance' => $assessments->avg('performance_score')
                    ? round($assessments->avg('performance_score'), 2) : null,
                'avg_potential'   => $assessments->avg('potential_score')
                    ? round($assessments->avg('potential_score'), 2) : null,
                'category_distribution' => $categoryDist,
            ];
        });

        return response()->json(['data' => $result]);
    }

    /**
     * Category distribution across all / a period.
     */
    public function categoryDistribution(Request $request): JsonResponse
    {
        $periodId = $request->query('period_id');

        $distribution = Assessment::query()
            ->where('status', 'submitted')
            ->whereNotNull('talent_category')
            ->when($periodId, fn($q) => $q->where('assessment_period_id', $periodId))
            ->groupBy('talent_category')
            ->selectRaw('talent_category, count(*) as total')
            ->get()
            ->pluck('total', 'talent_category');

        return response()->json(['data' => $distribution]);
    }
}
