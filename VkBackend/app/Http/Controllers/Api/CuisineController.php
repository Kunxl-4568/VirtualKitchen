<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreCuisineRequest;
use App\Http\Requests\UpdateCuisineRequest;
use App\Models\Cuisine;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
class CuisineController extends Controller
{
    public function index()
    {
        return response()->json(Cuisine::orderBy('name')->get());
    }

    public function store(StoreCousineRequest $request)
    {
        $data = $request->validated();
        
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('cuisines', 'public');
        }

        $cuisine = Cuisine::create($data);

        return response()->json([
            'message' => 'Cuisine created successfully',
            'cuisine' => $cuisine
        ], 201);
    }

    public function show(Cuisine $cuisine)
    {
        return response()->json([
            'cuisine' => $cuisine,
            'recipes' => $cuisine->recipes()
                ->with(['user', 'category'])
                ->published()
                ->paginate(10)
        ]);
    }

    public function update(UpdateCousineRequest $request, Cuisine $cuisine)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($cuisine->image) {
                Storage::disk('public')->delete($cuisine->image);
            }
            $data['image'] = $request->file('image')->store('cuisines', 'public');
        }

        $cuisine->update($data);

        return response()->json([
            'message' => 'Cuisine updated successfully',
            'cuisine' => $cuisine
        ]);
    }

    public function destroy(Cuisine $cuisine)
    {
        if ($cuisine->recipes()->exists()) {
            return response()->json([
                'message' => 'Cannot delete: Cuisine has associated recipes'
            ], 422);
        }

        if ($cuisine->image) {
            Storage::disk('public')->delete($cuisine->image);
        }

        $cuisine->delete();
        return response()->noContent();
    }
}