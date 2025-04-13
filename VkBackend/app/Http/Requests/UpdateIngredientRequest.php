<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateIngredientRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'sometimes|string|max:255|unique:ingredients,name,'.$this->ingredient->id,
            'description' => 'sometimes|string',
            'is_allergen' => 'sometimes|boolean'
        ];
    }
}