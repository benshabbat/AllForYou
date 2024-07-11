import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  fetchRecipeById,
  deleteRecipe,
  rateRecipe,
  addComment,
  fetchComments,
} from "../store/slices/recipeSlice";
import EditRecipe from "../components/EditRecipe";
import RatingStars from "../components/RatingStars";
import CommentSection from "../components/CommentSection";
import styles from "./RecipeDetails.module.css";

function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: recipe, isLoading, error } = useQuery(['recipe', id], () => fetchRecipeById(id));
  const { data: comments } = useQuery(['comments', id], () => fetchComments(id));

  const rateMutation = useMutation(rateRecipe, {
    onSuccess: () => {
      queryClient.invalidateQueries(['recipe', id]);
    }
  });

  const commentMutation = useMutation(addComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', id]);
    }
  });

  const deleteMutation = useMutation(deleteRecipe, {
    onSuccess: () => {
      navigate('/recipes');
    }
  });

  const handleRate = (rating) => {
    rateMutation.mutate({ recipeId: id, rating });
  };

  const handleAddComment = (content) => {
    commentMutation.mutate({ recipeId: id, content });
  };

  const handleDelete = () => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק מתכון זה?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading)
    return (
      <div className={styles.loading} aria-live="polite">
        טוען...
      </div>
    );
  if (error)
    return (
      <div className={styles.error} aria-live="assertive">
        שגיאה: {error}
      </div>
    );
  if (!currentRecipe)
    return (
      <div className={styles.notFound} aria-live="assertive">
        מתכון לא נמצא
      </div>
    );
  if (!Array.isArray(currentRecipe.allergens)) {
    console.error("Allergens is not an array:", currentRecipe.allergens);
    currentRecipe.allergens = [];
  }
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
          <div className={styles.ratingSection}>
            <RatingStars
              initialRating={currentRecipe.averageRating}
              onRating={handleRate}
            />
            <p>
              דירוג ממוצע:{" "}
              {currentRecipe.averageRating
                ? currentRecipe.averageRating.toFixed(1)
                : "אין דירוג"}
            </p>
          </div>

          <img
            src={currentRecipe.image}
            alt={currentRecipe.name}
            className={styles.recipeImage}
          />

          <section aria-labelledby="ingredients-heading">
            <h2 id="ingredients-heading">רכיבים:</h2>
            <ul>
              {Array.isArray(currentRecipe.ingredients)
                ? currentRecipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))
                : currentRecipe.ingredients
                    .split("\n")
                    .map((ingredient, index) => (
                      <li key={index}>{ingredient.trim()}</li>
                    ))}
            </ul>
          </section>

          <section aria-labelledby="instructions-heading">
            <h2 id="instructions-heading">הוראות הכנה:</h2>
            <ol>
              {currentRecipe.instructions
                .split("\n")
                .map((instruction, index) => (
                  <li key={index}>{instruction.trim()}</li>
                ))}
            </ol>
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

          <CommentSection comments={comments} onAddComment={handleAddComment} />
        </>
      )}
    </article>
  );
}

export default React.memo(RecipeDetails);
