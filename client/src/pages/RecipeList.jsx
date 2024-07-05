import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes } from '../store/slices/recipeSlice';
import RecipeCard from '../components/RecipeCard';
import RecipeFilter from '../components/RecipeFilter';

function RecipeList() {
  const dispatch = useDispatch();
  const { recipes, isLoading, error } = useSelector((state) => state.recipes);

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  if (isLoading) return <div>טוען מתכונים...</div>;
  if (error) return <div>שגיאה: {error}</div>;

  return (
    <div className="recipe-list">
      <h2>רשימת מתכונים</h2>
      <RecipeFilter />
      <div className="recipes-grid">
        {recipes.map(recipe => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default RecipeList;