import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from '../styles/RecipeCard.module.css';

function RecipeCard({ recipe }) {
  return (
    <div className={styles.recipeCard}>
      <h3 className={styles.recipeTitle}>{recipe.name}</h3>
      <p className={styles.recipeDescription}>
        {recipe.description || recipe.ingredients.slice(0, 100)}...
      </p>
      <div className={styles.recipeDetails}>
        <span className={styles.recipeCategory}>{recipe.category}</span>
        <span className={styles.recipeRating}>★ {recipe.averageRating.toFixed(1)}</span>
      </div>
      <Link to={`/recipes/${recipe._id}`} className={styles.viewRecipeButton}>
        צפה במתכון
      </Link>
    </div>
  );
}

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    ingredients: PropTypes.string.isRequired,
    category: PropTypes.string,
    averageRating: PropTypes.number
  }).isRequired
};

export default RecipeCard;