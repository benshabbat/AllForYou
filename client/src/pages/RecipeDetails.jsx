import React, { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../services/api';
import EditRecipe from "../components/EditRecipe";
import RatingStars from "../components/RatingStars";
import CommentSection from "../components/CommentSection";
import AllergenWarning from "../components/AllergenWarning";
import IngredientSubstitution from "../components/IngredientSubstitution";
import styles from "./RecipeDetails.module.css";

function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const fetchRecipe = useCallback(() => api.get(`/recipes/${id}`).then(res => res.data), [id]);

  const { data: recipe, isLoading, error } = useQuery(['recipe', id], fetchRecipe);

  const deleteMutation = useMutation(
    () => api.delete(`/recipes/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('recipes');
        navigate('/recipes');
      }
    }
  );

  const rateMutation = useMutation(
    (rating) => api.post(`/recipes/${id}/rate`, { rating }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['recipe', id]);
      }
    }
  );

  const commentMutation = useMutation(
    (content) => api.post(`/recipes/${id}/comments`, { content }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['recipe', id]);
      }
    }
  );

  const handleDelete = useCallback(() => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      deleteMutation.mutate();
    }
  }, [deleteMutation]);

  const handleRate = useCallback((rating) => {
    rateMutation.mutate(rating);
  }, [rateMutation]);

  const handleAddComment = useCallback((content) => {
    commentMutation.mutate(content);
  }, [commentMutation]);

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error.message}</div>;
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
          
          {recipe.image && <img src={recipe.image} alt={recipe.name} className={styles.recipeImage} />}

          {recipe.allergens && recipe.allergens.length > 0 && (
            <AllergenWarning allergens={recipe.allergens} />
          )}

          <section aria-labelledby="ingredients-heading">
            <h2 id="ingredients-heading">Ingredients:</h2>
            <ul>
              {recipe.ingredients?.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.trim()}
                  <IngredientSubstitution ingredient={ingredient} />
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="instructions-heading">
            <h2 id="instructions-heading">Instructions:</h2>
            <ol>
              {recipe.instructions?.split('\n').map((instruction, index) => (
                <li key={index}>{instruction.trim()}</li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="nutrition-heading">
            <h2 id="nutrition-heading">Nutrition Information:</h2>
            <p>Calories: {recipe.nutritionInfo?.calories || 'N/A'}</p>
            <p>Protein: {recipe.nutritionInfo?.protein || 'N/A'}g</p>
            <p>Carbohydrates: {recipe.nutritionInfo?.carbohydrates || 'N/A'}g</p>
            <p>Fat: {recipe.nutritionInfo?.fat || 'N/A'}g</p>
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