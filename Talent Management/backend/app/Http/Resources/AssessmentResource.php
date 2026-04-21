<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssessmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'employee' => new UserResource($this->whenLoaded('employee')),
            'manager' => new UserResource($this->whenLoaded('manager')),
            'assessment_period' => new AssessmentPeriodResource($this->whenLoaded('assessmentPeriod')),
            'status' => $this->status,
            'performance_score' => $this->performance_score ? (float) $this->performance_score : null,
            'potential_score' => $this->potential_score ? (float) $this->potential_score : null,
            'talent_category' => $this->talent_category,
            'scores' => AssessmentScoreResource::collection($this->whenLoaded('scores')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
