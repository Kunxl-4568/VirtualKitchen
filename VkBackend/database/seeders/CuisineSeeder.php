<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cuisine;
use Illuminate\Support\Str;

class CuisineSeeder extends Seeder
{
    public function run(): void
    {
        $cuisines = [
            'Indian',
            'Italian',
            'Chinese',
            'Mexican',
            'Thai'
        ];

        foreach ($cuisines as $cuisine) {
            Cuisine::create([
                'name' => $cuisine,
                'slug' => Str::slug($cuisine),
            ]);
        }
    }
}
