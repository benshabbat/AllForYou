import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaHeart, FaRegHeart, FaClock, FaUtensils, FaUsers, FaEdit, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/slices/recipeSlice';
import { translateDifficulty } from '../utils/recipeUtils';
import RatingStars from './RatingStars';
import AllergenList from './AllergenList';
import styles from './RecipeCard.module.css';

const RecipeCard = ({ recipe, showActions = false, onDelete }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      dispatch(toggleFavorite(recipe._id));
    } else {
      alert('עליך להתחבר כדי להוסיף למועדפים');
    }
  };

  const imageUrl = recipe.image 
    ? `http://localhost:5000/${recipe.image}`
    : '/placeholder-image.jpg';

  const isOwner = user && user.id === recipe.createdBy;

  return (
    <div className={styles.recipeCard}>
      <Link to={`/recipe/${recipe._id}`} className={styles.recipeLink}>
        <div className={styles.imageContainer}>
          <img
            src={imageUrl}
            alt={recipe.name}
            className={styles.recipeImage}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-image.jpg';
            }}
          />
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
            <span><FaClock /> {recipe.preparationTime + recipe.cookingTime} דקות</span>
            <span><FaUtensils /> {translateDifficulty(recipe.difficulty)}</span>
            <span><FaUsers /> {recipe.servings} מנות</span>
          </div>
          <RatingStars rating={recipe.averageRating} readOnly={true} />
          <p className={styles.recipeDescription}>{recipe.description}</p>
          {recipe.allergens && recipe.allergens.length > 0 && (
            <AllergenList allergens={recipe.allergens} showTooltips={false} />
          )}
        </div>
      </Link>
      {showActions && isOwner && (
        <div className={styles.cardFooter}>
          <Link to={`/edit-recipe/${recipe._id}`} className={styles.editButton}>
            <FaEdit /> ערוך
          </Link>
          <button onClick={() => onDelete(recipe._id)} className={styles.deleteButton}>
            <FaTrash /> מחק
          </button>
        </div>
      )}
    </div>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    preparationTime: PropTypes.number.isRequired,
    cookingTime: PropTypes.number.isRequired,
    difficulty: PropTypes.string.isRequired,
    servings: PropTypes.number.isRequired,
    averageRating: PropTypes.number,
    description: PropTypes.string.isRequired,
    allergens: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        hebrewName: PropTypes.string,
        icon: PropTypes.string
      })
    ])),
    isFavorite: PropTypes.bool,
    createdBy: PropTypes.string.isRequired
  }).isRequired,
  showActions: PropTypes.bool,
  onDelete: PropTypes.func
};

export default RecipeCard;