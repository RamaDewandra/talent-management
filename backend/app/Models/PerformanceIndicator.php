<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PerformanceIndicator extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'weight',
        'is_active',
    ];

    protected $casts = [
        'weight' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function assessmentScores(): HasMany
    {
        return $this->hasMany(AssessmentScore::class, 'indicator_id')
            ->where('indicator_type', 'performance');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
