import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaClock, FaUtensils, FaUsers } from 'react-icons/fa';
import { useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import RatingStars from './RatingStars';
import AllergenList from './AllergenList';
import { translateDifficulty } from '../utils/recipeUtils';
import styles from './RecipeCard.module.css';

const RecipeCard = ({ recipe }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

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
      alert('אנא התחבר כדי להוסיף למועדפים');
    }
  };

  const renderRecipeImage = () => (
    <div className={styles.imageContainer}>
      {recipe.image ? (
        <img src={recipe.image} alt={recipe.name} className={styles.recipeImage} />
      ) : (
        <div className={styles.imagePlaceholder}>אין תמונה זמינה</div>
      )}
      <button 
        className={styles.favoriteButton} 
        onClick={handleFavoriteClick}
        aria-label={recipe.isFavorite ? "הסר ממועדפים" : "הוסף למועדפים"}
      >
        {recipe.isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
      </button>
    </div>
  );

  const renderRecipeInfo = () => (
    <div className={styles.recipeInfo}>
      <span><FaClock /> {recipe.totalTime} דקות</span>
      <span><FaUtensils /> {translateDifficulty(recipe.difficulty)}</span>
      <span><FaUsers /> {recipe.servings} מנות</span>
    </div>
  );

  return (
    <div className={styles.recipeCard}>
      <Link to={`/recipe/${recipe._id}`} className={styles.recipeLink}>
        {renderRecipeImage()}
        <div className={styles.recipeContent}>
          <h3 className={styles.recipeTitle}>{recipe.name}</h3>
          {renderRecipeInfo()}
          <RatingStars rating={recipe.averageRating} readOnly={true} />
          <p className={styles.recipeDescription}>{recipe.description}</p>
          <AllergenList allergens={recipe.allergens} />
        </div>
      </Link>
      <div className={styles.cardFooter}>
        <Link to={`/recipe/${recipe._id}`} className={styles.viewRecipeButton}>
          צפה במתכון
        </Link>
        {user && user.id === recipe.createdBy && (
          <Link to={`/edit-recipe/${recipe._id}`} className={styles.editRecipeButton}>
            ערוך מתכון
          </Link>
        )}
      </div>
    </div>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    totalTime: PropTypes.number.isRequired,
    difficulty: PropTypes.string.isRequired,
    servings: PropTypes.number.isRequired,
    averageRating: PropTypes.number,
    description: PropTypes.string.isRequired,
    allergens: PropTypes.array,
    isFavorite: PropTypes.bool,
    createdBy: PropTypes.string
  }).isRequired
};

export default React.memo(RecipeCard);