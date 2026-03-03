<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssessmentScoreResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'indicator_type' => $this->indicator_type,
            'indicator_id' => $this->indicator_id,
            'score' => (float) $this->score,
            'indicator' => $this->when(
                $this->relationLoaded('performanceIndicator') || $this->relationLoaded('potentialIndicator'),
                fn() => $this->indicator_type === 'performance'
                    ? new PerformanceIndicatorResource($this->performanceIndicator)
                    : new PotentialIndicatorResource($this->potentialIndicator)
            ),
        ];
    }
}
