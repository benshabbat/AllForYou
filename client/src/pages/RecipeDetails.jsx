import React, { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import {
  fetchRecipeById,
  deleteRecipe,
  rateRecipe,
  addComment,
} from "../store/slices/recipeSlice";
import EditRecipe from "../components/EditRecipe";
import RatingStars from "../components/RatingStars";
import CommentSection from "../components/CommentSection";
import styles from "./RecipeDetails.module.css";

function RecipeDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = React.useState(false);

  const { data: recipe, isLoading, error } = useQuery(['recipe', id], () => fetchRecipeById(id));

  const deleteMutation = useMutation(deleteRecipe, {
    onSuccess: () => {
      // Handle successful deletion (e.g., redirect to recipes list)
    }
  });

  const rateMutation = useMutation(rateRecipe, {
    onSuccess: () => {
      queryClient.invalidateQueries(['recipe', id]);
    }
  });

  const commentMutation = useMutation(addComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(['recipe', id]);
    }
  });

  const handleDelete = useCallback(() => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      deleteMutation.mutate(id);
    }
  }, [deleteMutation, id]);

  const handleRate = useCallback(async (rating) => {
    await rateMutation.mutateAsync({ recipeId: id, rating });
  }, [rateMutation, id]);

  const handleAddComment = useCallback(async (content) => {
    await commentMutation.mutateAsync({ recipeId: id, content });
  }, [commentMutation, id]);

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!recipe) return <div className={styles.notFound}>Recipe not found</div>;

  return (
    <article className={styles.recipeDetails}>
      {isEditing ? (
        <EditRecipe recipe={recipe} onClose={() => setIsEditing(false)} />
      ) : (
        <>
          <h1>{recipe.name}</h1>
          <div className={styles.ratingSection}>
            <RatingStars initialRating={recipe.averageRating || 0} onRating={handleRate} />
            <p>Average rating: {recipe.averageRating?.toFixed(1) || 'Not rated'}</p>
          </div>
          
          <img src={recipe.image} alt={recipe.name} className={styles.recipeImage} />

          <section aria-labelledby="ingredients-heading">
            <h2 id="ingredients-heading">Ingredients:</h2>
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient.trim()}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="instructions-heading">
            <h2 id="instructions-heading">Instructions:</h2>
            <ol>
              {recipe.instructions.split('\n').map((instruction, index) => (
                <li key={index}>{instruction.trim()}</li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="allergens-heading">
            <h2 id="allergens-heading">Allergens:</h2>
            <div className={styles.allergenList}>
              {recipe.allergens?.map(allergen => (
                <span key={allergen._id} className={styles.allergen}>
                  {allergen.icon} {allergen.name}
                </span>
              ))}
            </div>
          </section>

          <section aria-labelledby="alternatives-heading">
            <h2 id="alternatives-heading">Possible alternatives:</h2>
            <p>{recipe.alternatives}</p>
          </section>

          <div className={styles.actionButtons}>
            <button onClick={() => setIsEditing(true)}>Edit Recipe</button>
            <button onClick={handleDelete}>Delete Recipe</button>
          </div>

          <CommentSection comments={recipe.comments} onAddComment={handleAddComment} />
        </>
      )}
    </article>
  );
}

export default React.memo(RecipeDetails);