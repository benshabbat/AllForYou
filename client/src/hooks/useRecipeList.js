import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { fetchRecipes as fetchRecipesAction } from '../store/slices/recipeSlice';

export const useRecipeList = (recipesPerPage) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [recipes, setRecipes] = useState([]);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecipes = useCallback(async (params) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await dispatch(fetchRecipesAction({ 
        page: currentPage, 
        limit: recipesPerPage, 
        ...params
      })).unwrap();
      setRecipes(result.recipes);
      setTotalRecipes(result.totalRecipes);
    } catch (err) {
      setError(err.message || 'שגיאה בטעינת המתכונים');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, currentPage, recipesPerPage]);

  return {
    recipes,
    totalRecipes,
    currentPage,
    isLoading,
    error,
    fetchRecipes,
    setCurrentPage
  };
};