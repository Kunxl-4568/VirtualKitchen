<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRecipe extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'ingredients' => 'sometimes|array',
            'ingredients.*.id' => 'sometimes|exists:ingredients,id',
            'ingredients.*.quantity' => 'sometimes|string|max:100',
            'ingredients.*.unit' => 'nullable|string|max:20',
            'instructions' => 'sometimes|array',
            'instructions.*' => 'sometimes|string|max:1000',
            'prep_time' => 'sometimes|integer|min:0',
            'cook_time' => 'sometimes|integer|min:0',
            'servings' => 'sometimes|integer|min:1',
            'difficulty' => 'sometimes|in:easy,medium,hard',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'category_id' => 'sometimes|exists:categories,id',
            'cuisine_id' => 'nullable|exists:cuisines,id',
            'tags' => 'sometimes|array',
            'tags.*' => 'exists:tags,id'
        ];
    }
}