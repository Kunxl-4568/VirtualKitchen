import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecipeContext } from "../context/RecipeContext";
import { useStateContext } from "../context/ContextProvider";

const UpdateRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    recipeDetails,
    fetchRecipeById,
    updateRecipe,
    loading,
    error,
    ingredients: availableIngredients,
    fetchIngredients,
    cuisines,
    fetchCuisines,
    categories, // Add this
    fetchCategories, // Add this
  } = useRecipeContext();
  const { token, setNotification } = useStateContext(); // Add setNotification here

  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    ingredients: [{ id: "", quantity: "", unit: "" }],
    instructions: [""], // Change from [{step: ""}] to [""]
    prepTime: "",
    cookTime: "",
    servings: "",
    difficulty: "easy",
    image: null,
    imagePreview: null,
    categoryId: "",
    cuisineId: "",
    tags: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch recipe details, ingredients, and cuisines
  useEffect(() => {
    if (id) {
      fetchRecipeById(id); // Fetch recipe details
    }
    fetchIngredients(); // Fetch available ingredients
    fetchCuisines(); // Fetch available cuisines
    fetchCategories(); // Add this
  }, [id]);

  // Update the useEffect where we set recipe state
  useEffect(() => {
    if (recipeDetails) {
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        title: recipeDetails.title || "",
        description: recipeDetails.description || "",
        ingredients: recipeDetails.ingredients?.length 
          ? recipeDetails.ingredients.map(ing => ({
              id: ing.id?.toString() || "",
              quantity: ing.pivot?.quantity || "",
              unit: ing.pivot?.unit || ""
            }))
          : [{ id: "", quantity: "", unit: "" }],
        instructions: recipeDetails.instructions?.length
          ? recipeDetails.instructions.map(inst => inst.description || "")
          : [""],
        prepTime: recipeDetails.prep_time?.toString() || "",
        cookTime: recipeDetails.cook_time?.toString() || "",
        servings: recipeDetails.servings?.toString() || "",
        difficulty: recipeDetails.difficulty || "easy",
        imagePreview: recipeDetails.image 
          ? `${import.meta.env.VITE_API_BASE_URL}/storage/${recipeDetails.image}`
          : null,
        categoryId: recipeDetails.category_id?.toString() || "",
        cuisineId: recipeDetails.cuisine_id?.toString() || "",
        tags: Array.isArray(recipeDetails.tags) ? recipeDetails.tags : [],
      }));
    }
  }, [recipeDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Start loading

    try {
      // Validate required fields
      if (!recipe.title || !recipe.description || !recipe.prepTime || !recipe.cookTime || !recipe.servings || !recipe.categoryId) {
        alert('Please fill in all required fields');
        return;
      }

      // Validate ingredients
      const invalidIngredients = recipe.ingredients.some(ing => !ing.id || !ing.quantity);
      if (invalidIngredients) {
        alert('Please fill in all ingredient fields (ingredient and quantity are required)');
        return;
      }

      // Filter out empty instructions
      const validInstructions = recipe.instructions.filter(instruction => instruction?.trim() !== '');
      if (validInstructions.length === 0) {
        alert('Please add at least one instruction');
        return;
      }

      const recipeData = {
        title: recipe.title,
        description: recipe.description,
        prep_time: parseInt(recipe.prepTime, 10) || 0,
        cook_time: parseInt(recipe.cookTime, 10) || 0,
        servings: parseInt(recipe.servings, 10) || 1,
        difficulty: recipe.difficulty,
        category_id: recipe.categoryId,
        cuisine_id: recipe.cuisineId || null,
        ingredients: recipe.ingredients.map((ingredient) => ({
          id: ingredient.id,
          quantity: ingredient.quantity,
          unit: ingredient.unit || null,
        })),
        instructions: validInstructions,
      };

      const formData = new FormData();
      
      if (recipe.image) {
        formData.append('image', recipe.image);
      }

      // Append basic fields
      Object.keys(recipeData).forEach(key => {
        if (key === 'ingredients') {
          recipeData.ingredients.forEach((ing, index) => {
            formData.append(`ingredients[${index}][id]`, ing.id);
            formData.append(`ingredients[${index}][quantity]`, ing.quantity);
            if (ing.unit) formData.append(`ingredients[${index}][unit]`, ing.unit);
          });
        } else if (key === 'instructions') {
          recipeData.instructions.forEach((instruction, index) => {
            formData.append(`instructions[${index}]`, instruction);
          });
        } else {
          formData.append(key, recipeData[key]);
        }
      });

      const response = await updateRecipe(id, recipe.image ? formData : recipeData);

      if (response.status === 200) {
        setNotification('✅ Recipe updated successfully!');
        // Show success message before navigating
        setTimeout(() => {
          navigate(`/recipes/${id}`);
        }, 1500); // Wait 1.5 seconds before redirecting
      }
    } catch (error) {
      console.error('Update error:', error);
      if (error.response?.status === 422) {
        // Validation errors
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join('\n');
        setNotification(`❌ ${errorMessages}`, 'error');
      } else if (error.response?.status === 404) {
        setNotification('❌ Recipe not found', 'error');
      } else {
        setNotification('❌ Failed to update recipe. Please try again.', 'error');
      }
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  if (loading || !recipeDetails || !availableIngredients || !cuisines) {
    return <p>Loading...</p>;
  }

  if (error) return <p>{error}</p>;

  const baseInputStyle = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 bg-white shadow-sm";

// Update the return statement with enhanced styling
return (
  <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-8 border border-gray-100">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl p-8 group transition-all duration-300 hover:from-blue-500 hover:to-blue-700 transform hover:scale-[1.02] hover:shadow-xl">
        <div className="relative z-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight group-hover:scale-105 transition-transform duration-300 text-shadow">
            Update Recipe
          </h2>
          <p className="text-blue-50 text-lg font-medium opacity-90 group-hover:opacity-100 transition-opacity duration-300">
            Refine your culinary masterpiece
          </p>
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl transform rotate-45 group-hover:scale-150 transition-transform duration-500"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-white/10 rounded-full blur-xl transform -rotate-45 group-hover:scale-150 transition-transform duration-500"></div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Recipe Title</label>
        <input
          type="text"
          value={recipe.title}
          onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
          required
          className={baseInputStyle}
          placeholder="Enter recipe title"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={recipe.description}
          onChange={(e) => setRecipe({ ...recipe, description: e.target.value })}
          required
          rows={4}
          className={`${baseInputStyle} resize-none`}
          placeholder="Describe your recipe"
        />
      </div>

      {/* Time and Servings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Prep Time (mins)</label>
          <input
            type="number"
            value={recipe.prepTime}
            onChange={(e) => setRecipe({ ...recipe, prepTime: e.target.value })}
            required
            className={baseInputStyle}
            min="0"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Cook Time (mins)</label>
          <input
            type="number"
            value={recipe.cookTime}
            onChange={(e) => setRecipe({ ...recipe, cookTime: e.target.value })}
            required
            className={baseInputStyle}
            min="0"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Servings</label>
          <input
            type="number"
            value={recipe.servings}
            onChange={(e) => setRecipe({ ...recipe, servings: e.target.value })}
            required
            className={baseInputStyle}
            min="1"
          />
        </div>
      </div>

      {/* Category, Cuisine, and Difficulty Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={recipe.categoryId}
            onChange={(e) => setRecipe({ ...recipe, categoryId: e.target.value })}
            required
            className={baseInputStyle}
          >
            <option value="">Select Category</option>
            {categories?.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Cuisine</label>
          <select
            value={recipe.cuisineId}
            onChange={(e) => setRecipe({ ...recipe, cuisineId: e.target.value })}
            required
            className={baseInputStyle}
          >
            <option value="">Select Cuisine</option>
            {cuisines?.map(cuisine => (
              <option key={cuisine.id} value={cuisine.id}>{cuisine.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Difficulty</label>
          <select
            value={recipe.difficulty}
            onChange={(e) => setRecipe({ ...recipe, difficulty: e.target.value })}
            required
            className={baseInputStyle}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      

      {/* Enhanced Ingredients Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">Ingredients</label>
          <button
            type="button"
            onClick={() => setRecipe({
              ...recipe,
              ingredients: [...recipe.ingredients, { id: "", quantity: "", unit: "" }]
            })}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
            </svg>
            Add Ingredient
          </button>
        </div>
        {recipe.ingredients.map((ingredient, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <select
              value={ingredient.id}
              onChange={(e) => {
                const updated = [...recipe.ingredients];
                updated[index].id = e.target.value;
                setRecipe({ ...recipe, ingredients: updated });
              }}
              required
              className={`${baseInputStyle} md:w-2/5`}
            >
              <option value="">Select Ingredient</option>
              {availableIngredients?.map(ing => (
                <option key={ing.id} value={ing.id}>{ing.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Quantity"
              value={ingredient.quantity}
              onChange={(e) => {
                const updated = [...recipe.ingredients];
                updated[index].quantity = e.target.value;
                setRecipe({ ...recipe, ingredients: updated });
              }}
              required
              className={`${baseInputStyle} md:w-1/5`}
            />
            <input
              type="text"
              placeholder="Unit (optional)"
              value={ingredient.unit}
              onChange={(e) => {
                const updated = [...recipe.ingredients];
                updated[index].unit = e.target.value;
                setRecipe({ ...recipe, ingredients: updated });
              }}
              className={`${baseInputStyle} md:w-1/5`}
            />
            {recipe.ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  const updated = recipe.ingredients.filter((_, i) => i !== index);
                  setRecipe({ ...recipe, ingredients: updated });
                }}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Enhanced Instructions Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">Instructions</label>
          <button
            type="button"
            onClick={() => setRecipe({
              ...recipe,
              instructions: [...recipe.instructions, ""]
            })}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
            </svg>
            Add Step
          </button>
        </div>
        {recipe.instructions.map((instruction, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
              {index + 1}
            </div>
            <div className="flex-grow">
              <textarea
                value={instruction || ""} // Ensure value is never undefined
                onChange={(e) => {
                  const updated = [...recipe.instructions];
                  updated[index] = e.target.value;
                  setRecipe({ ...recipe, instructions: updated });
                }}
                required
                className={baseInputStyle}
                placeholder={`Step ${index + 1}`}
                rows={2}
              />
            </div>
            {recipe.instructions.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  const updated = recipe.instructions.filter((_, i) => i !== index);
                  setRecipe({ ...recipe, instructions: updated });
                }}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Enhanced Submit Button */}
      <div className="pt-6">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
            ${isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02]`}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating Recipe...
            </div>
          ) : (
            'Update Recipe'
          )}
        </button>
      </div>
    </form>
  </div>
);
};

export default UpdateRecipe;