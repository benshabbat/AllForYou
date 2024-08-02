import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaHeart, FaRegHeart, FaClock, FaUtensils, FaUsers, FaEdit, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { translateDifficulty } from '../../../utils/recipeUtils';
import RatingStars from '../../ratingStars/RatingStars';
import AllergenList from '../../allergenList/AllergenList';
import RecipeImage from '../recipeImage/RecipeImage';
import { RecipePropTypes } from '../../../propTypes/recipePropTypes';
import { useFavorite } from '../../../hooks/useFavorite';
import { UI_STRINGS } from '../../../constants/uiStrings';
import styles from './RecipeCard.module.css';

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
  const { user } = useSelector(state => state.auth);
  const handleFavoriteClick = useFavorite(recipe._id);

  const imageUrl = useMemo(() => 
    recipe.image ? `http://localhost:5000/${recipe.image}` : '/placeholder-image.jpg',
  [recipe.image]);

  const isOwner = useMemo(() => user && user.id === recipe.createdBy, [user, recipe.createdBy]);

  const totalTime = useMemo(() => 
    recipe.preparationTime + recipe.cookingTime,
  [recipe.preparationTime, recipe.cookingTime]);

  const renderRecipeInfo = useMemo(() => (
    <div className={styles.recipeInfo}>
      <IconWithText Icon={FaClock} text={`${totalTime} ${UI_STRINGS.MINUTES}`} />
      <IconWithText Icon={FaUtensils} text={translateDifficulty(recipe.difficulty)} />
      <IconWithText Icon={FaUsers} text={`${recipe.servings} ${UI_STRINGS.SERVINGS}`} />
    </div>
  ), [totalTime, recipe.difficulty, recipe.servings]);

  const renderActions = useMemo(() => (
    showActions && isOwner && (
      <div className={styles.cardFooter}>
        <Link to={`/edit-recipe/${recipe._id}`} className={styles.editButton}>
          <FaEdit aria-hidden="true" /> {UI_STRINGS.EDIT}
        </Link>
        <ActionButton
          onClick={() => onDelete(recipe._id)}
          Icon={FaTrash}
          text={UI_STRINGS.DELETE}
          ariaLabel={UI_STRINGS.DELETE}
        />
      </div>
    )
  ), [showActions, isOwner, recipe._id, onDelete]);

  return (
    <div className={styles.recipeCard}>
      <Link to={`/recipe/${recipe._id}`} className={styles.recipeLink}>
        <div className={styles.imageContainer}>
          <RecipeImage imageSrc={imageUrl} altText={recipe.name} />
          <ActionButton
            onClick={handleFavoriteClick}
            Icon={recipe.isFavorite ? FaHeart : FaRegHeart}
            text=""
            ariaLabel={recipe.isFavorite ? UI_STRINGS.REMOVE_FROM_FAVORITES : UI_STRINGS.ADD_TO_FAVORITES}
          />
        </div>
        <div className={styles.recipeContent}>
          <h3 className={styles.recipeTitle}>{recipe.name}</h3>
          {renderRecipeInfo}
          <RatingStars rating={recipe.averageRating} readOnly={true} />
          <p className={styles.recipeDescription}>{recipe.description}</p>
          {recipe.allergens && recipe.allergens.length > 0 && (
            <AllergenList allergens={recipe.allergens} showTooltips={false} />
          )}
        </div>
      </Link>
      {renderActions}
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