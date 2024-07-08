import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecipeById,
  deleteRecipe,
  rateRecipe,
} from "../store/slices/recipeSlice";
import EditRecipe from "../components/EditRecipe";
import RatingStars from "../components/RatingStars";
import styles from "./RecipeDetails.module.css";

function RecipeDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentRecipe, isLoading, error } = useSelector(
    (state) => state.recipes
  );
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchRecipeById(id));
  }, [dispatch, id]);

  const handleDelete = useCallback(async () => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק מתכון זה?")) {
      try {
        await dispatch(deleteRecipe(id)).unwrap();
        navigate("/recipes");
      } catch (error) {
        console.error("Failed to delete recipe:", error);
        // כאן אפשר להוסיף הודעת שגיאה למשתמש
      }
    }
  }, [dispatch, id, navigate]);

  const handleRate = useCallback(async (rating) => {
    try {
      await dispatch(rateRecipe({ id: currentRecipe._id, rating })).unwrap();
    } catch (error) {
      console.error("Failed to rate recipe:", error);
      // כאן אפשר להוסיף הודעת שגיאה למשתמש
    }
  }, [dispatch, currentRecipe]);

  if (isLoading) return <div className={styles.loading} aria-live="polite">טוען...</div>;
  if (error) return <div className={styles.error} aria-live="assertive">שגיאה: {error}</div>;
  if (!currentRecipe) return <div className={styles.notFound} aria-live="assertive">מתכון לא נמצא</div>;

  return (
    <article className={styles.recipeDetails}>
      {isEditing ? (
        <EditRecipe
          recipe={currentRecipe}
          onClose={() => setIsEditing(false)}
        />
      ) : (
        <>
          <h1>{currentRecipe.name}</h1>
          <RatingStars
            rating={currentRecipe.averageRating}
            onRating={handleRate}
          />
          <p>דירוג ממוצע: {currentRecipe.averageRating.toFixed(1)}</p>

          <section aria-labelledby="ingredients-heading">
            <h2 id="ingredients-heading">רכיבים:</h2>
            <p>{currentRecipe.ingredients}</p>
          </section>
          <section aria-labelledby="instructions-heading">
            <h2 id="instructions-heading">הוראות הכנה:</h2>
            <p>{currentRecipe.instructions}</p>
          </section>
          <section aria-labelledby="allergens-heading">
            <h2 id="allergens-heading">אלרגנים:</h2>
            <p>{currentRecipe.allergens.join(", ")}</p>
          </section>
          <section aria-labelledby="alternatives-heading">
            <h2 id="alternatives-heading">חלופות אפשריות:</h2>
            <p>{currentRecipe.alternatives}</p>
          </section>
          <div className={styles.actionButtons}>
            <button onClick={() => setIsEditing(true)} aria-label="ערוך מתכון">
              ערוך מתכון
            </button>
            <button onClick={handleDelete} aria-label="מחק מתכון">
              מחק מתכון
            </button>
          </div>
        </>
      )}
    </article>
  );
}

export default React.memo(RecipeDetails);