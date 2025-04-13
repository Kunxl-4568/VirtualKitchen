// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ContextProvider } from './context/ContextProvider';  // Import your StateContext (user context)
import { RecipeProvider } from './context/RecipeContext';  // Import your RecipeContext (recipe context)
import Router from './Router';  // Your routing component
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <BrowserRouter>
    <ContextProvider>
      <RecipeProvider>
        <Router />
      </RecipeProvider>
    </ContextProvider>
  </BrowserRouter>
</React.StrictMode>
);
