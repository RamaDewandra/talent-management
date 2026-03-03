<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'department_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function assessmentsAsEmployee(): HasMany
    {
        return $this->hasMany(Assessment::class, 'employee_id');
    }

    public function assessmentsAsManager(): HasMany
    {
        return $this->hasMany(Assessment::class, 'manager_id');
    }

    public function isHR(): bool
    {
        return $this->role?->name === 'HR';
    }

    public function isManager(): bool
    {
        return $this->role?->name === 'Manager';
    }

    public function isEmployee(): bool
    {
        return $this->role?->name === 'Employee';
    }

    public function canAssess(User $employee): bool
    {
        if ($this->isHR()) {
            return true;
        }

        if ($this->isManager()) {
            return $this->department_id === $employee->department_id;
        }

        return false;
    }
}
