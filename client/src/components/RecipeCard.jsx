import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaClock, FaUtensils } from 'react-icons/fa';
import RatingStars from './RatingStars';
import AllergenList from './AllergenList';
import { useRecipeCard } from '../hooks/useRecipeCard';
import styles from './RecipeCard.module.css';

const RecipeCard = ({ recipe, isOwner }) => {
  const { 
    isFavorite, 
    imageLoaded, 
    handleFavoriteClick, 
    handleKeyPress 
  } = useRecipeCard(recipe);

  const totalTime = typeof recipe.totalTime === 'function' ? recipe.totalTime() : recipe.totalTime;

  return (
    <div className={styles.recipeCard} role="article">
      <div className={styles.imageContainer}>
        {imageLoaded ? (
          <img src={recipe.image} alt={recipe.name} className={styles.recipeImage} loading="lazy" />
        ) : (
          <div className={styles.imagePlaceholder}>טוען תמונה...</div>
        )}
        <button 
          className={styles.favoriteButton} 
          onClick={handleFavoriteClick}
          onKeyPress={handleKeyPress}
          aria-label={isFavorite ? "הסר ממועדפים" : "הוסף למועדפים"}
          aria-pressed={isFavorite}
        >
          {isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
        </button>
      </div>
      <div className={styles.recipeContent}>
        <h3 className={styles.recipeTitle}>{recipe.name}</h3>
        <div className={styles.recipeInfo}>
          <span><FaClock /> {totalTime || 'לא זמין'} דקות</span>
          <span><FaUtensils /> {recipe.difficulty}</span>
        </div>
        <RatingStars initialRating={recipe.averageRating} readOnly={true} />
        <p className={styles.recipeDescription}>{recipe.description}</p>
        <AllergenList allergens={recipe.allergens} />
        <div className={styles.cardFooter}>
          <Link to={`/recipe/${recipe._id}`} className={styles.viewRecipeButton}>
            צפה במתכון
          </Link>
          {isOwner && (
            <Link to={`/edit-recipe/${recipe._id}`} className={styles.editRecipeButton}>
              ערוך מתכון
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(RecipeCard);