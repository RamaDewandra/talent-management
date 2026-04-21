<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Department;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserManagementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $users = User::with(['role', 'department'])
            ->orderBy('name')
            ->get();

        return response()->json(['data' => UserResource::collection($users)]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|unique:users,email',
            'password'      => 'required|string|min:6',
            'role_id'       => 'required|exists:roles,id',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);
        $user->load(['role', 'department']);

        return response()->json([
            'message' => 'User created successfully.',
            'data'    => new UserResource($user),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => ['required', 'email', Rule::unique('users', 'email')->ignore($id)],
            'password'      => 'nullable|string|min:6',
            'role_id'       => 'required|exists:roles,id',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);
        $user->load(['role', 'department']);

        return response()->json([
            'message' => 'User updated successfully.',
            'data'    => new UserResource($user),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully.']);
    }

    public function roles(): JsonResponse
    {
        return response()->json(['data' => Role::orderBy('name')->get()]);
    }

    public function departments(): JsonResponse
    {
        return response()->json(['data' => Department::orderBy('name')->get()]);
    }
}
