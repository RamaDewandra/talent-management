<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function employees(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $query = User::with(['role', 'department'])
            ->whereHas('role', fn($q) => $q->where('name', 'Employee'));

        // Managers can only see employees in their department
        if ($user->isManager()) {
            $query->where('department_id', $user->department_id);
        }

        $employees = $query->orderBy('name')->get();

        return response()->json([
            'data' => UserResource::collection($employees),
        ]);
    }

    public function departments(): JsonResponse
    {
        $departments = Department::orderBy('name')->get();

        return response()->json([
            'data' => $departments,
        ]);
    }
}
