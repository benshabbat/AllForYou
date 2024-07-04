import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchRecipes, addRecipe, updateRecipe, deleteRecipe, searchRecipes } from '../api';

const RecipeContext = createContext();

export function useRecipes() {
  return useContext(RecipeContext);
}

export function RecipeProvider({ children }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRecipes = useCallback(async (filter = []) => {
    setLoading(true);
    try {
      const data = await fetchRecipes(filter);
      setRecipes(data);
      setError(null);
    } catch (err) {
      setError('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  }, []);

  const addNewRecipe = useCallback(async (recipeData) => {
    setLoading(true);
    try {
      const newRecipe = await addRecipe(recipeData);
      setRecipes(prevRecipes => [...prevRecipes, newRecipe]);
      setError(null);
    } catch (err) {
      setError('Failed to add recipe');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateExistingRecipe = useCallback(async (id, recipeData) => {
    setLoading(true);
    try {
      const updatedRecipe = await updateRecipe(id, recipeData);
      setRecipes(prevRecipes => prevRecipes.map(recipe => 
        recipe._id === id ? updatedRecipe : recipe
      ));
      setError(null);
    } catch (err) {
      setError('Failed to update recipe');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteExistingRecipe = useCallback(async (id) => {
    setLoading(true);
    try {
      await deleteRecipe(id);
      setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe._id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete recipe');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchForRecipes = useCallback(async (ingredients) => {
    setLoading(true);
    try {
      const results = await searchRecipes(ingredients);
      setRecipes(results);
      setError(null);
    } catch (err) {
      setError('Failed to search recipes');
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    recipes,
    loading,
    error,
    loadRecipes,
    addNewRecipe,
    updateExistingRecipe,
    deleteExistingRecipe,
    searchForRecipes,
  };

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
}