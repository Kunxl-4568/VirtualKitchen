import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import { useRecipeContext } from "../context/RecipeContext";
import { useEffect } from "react";
import RecipeCard from "../components/RecipeCard";

export default function GuestLayout() {
  const { token } = useStateContext();
  const { recipes, loading, error, fetchRecipes } = useRecipeContext();

  // Fetch recipes on component mount
  useEffect(() => {
    const fetchGuestRecipes = async () => {
      try {
        await fetchRecipes({
          per_page: 6,  // Limit to 6 recipes
          page: 1
        });
      } catch (err) {
        console.error("Error fetching recipes:", err);
      }
    };

    fetchGuestRecipes();
  }, []); // Run once on mount

  // Remove this check since guest layout should be accessible without token
  // if (token) {
  //   return <Navigate to="/" />;
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Hero Section with Enhanced Design */}
      <header className="relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-400 rounded-b-3xl shadow-xl">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20"> {/* Reduced padding and max-width */}
          <div className="text-center">
            <div className="relative bg-gradient-to-r from-white/20 to-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.2)] inline-block mb-8 group overflow-hidden transition-all duration-500 hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:scale-[1.02] hover:border-white/40 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100 transform-gpu">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight animate-fade-in">
                Welcome to Virtual Kitchen
              </h1>
            </div>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl mx-auto">
              Discover, create, and share amazing recipes from around the world
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <a href="/login" 
                className="w-full sm:w-auto px-8 py-3 bg-white text-red-600 rounded-xl font-semibold
                        hover:bg-red-50 transition-all duration-300 shadow-lg hover:shadow-xl
                        focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600">
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </span>
              </a>

              <a href="/register" 
                className="w-full sm:w-auto px-8 py-3 border-2 border-white text-white rounded-xl font-semibold
                        hover:bg-white hover:text-red-600 transition-all duration-300 shadow-lg hover:shadow-xl
                        focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600">
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Register
                </span>
              </a>
            </div>

            {/* Optional: Decorative elements */}
            <div className="absolute left-0 bottom-0 w-32 h-32 bg-gradient-to-tr from-orange-300 to-transparent opacity-20 rounded-full blur-2xl"></div>
            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-red-500 to-transparent opacity-20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </header>

      {/* Featured Recipes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
          Featured Recipes
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Explore our handpicked selection of delicious recipes crafted by expert chefs
        </p>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-orange-200 animate-spin"></div>
              <div className="w-12 h-12 rounded-full border-t-4 border-orange-600 animate-spin absolute top-0"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : Array.isArray(recipes) && recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.slice(0, 6).map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                className="transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No recipes available at the moment.</p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Why Choose Virtual Kitchen?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: "🍳",
                title: "Extensive Recipe Collection",
                desc: "Access to thousands of curated recipes from around the world"
              },
              {
                icon: "👩‍🍳",
                title: "Expert-Crafted Content",
                desc: "Learn from professional chefs and experienced home cooks"
              },
              {
                icon: "📱",
                title: "Cook Anywhere, Anytime",
                desc: "Access your favorite recipes on any device, whenever you need them"
              }
            ].map((feature, index) => (
              <div key={index} 
                   className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl 
                            shadow-lg hover:shadow-xl transition-all duration-300">
                <span className="text-5xl mb-6 inline-block">{feature.icon}</span>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Pages Outlet */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-xl font-bold mb-4">Virtual Kitchen</h3>
              <p className="text-gray-400">Your perfect cooking companion</p>
            </div>
            <div className="ml-70">
              <h4 className="text-lg font-semibold   mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-400 hover:text-white transition">About Us</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Virtual Kitchen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
