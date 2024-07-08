import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/slices/recipeSlice';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import RatingStars from './RatingStars';
import styles from './RecipeCard.module.css';

const RecipeCard = ({ recipe }) => {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.recipes.favorites);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setIsFavorite(favorites.includes(recipe._id));
  }, [favorites, recipe._id]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = recipe.image;
  }, [recipe.image]);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    dispatch(toggleFavorite(recipe._id));
  };

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
        <button 
          className={styles.favoriteButton} 
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? "הסר ממועדפים" : "הוסף למועדפים"}
        >
          {isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
        </button>
      </div>
      <div className={styles.recipeContent}>
        <h3 className={styles.recipeTitle}>{recipe.name}</h3>
        <RatingStars initialRating={recipe.averageRating || 0} readOnly={true} />
        <p className={styles.recipeDescription}>{recipe.description}</p>
        <Link to={`/recipe/${recipe._id}`} className={styles.viewRecipeButton}>
          צפה במתכון
        </Link>
      </div>
    </div>
  );
};

export default React.memo(RecipeCard);