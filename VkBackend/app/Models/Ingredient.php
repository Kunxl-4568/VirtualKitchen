<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Ingredient extends Model
{
    protected $fillable = ['name', 'description', 'is_allergen'];

    protected $casts = ['is_allergen' => 'boolean'];

    public function recipes(): BelongsToMany
    {
        return $this->belongsToMany(Recipe::class , 'ingredient_recipe')
            ->withPivot(['quantity', 'unit', 'notes'])
            ->withTimestamps();
    }
}