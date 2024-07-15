import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import RatingStars from './RatingStars';
import AllergenIcon from './AllergenIcon';
import { useRecipeCard } from '../hooks/useRecipeCard';
import styles from './RecipeCard.module.css';

const RecipeCard = ({ recipe }) => {
  const { isFavorite, imageLoaded, handleFavoriteClick, handleKeyPress } = useRecipeCard(recipe);

  return (
    <div className={styles.recipeCard} role="article">
      <RecipeImage image={recipe.image} name={recipe.name} imageLoaded={imageLoaded} />
      <FavoriteButton 
        isFavorite={isFavorite} 
        onClick={handleFavoriteClick} 
        onKeyPress={handleKeyPress} 
      />
      <div className={styles.recipeContent}>
        <h3 className={styles.recipeTitle}>{recipe.name}</h3>
        <RatingStars initialRating={recipe.averageRating || 0} readOnly={true} />
        <p className={styles.recipeDescription}>{recipe.description}</p>
        <AllergenList allergens={recipe.allergens} />
        <Link to={`/recipe/${recipe._id}`} className={styles.viewRecipeButton}>
          צפה במתכון
        </Link>
      </div>
    </div>
  );
};

const RecipeImage = ({ image, name, imageLoaded }) => (
  <div className={styles.imageContainer}>
    {imageLoaded ? (
      <img src={image} alt={name} className={styles.recipeImage} loading="lazy" />
    ) : (
      <div className={styles.imagePlaceholder}>טוען תמונה...</div>
    )}
  </div>
);

const FavoriteButton = ({ isFavorite, onClick, onKeyPress }) => (
  <button 
    className={styles.favoriteButton} 
    onClick={onClick}
    onKeyPress={onKeyPress}
    aria-label={isFavorite ? "הסר ממועדפים" : "הוסף למועדפים"}
    aria-pressed={isFavorite}
  >
    {isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
  </button>
);

const AllergenList = ({ allergens }) => (
  <div className={styles.allergenIcons} aria-label="אלרגנים">
    {allergens?.map(allergen => (
      <AllergenIcon key={allergen._id} allergen={allergen} size="small" />
    ))}
  </div>
);

export default React.memo(RecipeCard);