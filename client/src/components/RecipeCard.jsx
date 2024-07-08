import React from 'react';
import { Link } from 'react-router-dom';
import styles from './RecipeCard.module.css';

const RecipeCard = ({ recipe }) => {
  console.log('RecipeCard received recipe:', recipe);

  if (!recipe || !recipe._id || !recipe.name) {
    console.error('Invalid recipe data:', recipe);
    return null;
  }

  return (
    <div className={styles.recipeCard}>
      <h3 className={styles.recipeTitle}>{recipe.name}</h3>
      {recipe.description && <p className={styles.recipeDescription}>{recipe.description}</p>}
      <div className={styles.recipeDetails}>
        {recipe.prepTime && <span>זמן הכנה: {recipe.prepTime} דקות</span>}
        {recipe.difficulty && <span>רמת קושי: {recipe.difficulty}</span>}
      </div>
      <Link to={`/recipe/${recipe._id}`} className={styles.viewRecipeButton}>
        צפה במתכון
      </Link>
    </div>
  );
};

export default RecipeCard;