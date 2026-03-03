<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAssessmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        $assessment = $this->route('assessment');
        $user = $this->user();

        if ($assessment->isSubmitted()) {
            return false;
        }

        if ($user->isHR()) {
            return true;
        }

        return $assessment->manager_id === $user->id;
    }

    public function rules(): array
    {
        return [
            'scores' => ['required', 'array'],
            'scores.*.indicator_type' => ['required', Rule::in(['performance', 'potential'])],
            'scores.*.indicator_id' => ['required', 'integer'],
            'scores.*.score' => ['required', 'numeric', 'min:1', 'max:5'],
        ];
    }
}
