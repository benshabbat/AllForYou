import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaClock, FaUtensils } from 'react-icons/fa';
import { useMutation, useQueryClient } from 'react-query';
import api from '../services/api';
import RatingStars from './RatingStars';
import AllergenList from './AllergenList';
import styles from './RecipeCard.module.css';

const RecipeCard = ({ recipe }) => {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData('user');

  const toggleFavoriteMutation = useMutation(
    () => api.post(`/recipes/${recipe._id}/favorite`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('recipes');
        queryClient.invalidateQueries('favorites');
      },
    }
  );

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    if (user) {
      toggleFavoriteMutation.mutate();
    } else {
      // Redirect to login or show login prompt
    }
  };

  return (
    <div className={styles.recipeCard}>
      <Link to={`/recipe/${recipe._id}`} className={styles.recipeLink}>
        <div className={styles.imageContainer}>
          <img src={recipe.image} alt={recipe.name} className={styles.recipeImage} />
          <button 
            className={styles.favoriteButton} 
            onClick={handleFavoriteClick}
            aria-label={recipe.isFavorite ? "הסר ממועדפים" : "הוסף למועדפים"}
          >
            {recipe.isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
          </button>
        </div>
        <div className={styles.recipeContent}>
          <h3 className={styles.recipeTitle}>{recipe.name}</h3>
          <div className={styles.recipeInfo}>
            <span><FaClock /> {recipe.totalTime} דקות</span>
            <span><FaUtensils /> {recipe.difficulty}</span>
          </div>
          <RatingStars rating={recipe.averageRating} />
          <p className={styles.recipeDescription}>{recipe.description}</p>
          <AllergenList allergens={recipe.allergens} />
        </div>
      </Link>
    </div>
  );
};

export default React.memo(RecipeCard);