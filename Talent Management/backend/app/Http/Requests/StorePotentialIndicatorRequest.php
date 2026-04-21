<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePotentialIndicatorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isHR();
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'weight' => ['required', 'numeric', 'min:0.01', 'max:10'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
