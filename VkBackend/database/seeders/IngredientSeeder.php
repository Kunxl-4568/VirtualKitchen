<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ingredient;

class IngredientSeeder extends Seeder
{
    public function run()
    {
        $ingredients = [
            // Main Proteins
            ['name' => 'Chicken Breast', 'description' => 'Lean meat from chicken', 'is_allergen' => false],
            ['name' => 'Lamb', 'description' => 'Meat from young sheep', 'is_allergen' => false],
            ['name' => 'Beef', 'description' => 'Red meat from cattle', 'is_allergen' => false],
            ['name' => 'Fish', 'description' => 'Fresh water or sea fish', 'is_allergen' => true],
            ['name' => 'Tofu', 'description' => 'Soybean curd', 'is_allergen' => true],
            ['name' => 'Paneer', 'description' => 'Fresh cottage cheese', 'is_allergen' => true],

            // Vegetables
            ['name' => 'Tomato', 'description' => 'Fresh red tomatoes', 'is_allergen' => false],
            ['name' => 'Onion', 'description' => 'Red or white onions', 'is_allergen' => false],
            ['name' => 'Potato', 'description' => 'Starchy root vegetable', 'is_allergen' => false],
            ['name' => 'Capsicum', 'description' => 'Bell peppers of various colors', 'is_allergen' => false],
            ['name' => 'Carrot', 'description' => 'Orange root vegetable', 'is_allergen' => false],
            ['name' => 'Cauliflower', 'description' => 'White cruciferous vegetable', 'is_allergen' => false],
            ['name' => 'Green Peas', 'description' => 'Fresh or frozen peas', 'is_allergen' => false],

            // Indian Spices
            ['name' => 'Turmeric Powder', 'description' => 'Yellow spice powder', 'is_allergen' => false],
            ['name' => 'Cumin Seeds', 'description' => 'Whole or ground cumin', 'is_allergen' => false],
            ['name' => 'Coriander Powder', 'description' => 'Ground coriander seeds', 'is_allergen' => false],
            ['name' => 'Garam Masala', 'description' => 'Mixed Indian spices', 'is_allergen' => false],
            ['name' => 'Red Chili Powder', 'description' => 'Ground red chilies', 'is_allergen' => false],

            // Asian Ingredients
            ['name' => 'Soy Sauce', 'description' => 'Fermented soybean sauce', 'is_allergen' => true],
            ['name' => 'Ginger', 'description' => 'Fresh ginger root', 'is_allergen' => false],
            ['name' => 'Garlic', 'description' => 'Fresh garlic cloves', 'is_allergen' => false],
            ['name' => 'Sesame Oil', 'description' => 'Flavored oil from sesame', 'is_allergen' => true],

            // Italian Ingredients
            ['name' => 'Olive Oil', 'description' => 'Extra virgin olive oil', 'is_allergen' => false],
            ['name' => 'Basil', 'description' => 'Fresh basil leaves', 'is_allergen' => false],
            ['name' => 'Oregano', 'description' => 'Dried oregano herbs', 'is_allergen' => false],
            ['name' => 'Pasta', 'description' => 'Various pasta shapes', 'is_allergen' => true],

            // Dairy & Eggs
            ['name' => 'Cheese', 'description' => 'Various types of cheese', 'is_allergen' => true],
            ['name' => 'Butter', 'description' => 'Unsalted butter', 'is_allergen' => true],
            ['name' => 'Milk', 'description' => 'Full-fat milk', 'is_allergen' => true],
            ['name' => 'Cream', 'description' => 'Heavy cream', 'is_allergen' => true],
            ['name' => 'Eggs', 'description' => 'Fresh chicken eggs', 'is_allergen' => true],
            ['name' => 'Yogurt', 'description' => 'Plain yogurt', 'is_allergen' => true],

            // Baking Essentials
            ['name' => 'All-Purpose Flour', 'description' => 'Refined wheat flour', 'is_allergen' => true],
            ['name' => 'Sugar', 'description' => 'White granulated sugar', 'is_allergen' => false],
            ['name' => 'Baking Powder', 'description' => 'Leavening agent', 'is_allergen' => false],
            ['name' => 'Vanilla Extract', 'description' => 'Flavoring essence', 'is_allergen' => false],

            // Basic Seasonings
            ['name' => 'Salt', 'description' => 'Regular table salt', 'is_allergen' => false],
            ['name' => 'Black Pepper', 'description' => 'Ground black pepper', 'is_allergen' => false],
            ['name' => 'White Pepper', 'description' => 'Ground white pepper', 'is_allergen' => false],

            // Fresh Herbs
            ['name' => 'Coriander Leaves', 'description' => 'Fresh cilantro', 'is_allergen' => false],
            ['name' => 'Mint Leaves', 'description' => 'Fresh mint', 'is_allergen' => false],
            ['name' => 'Parsley', 'description' => 'Fresh parsley', 'is_allergen' => false],
            ['name' => 'Thyme', 'description' => 'Fresh thyme', 'is_allergen' => false],

            // Rice & Grains
            ['name' => 'Basmati Rice', 'description' => 'Long grain aromatic rice', 'is_allergen' => false],
            ['name' => 'Brown Rice', 'description' => 'Whole grain rice', 'is_allergen' => false],
            ['name' => 'Quinoa', 'description' => 'Protein-rich grain', 'is_allergen' => false]
        ];

        foreach ($ingredients as $ingredient) {
            Ingredient::create($ingredient);
        }
    }
}
