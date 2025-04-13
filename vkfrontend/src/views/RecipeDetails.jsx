import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useRecipeContext } from "../context/RecipeContext";

// Add this helper function at the top of your file
const getImageUrl = (imagePath) => {
  if (!imagePath) return "/placeholder-recipe.jpg";
  if (imagePath.startsWith('http')) return imagePath;
  try{
    return `${import.meta.env.VITE_API_BASE_URL}/storage/${imagePath}`; // Ensure no leading slash
  } catch (error) {
    console.error("Error constructing image URL:", error);
    
  }
  
};

const RecipeDetails = () => {
  const { id } = useParams();
  const { recipeDetails, loading, error, fetchRecipeById } = useRecipeContext();

  useEffect(() => {
    if (id) {
      fetchRecipeById(id);
    }
  }, [id, fetchRecipeById]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!recipeDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Recipe not found.</div>
      </div>
    );
  }

  const ingredients = recipeDetails.ingredients || [];
  const instructions = recipeDetails.instructions || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Recipe Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Image Section */}
          <div className="relative h-96">
          {recipeDetails.image ? (
              <img
                src={getImageUrl(recipeDetails.image)}
                alt={recipeDetails.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log("Image failed to load:", e.target.src);
                  e.target.onerror = null; // Prevent infinite loop
                 // e.target.src = "/default-recipe.jpg"; // Fallback image
                }}
                style={{ objectFit: 'cover' }} // Ensure consistent image sizing
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-lg">No image available</span>
              </div>
            )}
            
            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            
            {/* Title and description overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
              <h1 className="text-4xl font-bold text-white mb-2 text-shadow">
                {recipeDetails.title}
              </h1>
              <p className="text-lg text-gray-200 text-shadow">
                {recipeDetails.description}
              </p>
            </div>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-orange-50">
            <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
              <svg className="w-6 h-6 text-orange-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-600">Prep Time</span>
              <span className="font-semibold text-gray-900">{recipeDetails.prep_time} mins</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
              <svg className="w-6 h-6 text-orange-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm text-gray-600">Servings</span>
              <span className="font-semibold text-gray-900">{recipeDetails.servings}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
              <svg className="w-6 h-6 text-orange-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-600">Cook Time</span>
              <span className="font-semibold text-gray-900">{recipeDetails.cook_time} mins</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
              <span className={`text-sm font-semibold px-3 py-1 rounded-full 
                ${recipeDetails.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                  recipeDetails.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'}`}>
                {recipeDetails.difficulty?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-8">
            {/* Ingredients Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Ingredients
              </h2>
              <ul className="space-y-3">
                {ingredients.length > 0 ? (
                  ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                      <span className="w-16 text-sm font-medium text-gray-900">
                        {ingredient.pivot.quantity}
                      </span>
                      <span className="w-16 text-sm text-gray-600">
                        {ingredient.pivot.unit}
                      </span>
                      <span className="flex-1 font-medium">
                        {ingredient.name}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">No ingredients listed.</li>
                )}
              </ul>
            </div>

            {/* Instructions Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Instructions
              </h2>
              <ol className="space-y-4">
                {instructions.length > 0 ? (
                  instructions.map((instruction, index) => (
                    <li key={index} className="flex">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 font-semibold mr-3">
                        {index + 1}
                      </span>
                      <p className="text-gray-700 pt-1">{instruction.description}</p>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">No instructions available.</li>
                )}
              </ol>
            </div>

            {/* Tags Section */}
            {recipeDetails.tags && recipeDetails.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4">
                {recipeDetails.tags.map((tag, index) => (
                  <span key={index} 
                        className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-orange-600 font-semibold">
                    {recipeDetails.user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Created by</p>
                  <p className="text-sm text-gray-600">{recipeDetails.user?.name || 'Unknown Chef'}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {new Date(recipeDetails.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
