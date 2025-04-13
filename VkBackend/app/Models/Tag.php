<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tag extends Model
{
    protected $fillable = ['recipe_tag'];

    public function recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class , 'recipe_tag');
    }
}