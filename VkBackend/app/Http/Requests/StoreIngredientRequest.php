<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreIngredientRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255|unique:ingredients',
            'description' => 'nullable|string',
            'is_allergen' => 'sometimes|boolean'
        ];
    }
}