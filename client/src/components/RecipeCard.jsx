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
      // הודעה למשתמש שעליו להתחבר כדי להוסיף למועדפים
      alert("יש להתחבר כדי להוסיף למועדפים");
    }
  };
    // const imageUrl = recipe.image 
  // ? `${process.env.REACT_APP_API_URL}/${recipe.image}`
  // : '/placeholder-image.jpg';
  
  const imageUrl = recipe.image 
  ? `http://localhost:5000/${recipe.image}`
  : '/placeholder-image.jpg';

  console.log("Full Image URL:", imageUrl);
  console.log("Image URL:", imageUrl);
  return (
    <div className={styles.recipeCard}>
      <Link to={`/recipe/${recipe._id}`} className={styles.recipeLink}>
        <div className={styles.imageContainer}>
          {recipe.image ? (
            <img
              src={imageUrl}
              alt={recipe.name}
              className={styles.recipeImage}
              onError={(e) => {
                console.error("Error loading image:", imageUrl);
                console.error("Error details:", e.target.error);
                fetch(imageUrl)
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.blob();
                  })
                  .then((blob) => console.log("Image loaded successfully"))
                  .catch((e) => console.error("Fetch error:", e));
                e.target.onerror = null;
                e.target.src = "/placeholder-image.jpg";
              }}
            />
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
          <AllergenList allergens={recipe.allergens} />
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
