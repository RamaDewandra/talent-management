<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function isHR(): bool
    {
        return $this->name === 'HR';
    }

    public function isManager(): bool
    {
        return $this->name === 'Manager';
    }

    public function isEmployee(): bool
    {
        return $this->name === 'Employee';
    }
}
