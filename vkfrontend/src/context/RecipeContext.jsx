import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosClient from "../axios-client";
import debounce from "lodash/debounce";  // We will use lodash's debounce to prevent rapid requests.

const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    cuisine: "",
    ingredients: [],
  });
  const [cuisines, setCuisines] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [categories, setCategories] = useState([]); // Add categories state

  // Debounced fetch function for the list of recipes
  const debouncedFetchRecipes = useCallback(
    debounce(async (params = {}) => {
      setLoading(true);
      try {
        const response = await axiosClient.get("/recipes", {
          params: { ...params, page: pagination.currentPage },
        });

        const fetchedData = response.data.recipes;
        setRecipes(fetchedData.data);
        setPagination({
          currentPage: fetchedData.current_page,
          totalPages: fetchedData.last_page,
          totalItems: fetchedData.total,
        });
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching recipes");
      } finally {
        setLoading(false);
      }
    }, 500), // 500ms debounce delay
    [pagination.currentPage]
  );

  // Debounced fetch function for a specific recipe by ID
  const debouncedFetchRecipeById = useCallback(
    debounce(async (id) => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/recipes/${id}`);
        setRecipeDetails(response.data.recipe);  // Correctly update recipe details here
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching recipe");
      } finally {
        setLoading(false);
      }
    }, 500),  // 500ms debounce delay
    [] // The debounce function does not depend on any other variables
  );
  

  useEffect(() => {
    debouncedFetchRecipes(filters);  // Trigger the debounced API call when filters change
  }, [filters, debouncedFetchRecipes]);

  const fetchCuisines = async () => {
    try {
      const response = await axiosClient.get("/cuisines");
      setCuisines(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching cuisines");
    }
  };

  const fetchIngredients = async () => {
    try {
      const response = await axiosClient.get("/ingredients");
      setIngredients(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching ingredients");
    }
  };

  const fetchCategories = async () => { // Add fetchCategories function
    try {
      const response = await axiosClient.get("/categories");
      setCategories(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching categories");
    }
  };

  const createRecipe = async (recipeData) => {
    try {
      const response = await axiosClient.post("/recipes", recipeData);
      setRecipes((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error creating recipe");
      throw err;
    }
  };

  const updateRecipe = async (id, updatedData) => {
    try {
      const response = await axiosClient.put(`/recipes/${id}?_method=PUT`, updatedData, {
        headers: {
          'Content-Type': updatedData instanceof FormData ? 'multipart/form-data' : 'application/json',
        }
      });

      // Update local state if the request was successful
      if (response.status === 200) {
        setRecipes(prev => prev.map(recipe => 
          recipe.id === id ? response.data.recipe : recipe
        ));
        setRecipeDetails(response.data.recipe);
      }

      return response;
    } catch (error) {
      console.error('Update Recipe Error:', error);
      throw error;
    }
  };

  const deleteRecipe = async (id) => {
    try {
      await axiosClient.delete(`/recipes/${id}`);
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting recipe");
      throw err;
    }
  };

  const goToPage = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        cuisines,
        categories, // Add this
        ingredients,
        pagination,
        loading,
        error,
        filters,
        fetchRecipes: debouncedFetchRecipes,
        fetchRecipeById: debouncedFetchRecipeById,
        fetchCuisines,
        fetchCategories, // Add this
        fetchIngredients,
        setFilters,
        setRecipes,
        createRecipe,
        updateRecipe,
        deleteRecipe,
        goToPage,
        recipeDetails, // Now passing the recipe details
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipeContext = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipeContext must be used within a RecipeProvider");
  }
  return context;
};
