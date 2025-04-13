import React, { useEffect, useState, useCallback } from 'react';
import { useRecipeContext } from '../context/RecipeContext';
import RecipeCard from '../components/RecipeCard';
import KitchenLogo from '../assets/KitchenLogo.jpeg';

const DiscoverRecipe = () => {
  const {
    recipes,
    loading,
    error,
    cuisines,
    categories,
    fetchRecipes,
    fetchCuisines,
    fetchCategories,
  } = useRecipeContext();

  const [filters, setFilters] = useState({
    cuisine: '',
    category: '',
    difficulty: '',
    sort: 'latest'
  });

  // Fetch initial data
  useEffect(() => {
    fetchCuisines();
    fetchCategories();
  }, []);

  // Apply filters
  useEffect(() => {
    const queryParams = {
      ...filters,
      page: 1
    };
    fetchRecipes(queryParams);
  }, [filters]);

  // Add this function to filter and sort recipes
  const getFilteredAndSortedRecipes = useCallback(() => {
    if (!recipes.length) return [];

    let filtered = [...recipes];

    // Apply filters
    if (filters.cuisine) {
      filtered = filtered.filter(recipe => recipe.cuisine_id.toString() === filters.cuisine);
    }
    if (filters.category) {
      filtered = filtered.filter(recipe => recipe.category_id.toString() === filters.category);
    }
    if (filters.difficulty) {
      filtered = filtered.filter(recipe => recipe.difficulty === filters.difficulty);
    }

    // Apply sorting
    switch (filters.sort) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'popular':
        filtered.sort((a, b) => b.views_count - a.views_count);
        break;
      case 'quick':
        filtered.sort((a, b) => (a.prep_time + a.cook_time) - (b.prep_time + b.cook_time));
        break;
      default:
        break;
    }

    return filtered;
  }, [recipes, filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src={KitchenLogo}
                alt="Virtual Kitchen" 
                className="h-12 w-auto"
              />
              <h1 className="ml-4 text-2xl font-bold text-white">
                Discover Recipes
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              
              {/* Cuisine Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuisine
                </label>
                <select
                  value={filters.cuisine}
                  onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All Cuisines</option>
                  {cuisines?.map(cuisine => (
                    <option key={cuisine.id} value={cuisine.id}>
                      {cuisine.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All Categories</option>
                  {categories?.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Any Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-orange-500"
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Most Popular</option>
                  <option value="quick">Quick to Make</option>
                </select>
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={() => setFilters({
                  cuisine: '',
                  category: '',
                  difficulty: '',
                  sort: 'latest'
                })}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Recipe Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-600">
                {error}
              </div>
            ) : recipes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No recipes found matching your criteria
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Found {getFilteredAndSortedRecipes().length} recipes
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredAndSortedRecipes().map(recipe => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      className="transform hover:scale-105 transition-all duration-300"
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverRecipe;