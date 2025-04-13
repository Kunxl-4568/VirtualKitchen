import { useEffect, useState } from 'react';
import axiosClient from "../axios-client.js";
import { useNavigate } from 'react-router-dom';  // Use useNavigate instead of Navigate

const AddRecipeForm = () => {
  const navigate = useNavigate();  // Add this hook at the top level
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState([{ id: '', quantity: '', unit: '' }]);
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [instructions, setInstructions] = useState([{ step: '' }]);
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [cuisineId, setCuisineId] = useState('');
  const [tags, setTags] = useState([]);

  const [categories, setCategories] = useState([]);
  const [cuisines, setCuisines] = useState([]);

  // Fetch categories and cuisines on mount
  useEffect(() => {
    axiosClient.get('/categories')
      .then(({ data }) => setCategories(data))
      .catch(err => console.error('Error fetching categories:', err));

    axiosClient.get('/cuisines')
      .then(({ data }) => setCuisines(data))
      .catch(err => console.error('Error fetching cuisines:', err));
  }, []);

  // Fetch available ingredients on mount
  useEffect(() => {
    axiosClient.get('/ingredients')  // Assuming /ingredients endpoint returns list of available ingredients
      .then(({ data }) => setAvailableIngredients(data))
      .catch(err => console.error('Error fetching ingredients:', err));
  }, []);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { id: '', quantity: '', unit: '' }]);
  };

  const handleRemoveIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

  const handleIngredientChange = (e, index) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      id: e.target.value
    };
    setIngredients(updatedIngredients);
  };

  const handleQuantityChange = (e, index) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index].quantity = e.target.value;
    setIngredients(updatedIngredients);
  };

  const handleUnitChange = (e, index) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index].unit = e.target.value;
    setIngredients(updatedIngredients);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      
      // Append image if exists
      if (image) {
        formData.append('image', image);
      }

      // Append basic fields
      formData.append('title', title);
      formData.append('description', description);
      formData.append('prep_time', prepTime);
      formData.append('cook_time', cookTime);
      formData.append('servings', servings);
      formData.append('difficulty', difficulty);
      formData.append('category_id', categoryId);
      if (cuisineId) formData.append('cuisine_id', cuisineId);

      // Append ingredients
      ingredients.forEach((ing, index) => {
        formData.append(`ingredients[${index}][id]`, ing.id);
        formData.append(`ingredients[${index}][quantity]`, ing.quantity);
        if (ing.unit) {
          formData.append(`ingredients[${index}][unit]`, ing.unit);
        }
      });

      // Append instructions
      instructions.forEach((instruction, index) => {
        if (instruction.step?.trim()) {
          formData.append(`instructions[${index}]`, instruction.step);
        }
      });

      const response = await axiosClient.post('/recipes', formData);

      if (response.data) {
        alert('Recipe created successfully!');
        navigate('/my-recipes');  // Use navigate function instead of Navigate component
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Error creating recipe. Please try again.');
    }
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, { step: '' }]);
  };
  const handleRemoveInstruction = (index) => {
    const updatedInstructions = [...instructions];
    updatedInstructions.splice(index, 1);
    setInstructions(updatedInstructions);
  };

  const getInputClassName = (value) => {
    return `mt-1 block w-full rounded-lg border ${
      !value ? 'border-red-300' : 'border-gray-300'
    } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm`;
  };
  

  // Add this base input style
const baseInputStyle = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 bg-white shadow-sm";

// Update the form return statement
return (
  <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-8 border border-gray-100">
    <div className="relative overflow-hidden bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl p-8 group transition-all duration-300 hover:from-orange-500 hover:to-orange-700 transform hover:scale-[1.02] hover:shadow-xl">
  <div className="relative z-10 text-center">
    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight group-hover:scale-105 transition-transform duration-300 text-shadow">
      Add a New Recipe
    </h2>
    <p className="text-orange-50 text-lg font-medium opacity-90 group-hover:opacity-100 transition-opacity duration-300">
      Share your culinary masterpiece with the world
    </p>
  </div>
    {/* Decorative elements */}
    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl transform rotate-45 group-hover:scale-150 transition-transform duration-500"></div>
  <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-white/10 rounded-full blur-xl transform -rotate-45 group-hover:scale-150 transition-transform duration-500"></div>
</div>


      {/* Title Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Recipe Title</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          className={baseInputStyle}
          placeholder="Enter recipe title"
        />
      </div>

      {/* Description Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
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
            value={prepTime} 
            onChange={(e) => setPrepTime(e.target.value)} 
            required 
            className={baseInputStyle}
            min="0"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Cook Time (mins)</label>
          <input 
            type="number" 
            value={cookTime} 
            onChange={(e) => setCookTime(e.target.value)} 
            required 
            className={baseInputStyle}
            min="0"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Servings</label>
          <input 
            type="number" 
            value={servings} 
            onChange={(e) => setServings(e.target.value)} 
            required 
            className={baseInputStyle}
            min="1"
          />
        </div>
      </div>

      {/* Category and Cuisine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Difficulty</label>
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)} 
            required 
            className={baseInputStyle}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select 
            value={categoryId} 
            onChange={(e) => setCategoryId(e.target.value)} 
            required 
            className={baseInputStyle}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Cuisine</label>
          <select 
            value={cuisineId} 
            onChange={(e) => setCuisineId(e.target.value)} 
            required 
            className={baseInputStyle}
          >
            <option value="">Select Cuisine</option>
            {cuisines.map(cui => (
              <option key={cui.id} value={cui.id}>{cui.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Recipe Image</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors">
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Upload a file</span>
                <input type="file" onChange={handleImageChange} className="sr-only" accept="image/*"/>
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, WebP up to 2MB</p>
          </div>
        </div>
        {imagePreview && (
          <div className="mt-4">
            <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg shadow-md"/>
          </div>
        )}
      </div>

      {/* Ingredients Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">Ingredients</label>
          <button
            type="button"
            onClick={handleAddIngredient}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
            </svg>
            Add Ingredient
          </button>
        </div>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <select
              value={ingredient.id}
              onChange={(e) => handleIngredientChange(e, index)}
              required
              className={`${baseInputStyle} md:w-2/5`}
            >
              <option value="">Select Ingredient</option>
              {availableIngredients.map(ing => (
                <option key={ing.id} value={ing.id}>{ing.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Quantity"
              value={ingredient.quantity}
              onChange={(e) => handleQuantityChange(e, index)}
              required
              className={`${baseInputStyle} md:w-1/5`}
            />
            <input
              type="text"
              placeholder="Unit (optional)"
              value={ingredient.unit}
              onChange={(e) => handleUnitChange(e, index)}
              className={`${baseInputStyle} md:w-1/5`}
            />
            {ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveIngredient(index)}
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

      {/* Instructions Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">Instructions</label>
          <button
            type="button"
            onClick={handleAddInstruction}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
            </svg>
            Add Step
          </button>
        </div>
        {instructions.map((instruction, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
              {index + 1}
            </div>
            <div className="flex-grow">
              <input
                type="text"
                placeholder={`Step ${index + 1}`}
                value={instruction.step}
                onChange={(e) => {
                  const updated = [...instructions];
                  updated[index].step = e.target.value;
                  setInstructions(updated);
                }}
                required
                className={baseInputStyle}
              />
            </div>
            {instructions.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveInstruction(index)}
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

      {/* Submit Button */}
      <div className="pt-6">
        <button 
          type="submit" 
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02]"
        >
          Create Recipe
        </button>
      </div>
    </form>
  </div>
);
};

export default AddRecipeForm;
