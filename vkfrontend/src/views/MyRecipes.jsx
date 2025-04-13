import React, { useEffect, useState, useCallback } from "react"; // Add useCallback here
import { useRecipeContext } from "../context/RecipeContext";
import { useStateContext } from "../context/ContextProvider.jsx";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";

const MyRecipes = () => {
  const { token } = useStateContext();
  const { recipes, setRecipes, loading, error } = useRecipeContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  // Image handling function
  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath) return "/default-recipe.jpg";
    if (imagePath.startsWith('http')) return imagePath;
    return `${import.meta.env.VITE_API_BASE_URL}/storage/${imagePath.replace(/^\/+/, '')}`;
  }, []);

  // Fetch recipes
  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const response = await axiosClient.get("/profile/recipes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Process recipes before setting state
        const processedRecipes = response.data.recipes.map(recipe => {
          return {
            ...recipe,
            // Only set default category if both category and category_id are null/undefined
            category: recipe.category || (recipe.category_id ? { name: 'Loading...' } : { name: 'Uncategorized' })
          };
        });
        
        setRecipes(processedRecipes);

        // Fetch complete recipe data for each recipe
        const recipePromises = processedRecipes.map(recipe => 
          axiosClient.get(`/recipes/${recipe.id}`)
        );

        const fullRecipes = await Promise.all(recipePromises);
        const updatedRecipes = fullRecipes.map(response => response.data.recipe);
        setRecipes(updatedRecipes);

      } catch (err) {
        console.error("Error fetching user recipes:", err);
      }
    };

    fetchMyRecipes();
  }, [token]);

  // Delete confirmation handler
  const confirmDelete = (recipe) => {
    setRecipeToDelete(recipe);
    setShowDeleteConfirm(true);
  };

  // Delete recipe handler
  const handleDelete = async () => {
    if (!recipeToDelete) return;

    setIsDeleting(true);
    try {
      await axiosClient.delete(`/recipes/${recipeToDelete.id}`);
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== recipeToDelete.id));
      setShowDeleteConfirm(false);
      setRecipeToDelete(null);
    } catch (err) {
      console.error("Error deleting recipe:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        Error loading your recipes: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold text-gray-800">Your Recipes</h1>
        <Link
          to="/recipes/new"
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Create New Recipe
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-lg">
          <div className="text-gray-500 text-xl mb-4">You don't have any recipes yet!</div>
          <Link
            to="/recipes/new"
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            Create your first recipe →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <div 
              key={recipe.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={getImageUrl(recipe.image)}
                  alt={recipe.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl font-bold text-white">{recipe.title}</h2>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    recipe.category?.name === 'Loading...' 
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-orange-100 text-orange-600'
                  }`}>
                    {recipe.category?.name}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                    {recipe.difficulty}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <Link
                    to={`/recipes/${recipe.id}/edit`}
                    className="px-4 py-2 text-sm bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
                  >
                    Edit Recipe
                  </Link>
                  <button
                    onClick={() => confirmDelete(recipe)}
                    className="px-4 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Delete Recipe?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{recipeToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  'Delete Recipe'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRecipes;
