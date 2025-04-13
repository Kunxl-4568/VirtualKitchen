<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str; // ✅ ADD THIS

class Category extends Model
{
    protected $fillable = ['name', 'slug'];

    public function recipes(): HasMany
    {
        return $this->hasMany(Recipe::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }
}
