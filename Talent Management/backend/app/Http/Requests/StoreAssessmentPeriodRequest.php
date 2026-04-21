<?php

namespace App\Http\Requests;

use App\Models\AssessmentPeriod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAssessmentPeriodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isHR();
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'status' => ['sometimes', Rule::in(['draft', 'active', 'closed'])],
        ];
    }
}
