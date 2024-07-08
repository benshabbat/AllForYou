import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './RecipeCard.module.css';

const RecipeCard = ({ recipe }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = recipe.image;
  }, [recipe.image]);

  return (
    <div className={styles.recipeCard}>
      <div className={styles.imageContainer}>
        {imageLoaded ? (
          <img
            src={recipe.image}
            alt={recipe.name}
            className={styles.recipeImage}
            loading="lazy"
          />
        ) : (
          <div className={styles.imagePlaceholder}>טוען תמונה...</div>
        )}
      </div>
      <div className={styles.recipeContent}>
        <h3 className={styles.recipeTitle}>{recipe.name}</h3>
        <p className={styles.recipeDescription}>{recipe.description}</p>
        <Link to={`/recipe/${recipe._id}`} className={styles.viewRecipeButton}>
          צפה במתכון
        </Link>
      </div>
    </div>
  );
};

export default React.memo(RecipeCard);