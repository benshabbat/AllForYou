import React, { createContext, useContext, useState } from 'react';

const RecipeContext = createContext();

export const useRecipeContext = () => useContext(RecipeContext);

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [filter, setFilter] = useState([]);

  const value = {
    recipes,
    setRecipes,
    filter,
    setFilter
  };

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
};