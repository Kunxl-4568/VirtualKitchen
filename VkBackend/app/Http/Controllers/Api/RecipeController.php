<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreRecipe;
use App\Http\Requests\UpdateRecipe;
use App\Models\Recipe;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;


class RecipeController extends Controller
{
    public function index()
    {
        return response()->json([
            'recipes' => Recipe::with(['user', 'cuisine', 'category', 'tags'])
                ->published()
                ->latest()
                ->paginate(10)
        ]);
    }

    public function store(StoreRecipe $request)
    {
        $data = $request->validated();
        $recipe = null;
        DB::transaction(function () use (&$recipe, $data, $request) {
            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image')->store('recipes', 'public');
            }

            $data['user_id'] = auth()->id();
            $recipe = Recipe::create($data);

            // Sync ingredients
            // dd($request->ingredients);
            $ingredients = collect($request->ingredients)->mapWithKeys(fn($item) => [
                $item['id'] => [
                    'quantity' => $item['quantity'],
                    'unit' => $item['unit'] ?? null,
                    'notes' => $item['notes'] ?? null
                ]
            ]);
            $recipe->ingredients()->sync($ingredients);
            

            // Sync tags
            if ($request->has('tags')) {
                $recipe->tags()->sync($request->tags);
            }

            // Create instructions
            $recipe->instructions()->createMany(
                collect($request->instructions)
                    ->map(fn($step, $i) => [
                        'step_number' => $i + 1,
                        'description' => $step
                    ])
            );
        });

        return response()->json([
            'message' => 'Recipe created successfully',
            'recipe' => $recipe->load(['ingredients', 'instructions', 'tags'])
        ], 201);
    }

    public function show(Recipe $recipe)
    {
        $recipe->increment('views_count');
        return response()->json([
            'recipe' => $recipe->load([
                'user', 
                'cuisine', 
                'category', 
                'ingredients', 
                'instructions', 
                'tags'
            ])
        ]);
    }

    public function update(UpdateRecipe $request, Recipe $recipe)
    {
        try {
            DB::beginTransaction();

            // Log the incoming request data
            \Log::info('Update Recipe Request:', $request->all());

            $data = $request->validated();

            // Handle basic recipe update
            $recipe->update([
                'title' => $data['title'],
                'description' => $data['description'],
                'prep_time' => $data['prep_time'],
                'cook_time' => $data['cook_time'],
                'servings' => $data['servings'],
                'difficulty' => $data['difficulty'],
                'category_id' => $data['category_id'],
                'cuisine_id' => $data['cuisine_id'],
            ]);

            // Update ingredients
            if (isset($data['ingredients'])) {
                $ingredients = collect($data['ingredients'])->mapWithKeys(function ($item) {
                    return [
                        $item['id'] => [
                            'quantity' => $item['quantity'],
                            'unit' => $item['unit'] ?? null
                        ]
                    ];
                });
                $recipe->ingredients()->sync($ingredients);
            }

            // Update instructions
            if (isset($data['instructions'])) {
                $recipe->instructions()->delete();
                $recipe->instructions()->createMany(
                    collect($data['instructions'])
                        ->map(fn($step, $i) => [
                            'step_number' => $i + 1,
                            'description' => $step
                        ])
                );
            }

            DB::commit();

            return response()->json([
                'message' => 'Recipe updated successfully',
                'recipe' => $recipe->fresh()->load(['ingredients', 'instructions', 'category', 'cuisine'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Recipe Update Error: ' . $e->getMessage());
            return response()->json(['message' => 'Error updating recipe', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Recipe $recipe)
    {
        $this->authorize('delete', $recipe);
        
        if ($recipe->image) {
            Storage::disk('public')->delete($recipe->image);
        }
        
        $recipe->delete();
        return response()->noContent();
    }
    

public function userRecipes(Request $request)
{
    $user = $request->user(); // Logged-in user

    // Assuming you have a relation set up like: User hasMany Recipes
    $recipes = $user->recipes()->latest()->get();

    return response()->json([
        'recipes' => $recipes
    ]);
}

}