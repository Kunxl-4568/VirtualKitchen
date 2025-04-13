<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RecipeController;
use App\Http\Controllers\Api\CuisineController;
use App\Http\Controllers\Api\IngredientController;
use App\Http\Controllers\Api\CategoryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public Routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'signup']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::get('/cuisines', [CuisineController::class, 'index']);
Route::get('/cuisines/{cuisine}', [CuisineController::class, 'show']);
Route::get('/ingredients', [IngredientController::class, 'index']);
Route::get('/ingredients/{ingredient}', [IngredientController::class, 'show']);
Route::get('/recipes', [RecipeController::class, 'index']);
Route::get('/recipes/{recipe}', [RecipeController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);

// Authenticated Routes (User must be logged in)
Route::middleware(['auth:sanctum'])->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Recipe Interactions
    Route::post('/recipes', [RecipeController::class, 'store']);
    Route::put('/recipes/{recipe}', [RecipeController::class, 'update']);
    Route::delete('/recipes/{recipe}', [RecipeController::class, 'destroy']);

    // User Profile
    Route::prefix('profile')->group(function () {
        Route::get('/recipes', [RecipeController::class, 'userRecipes']);
    });
});

// Admin-only Routes
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::apiResource('cuisines', CuisineController::class)->except(['index', 'show']);
    Route::apiResource('ingredients', IngredientController::class)->except(['index', 'show']);
    
    // Extended admin recipe management
    Route::patch('/recipes/{recipe}/publish', [RecipeController::class, 'publish']);
    Route::patch('/recipes/{recipe}/unpublish', [RecipeController::class, 'unpublish']);
});