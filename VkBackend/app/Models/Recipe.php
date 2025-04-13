<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{
    BelongsTo,
    BelongsToMany,
    HasMany
};
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class Recipe extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title', 'description', 'prep_time', 'cook_time',
        'servings', 'difficulty', 'image', 'user_id',
        'cuisine_id', 'category_id', 'is_published'
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'prep_time' => 'integer',
        'cook_time' => 'integer'
    ];

    // Relationships
    public function category()
{
    return $this->belongsTo(Category::class);
}
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function cuisine(): BelongsTo
    {
        return $this->belongsTo(Cuisine::class);
    }

    public function ingredients(): BelongsToMany
    {
        return $this->belongsToMany(Ingredient::class, 'ingredient_recipe') // Specify the pivot table
                    ->withPivot('quantity', 'unit', 'notes') // Include the 'notes' field in the pivot
                    ->withTimestamps(); // Automatically handle timestamps
    }
  
    public function instructions()
    {
     return $this->hasMany(Instruction::class);
    }
    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

    // Scopes
    public function scopePublished(Builder $query): void
    {
        $query->where('is_published', false);
    }

    public function scopePopular(Builder $query): void
    {
        $query->orderBy('views_count', 'desc');
    }
    // Define the many-to-many relationship with tags
    
}