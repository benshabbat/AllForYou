import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/slices/recipeSlice';

export const useRecipeCard = (recipe) => {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.recipes.favorites);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(favorites.includes(recipe._id));
  }, [favorites, recipe._id]);

  const handleFavoriteClick = useCallback((e) => {
    e.preventDefault();
    dispatch(toggleFavorite(recipe._id));
  }, [dispatch, recipe._id]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleFavoriteClick(e);
    }
  }, [handleFavoriteClick]);

  return {
    isFavorite,
    handleFavoriteClick,
    handleKeyPress
  };
};