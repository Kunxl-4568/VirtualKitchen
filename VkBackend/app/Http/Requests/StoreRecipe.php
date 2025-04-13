<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRecipe extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'ingredients' => 'required|array|min:1',
           // 'ingredients.*.name' => 'required|string|max:255',
            'ingredients.*.id' => 'required|exists:ingredients,id',
            'ingredients.*.quantity' => 'required|string|max:100',
            'ingredients.*.unit' => 'nullable|string|max:20',
            'instructions' => 'required|array|min:1',
           // 'instructions.*.step' => 'required|string|max:1000',
            'prep_time' => 'required|integer|min:0',
            'cook_time' => 'required|integer|min:0',
            'servings' => 'required|integer|min:1',
            'difficulty' => 'required|in:easy,medium,hard',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'category_id' => 'required|exists:categories,id',
            'cuisine_id' => 'nullable|exists:cuisines,id',
            'tags' => 'sometimes|array',
            'tags.*' => 'exists:tags,id'
        ];
    }
}
