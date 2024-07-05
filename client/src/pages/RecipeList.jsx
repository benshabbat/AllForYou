import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchRecipes } from '../store/slices/recipeSlice';
import RecipeFilter from '../components/RecipeFilter';
import styles from './RecipeList.module.css';

function RecipeList() {
  const dispatch = useDispatch();
  const { recipes, isLoading, error } = useSelector((state) => state.recipes);

  useEffect(() => {
    dispatch(fetchRecipes({}));
  }, [dispatch]);

  if (isLoading) return <div>טוען מתכונים...</div>;
  if (error) return <div>שגיאה: {error}</div>;

  return (
    <div className="container">
      <h2>רשימת מתכונים</h2>
      <RecipeFilter />
      <div className={styles.recipeList}>
        {recipes.map(recipe => (
          <div key={recipe._id} className={styles.recipeCard}>
            <h3 className={styles.recipeTitle}>{recipe.name}</h3>
            <p>{recipe.ingredients.slice(0, 100)}...</p>
            <p className={styles.recipeAllergens}>
              אלרגנים: {recipe.allergens.join(', ')}
            </p>
            <Link to={`/recipes/${recipe._id}`}>צפה במתכון</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipeList;