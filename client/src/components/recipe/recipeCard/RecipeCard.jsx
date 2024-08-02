import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaHeart, FaRegHeart, FaClock, FaUtensils, FaUsers, FaEdit, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../../../store/recipe/recipeSlice';
import { translateDifficulty } from '../../../utils/recipeUtils';
import RatingStars from '../../ratingStars/RatingStars';
import AllergenList from '../../allergenList/AllergenList';
import styles from './RecipeCard.module.css';
import { RecipePropTypes } from '../../../propTypes/recipePropTypes';
const IconWithText = ({ Icon, text }) => (
  <span className={styles.infoItem}>
    <Icon aria-hidden="true" />
    {text}
  </span>
);

const ActionButton = ({ onClick, Icon, text, ariaLabel }) => (
  <button onClick={onClick} className={styles.actionButton} aria-label={ariaLabel}>
    <Icon /> {text}
  </button>
);

const RecipeCard = ({ recipe, showActions = false, onDelete }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleFavoriteClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      dispatch(toggleFavorite(recipe._id));
    } else {
      alert('עליך להתחבר כדי להוסיף למועדפים');
    }
  }, [dispatch, recipe._id, user]);

  const imageUrl = useMemo(() => 
    recipe.image ? `http://localhost:5000/${recipe.image}` : '/placeholder-image.jpg',
  [recipe.image]);

  const isOwner = useMemo(() => user && user.id === recipe.createdBy, [user, recipe.createdBy]);

  const totalTime = useMemo(() => 
    recipe.preparationTime + recipe.cookingTime,
  [recipe.preparationTime, recipe.cookingTime]);

  const renderRecipeInfo = useCallback(() => (
    <div className={styles.recipeInfo}>
      <IconWithText Icon={FaClock} text={`${totalTime} דקות`} />
      <IconWithText Icon={FaUtensils} text={translateDifficulty(recipe.difficulty)} />
      <IconWithText Icon={FaUsers} text={`${recipe.servings} מנות`} />
    </div>
  ), [totalTime, recipe.difficulty, recipe.servings]);

  const renderActions = useCallback(() => (
    showActions && isOwner && (
      <div className={styles.cardFooter}>
        <Link to={`/edit-recipe/${recipe._id}`} className={styles.editButton}>
          <FaEdit aria-hidden="true" /> ערוך
        </Link>
        <ActionButton
          onClick={() => onDelete(recipe._id)}
          Icon={FaTrash}
          text="מחק"
          ariaLabel="מחק מתכון"
        />
      </div>
    )
  ), [showActions, isOwner, recipe._id, onDelete]);

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
          <ActionButton
            onClick={handleFavoriteClick}
            Icon={recipe.isFavorite ? FaHeart : FaRegHeart}
            text=""
            ariaLabel={recipe.isFavorite ? "הסר ממועדפים" : "הוסף למועדפים"}
          />
        </div>
        <div className={styles.recipeContent}>
          <h3 className={styles.recipeTitle}>{recipe.name}</h3>
          {renderRecipeInfo()}
          <RatingStars rating={recipe.averageRating} readOnly={true} />
          <p className={styles.recipeDescription}>{recipe.description}</p>
          {recipe.allergens && recipe.allergens.length > 0 && (
            <AllergenList allergens={recipe.allergens} showTooltips={false} />
          )}
        </div>
      </Link>
      {renderActions()}
    </div>
  );
};


IconWithText.propTypes = {
  Icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired
};

ActionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  Icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired
};

RecipeCard.propTypes = {
  recipe: PropTypes.shape(RecipePropTypes).isRequired,
  showActions: PropTypes.bool,
  onDelete: PropTypes.func
};

export default React.memo(RecipeCard);