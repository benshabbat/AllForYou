import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/recipe/recipeSlice';
import { UI_STRINGS } from '../constants/uiStrings';

export const useFavorite = (recipeId) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleFavoriteClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      dispatch(toggleFavorite(recipeId));
    } else {
      alert(UI_STRINGS.LOGIN_REQUIRED);
    }
  }, [dispatch, recipeId, user]);

  return handleFavoriteClick;
};