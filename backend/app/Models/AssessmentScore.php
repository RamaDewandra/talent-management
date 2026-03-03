<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssessmentScore extends Model
{
    use HasFactory;

    protected $fillable = [
        'assessment_id',
        'indicator_type',
        'indicator_id',
        'score',
    ];

    protected $casts = [
        'score' => 'decimal:1',
    ];

    public function assessment(): BelongsTo
    {
        return $this->belongsTo(Assessment::class);
    }

    public function performanceIndicator(): BelongsTo
    {
        return $this->belongsTo(PerformanceIndicator::class, 'indicator_id');
    }

    public function potentialIndicator(): BelongsTo
    {
        return $this->belongsTo(PotentialIndicator::class, 'indicator_id');
    }

    public function getIndicator()
    {
        return $this->indicator_type === 'performance'
            ? $this->performanceIndicator
            : $this->potentialIndicator;
    }
}
