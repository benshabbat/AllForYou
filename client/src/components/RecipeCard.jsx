import React from 'react';
import { Link } from 'react-router-dom';
import styles from './RecipeCard.module.css';

const RecipeCard = ({ recipe }) => {
  console.log('RecipeCard received recipe:', recipe);

  if (!recipe) {
    console.error('Recipe is undefined in RecipeCard');
    return null;
  }

  return (
    <div className={styles.recipeCard}>
      <h3 className={styles.recipeTitle}>{recipe.name}</h3>
      <p className={styles.recipeDescription}>{recipe.description}</p>
      <div className={styles.recipeDetails}>
        <span>זמן הכנה: {recipe.prepTime} דקות</span>
        <span>רמת קושי: {recipe.difficulty}</span>
      </div>
      <Link to={`/recipe/${recipe._id}`} className={styles.viewRecipeButton}>
        צפה במתכון
      </Link>
    </div>
  );
};

export default RecipeCard;