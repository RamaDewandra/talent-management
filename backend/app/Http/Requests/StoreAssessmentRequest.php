<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAssessmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        $employeeId = $this->input('employee_id');
        
        if (!$user->isHR() && !$user->isManager()) {
            return false;
        }

        if ($user->isManager()) {
            $employee = User::find($employeeId);
            return $employee && $user->canAssess($employee);
        }

        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(function ($query) {
                    $query->whereExists(function ($subQuery) {
                        $subQuery->selectRaw(1)
                            ->from('roles')
                            ->whereColumn('roles.id', 'users.role_id')
                            ->where('roles.name', 'Employee');
                    });
                }),
            ],
            'assessment_period_id' => [
                'required',
                'integer',
                Rule::exists('assessment_periods', 'id')->where(function ($query) {
                    $query->where('status', 'active');
                }),
            ],
            'scores' => ['sometimes', 'array'],
            'scores.*.indicator_type' => ['required_with:scores', Rule::in(['performance', 'potential'])],
            'scores.*.indicator_id' => ['required_with:scores', 'integer'],
            'scores.*.score' => ['required_with:scores', 'numeric', 'min:1', 'max:5'],
        ];
    }

    public function messages(): array
    {
        return [
            'employee_id.exists' => 'The selected employee is invalid or is not an employee.',
            'assessment_period_id.exists' => 'The selected assessment period is invalid or not active.',
        ];
    }
}
