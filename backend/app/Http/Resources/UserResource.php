<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->whenLoaded('role', fn() => [
                'id' => $this->role->id,
                'name' => $this->role->name,
            ]),
            'department' => $this->when(
                $this->relationLoaded('department') || $this->department_id,
                fn() => $this->department ? [
                    'id' => $this->department->id,
                    'name' => $this->department->name,
                ] : null
            ),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
