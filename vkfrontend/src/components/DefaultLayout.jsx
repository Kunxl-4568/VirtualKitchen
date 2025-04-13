import { useState, useEffect, useCallback, useRef } from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import { useRecipeContext } from "../context/RecipeContext";
import axiosClient from "../axios-client.js";

export default function DefaultLayout() {
  const { user, token, setUser, setToken, notification } = useStateContext();
  const { resetFilters } = useRecipeContext();
  const navigate = useNavigate();

  // Consolidated loading states
  const [isLoading, setIsLoading] = useState({
    user: true,
    recipes: true
  });
  
  const [userRecipes, setUserRecipes] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  
  const sidebarRef = useRef(null);

  // Fetch user data
  useEffect(() => {
    if (token) {
      axiosClient.get('/user')
        .then(({ data }) => {
          setUser(data);
        })
        .catch(() => {
          setToken(null);
        })
        .finally(() => {
          setIsLoading(prev => ({ ...prev, user: false }));
        });
    }
  }, [token]);

  // Fetch user's recipes
  useEffect(() => {
    if (user?.id) {  // Only fetch if we have a user
      axiosClient.get('/profile/recipes')
        .then(({ data }) => {
          setUserRecipes(data.recipes);
        })
        .catch((error) => {
          console.error('Error fetching user recipes:', error);
        })
        .finally(() => {
          setIsLoading(prev => ({ ...prev, recipes: false }));
        });
    }
  }, [user?.id]); // Depend on user.id instead of mounting once

  const onLogout = useCallback((ev) => {
    ev.preventDefault();
    axiosClient.post('/auth/logout')
      .then(() => {
        setUser({});
        setToken(null);
        resetFilters();
        navigate('/');
      })
      .catch(err => console.error('Logout failed:', err));
  }, [setUser, setToken, resetFilters]);

  const handleDelete = useCallback(async (recipeId) => {
    try {
      await axiosClient.delete(`/recipes/${recipeId}`);
      setUserRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
      setShowDeleteConfirm(false);
      setRecipeToDelete(null);
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  }, []);

  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath) return "/placeholder-recipe.jpg";
    if (imagePath.startsWith('http')) return imagePath;
    return `${import.meta.env.VITE_API_BASE_URL}/storage/${imagePath.replace(/^\/+/, '')}`;
  }, []);

  // Redirect if no token
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Show loading spinner while fetching initial data
  if (isLoading.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Enhanced Sidebar */}
      <aside className="bg-gradient-to-b from-gray-900 to-gray-800 text-white w-80 flex flex-col" ref={sidebarRef}>
        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-xl font-bold">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="font-semibold text-lg">{user.name}</h2>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-6 space-y-2">

          <Link to="/discover" 
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Discover Recipes</span>
          </Link>

          <Link to="/recipes/new" 
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Recipe</span>
          </Link>

          {/* User's Recipes Section */}
          <div className="mt-8">
            <h3 className="px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              My Recipes
            </h3>
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {isLoading.recipes ? (
                <div className="text-center text-gray-400 py-4">Loading recipes...</div>
              ) : userRecipes.length > 0 ? (
                userRecipes.map(recipe => (
                  <div 
                    key={recipe.id}
                    className="group flex items-center justify-between px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Link
                      to={`/recipes/${recipe.id}`}
                      className="flex items-center flex-1 text-sm text-gray-300"
                    >
                      {recipe.image && (
                        <img 
                          src={getImageUrl(recipe.image)} 
                          alt={recipe.title}
                          className="w-8 h-8 rounded object-cover mr-3"
                        />
                      )}
                      <span className="truncate">{recipe.title}</span>
                    </Link>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
                        className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                        title="Edit Recipe"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          setRecipeToDelete(recipe);
                          setShowDeleteConfirm(true);
                        }}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete Recipe"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-4">No recipes yet</div>
              )}
            </div>
          </div>

          {/* Admin Section */}
          {user.role === 'admin' && (
            <div className="mt-8">
              <h3 className="px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Admin Controls
              </h3>
              <div className="space-y-2">
                <Link to="/admin/ingredients" 
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                  <span>Manage Ingredients</span>
                </Link>
                <Link to="/admin/cuisines" 
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                  <span>Manage Cuisines</span>
                </Link>
              </div>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Header */}
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">Virtual Kitchen</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={onLogout} 
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>

        {/* Enhanced Notification */}
        {notification && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out animate-fade-in">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M5 13l4 4L19 7" />
              </svg>
              <span>{notification}</span>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && recipeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Recipe</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{recipeToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setRecipeToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(recipeToDelete.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
