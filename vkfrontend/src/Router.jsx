import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import GuestLayout from './components/GuestLayout';
import DefaultLayout from './components/DefaultLayout';
import Login from './views/Login';
import Signup from './views/SignUp';
import RecipeForm from './views/RecipeForm';
import RecipeDetails from './views/RecipeDetails';
import MyRecipes from './views/MyRecipes';
import UpdateRecipe from './views/UpdateRecipe';
import AboutUs from './views/AboutUs';
import DiscoverRecipe from './views/DiscoverRecipe';
import { useStateContext } from './context/ContextProvider';

// Protected Route Component with Loading State
const ProtectedRoute = ({ children }) => {
  const { token, user, loading } = useStateContext();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Guest Only Route Component
const GuestRoute = ({ children }) => {
  const { token, loading } = useStateContext();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }
  
  if (token) {
    return <Navigate to="/my-recipes" />;
  }
  
  return children;
};

// Custom 404 Component
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
    <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
      <h1 className="text-6xl font-bold text-orange-600 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <a 
        href="/"
        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg 
                  hover:from-orange-600 hover:to-red-600 transition-all duration-300 
                  shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        Return Home
      </a>
    </div>
  </div>
);

function Router() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/about" element={<AboutUs />} />
      <Route path="/discover" element={<DiscoverRecipe />} />
      <Route path="/recipes/:id" element={<RecipeDetails />} />

      {/* Guest Layout - Just for homepage */}
      <Route path="/" element={
        <GuestRoute>
          <GuestLayout />
        </GuestRoute>
      } />

      {/* Auth Routes - Separate pages */}
      <Route path="/login" element={
        <GuestRoute>
          <Login />
        </GuestRoute>
      } />
      <Route path="/register" element={
        <GuestRoute>
          <Signup />
        </GuestRoute>
      } />

      {/* Protected Routes with DefaultLayout */}
      <Route element={<ProtectedRoute><DefaultLayout /></ProtectedRoute>}>
        <Route index path="/my-recipes" element={<MyRecipes />} />
        <Route path="/recipes">
          <Route path="new" element={<RecipeForm />} />
          <Route path=":id/edit" element={<UpdateRecipe />} />
        </Route>
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Router;
