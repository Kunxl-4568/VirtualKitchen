import { Link } from 'react-router-dom';

function RecipeCard({ recipe, className = '' }) {
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder-recipe.jpg";
    if (imagePath.startsWith('http')) return imagePath;
    try{
      return `${import.meta.env.VITE_API_BASE_URL}/storage/${imagePath}`; // Ensure no leading slash
    } catch (error) {
      console.error("Error constructing image URL:", error);
      
    }
  };
  return (
    <div className={`group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl 
                     transform hover:-translate-y-1 transition-all duration-300 ${className}`}>
      {/* Image Container with Overlay */}
      <div className="relative overflow-hidden">
        <img
          src={getImageUrl(recipe.image)}
          alt={recipe.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.onerror = null;
           // e.target.src = "/placeholder-recipe.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 
                      group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Difficulty Badge */}
        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium 
                       ${recipe.difficulty === 'easy' ? 'bg-green-500' : 
                         recipe.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'} 
                         text-white shadow-lg`}>
          {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
        </span>
      </div>

      {/* Content Container */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-bold text-xl mb-2 text-gray-800 group-hover:text-orange-600 
                     transition-colors duration-300 line-clamp-2">
          {recipe.title}
        </h3>

        {/* Recipe Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{recipe.cook_time} mins</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{recipe.servings} servings</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {recipe.description}
        </p>

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.tags.map((tag, index) => (
              <span key={index} 
                    className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 
                             rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* Author Info */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {recipe.user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <span className="text-sm text-gray-600">{recipe.user?.name || 'Unknown Chef'}</span>
          </div>

          {/* View Recipe Link */}
          <Link
            to={`/recipes/${recipe.id}`}
            className="inline-flex items-center gap-1 text-orange-600 font-medium text-sm
                     hover:text-orange-700 transition-colors duration-200"
          >
            View Recipe
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
