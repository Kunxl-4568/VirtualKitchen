<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreIngredientRequest;
use App\Http\Requests\UpdateIngredientRequest;
use App\Models\Ingredient;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class IngredientController extends Controller
{
    public function index(Request $request)
    {
        $query = Ingredient::query();

       
        return response()->json(Ingredient::orderBy('name')->get());
    }

    public function store(StoreIngredientRequest $request)
    {
        $ingredient = Ingredient::create($request->validated());
        return response()->json([
            'message' => 'Ingredient created successfully',
            'ingredient' => $ingredient
        ], 201);
    }

    public function show(Ingredient $ingredient)
    {
        return response()->json([
            'ingredient' => $ingredient,
            'recipes' => $ingredient->recipes()
                ->with(['cuisine', 'user'])
                ->published()
                ->paginate(10)
        ]);
    }

    public function update(UpdateIngredientRequest $request, Ingredient $ingredient)
    {
        $ingredient->update($request->validated());
        return response()->json([
            'message' => 'Ingredient updated successfully',
            'ingredient' => $ingredient
        ]);
    }

    public function destroy(Ingredient $ingredient)
    {
        if ($ingredient->recipes()->exists()) {
            return response()->json([
                'message' => 'Cannot delete: Ingredient is used in recipes'
            ], 422);
        }

        $ingredient->delete();
        return response()->noContent();
    }
}