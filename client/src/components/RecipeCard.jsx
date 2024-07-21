import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaClock,
  FaUtensils,
  FaUsers,
} from "react-icons/fa";
import { useMutation, useQueryClient } from "react-query";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import RatingStars from "./RatingStars";
import AllergenList from "./AllergenList";
import { translateDifficulty } from "../utils/recipeUtils";
import styles from "./RecipeCard.module.css";

const RecipeCard = ({ recipe }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const toggleFavoriteMutation = useMutation(
    () => api.post(`/recipes/${recipe._id}/favorite`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("recipes");
        queryClient.invalidateQueries("favorites");
      },
    }
  );

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    if (user) {
      toggleFavoriteMutation.mutate();
    } else {
      alert("יש להתחבר כדי להוסיף למועדפים");
    }
  };

  // const imageUrl = recipe.image 
  // ? `${process.env.REACT_APP_API_URL}/${recipe.image}`
  // : '/placeholder-image.jpg';
  const imageUrl = recipe.image 
    ? `http://localhost:5000/${recipe.image}`
    : '/placeholder-image.jpg';


    
  console.log("Recipe allergens:", recipe.allergens); // לוג לבדיקת נתוני האלרגנים

  return (
    <div className={styles.recipeCard}>
      <Link to={`/recipe/${recipe._id}`} className={styles.recipeLink}>
        <div className={styles.imageContainer}>
          <img
            src={imageUrl}
            alt={recipe.name}
            className={styles.recipeImage}
            onError={(e) => {
              console.error("Error loading image:", imageUrl);
              e.target.onerror = null;
              e.target.src = "/placeholder-image.jpg";
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
            <span>
              <FaClock /> {recipe.preparationTime + recipe.cookingTime} דקות
            </span>
            <span>
              <FaUtensils /> {translateDifficulty(recipe.difficulty)}
            </span>
            <span>
              <FaUsers /> {recipe.servings} מנות
            </span>
          </div>
          <RatingStars rating={recipe.averageRating} readOnly={true} />
          <p className={styles.recipeDescription}>{recipe.description}</p>
          {recipe.allergens && recipe.allergens.length > 0 && (
            <AllergenList allergens={recipe.allergens} showTooltips={false} />
          )}
        </div>
      </Link>
      <div className={styles.cardFooter}>
        <Link to={`/recipe/${recipe._id}`} className={styles.viewRecipeButton}>
          צפה במתכון
        </Link>
      </div>
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
    allergens: PropTypes.array,
    isFavorite: PropTypes.bool,
  }).isRequired,
};

export default React.memo(RecipeCard);