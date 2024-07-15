import React, { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../services/api';
import EditRecipe from "../components/EditRecipe";
import RatingStars from "../components/RatingStars";
import CommentSection from "../components/CommentSection";
import AllergenWarning from "../components/AllergenWarning";
import IngredientSubstitution from "../components/IngredientSubstitution";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import styles from "./RecipeDetails.module.css";

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: recipe, isLoading, error } = useQuery(['recipe', id], 
    () => api.get(`/recipes/${id}`).then(res => res.data)
  );

  const deleteMutation = useMutation(() => api.delete(`/recipes/${id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries('recipes');
      navigate('/recipes');
    }
  });

  const rateMutation = useMutation((rating) => api.post(`/recipes/${id}/rate`, { rating }), {
    onSuccess: () => queryClient.invalidateQueries(['recipe', id])
  });

  const commentMutation = useMutation((content) => api.post(`/recipes/${id}/comments`, { content }), {
    onSuccess: () => queryClient.invalidateQueries(['recipe', id])
  });

  const handleDelete = useCallback(() => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק מתכון זה?")) {
      deleteMutation.mutate();
    }
  }, [deleteMutation]);

  const handleRate = useCallback((rating) => rateMutation.mutate(rating), [rateMutation]);
  const handleAddComment = useCallback((content) => commentMutation.mutate(content), [commentMutation]);

  if (isLoading) return <Loading message="טוען מתכון..." />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!recipe) return <ErrorMessage message="מתכון לא נמצא" />;

  return (
    <article className={styles.recipeDetails}>
      {isEditing ? (
        <EditRecipe recipe={recipe} onClose={() => setIsEditing(false)} />
      ) : (
        <RecipeContent 
          recipe={recipe} 
          onRate={handleRate} 
          onDelete={handleDelete}
          onEdit={() => setIsEditing(true)}
          onAddComment={handleAddComment}
        />
      )}
    </article>
  );
};

const RecipeContent = ({ recipe, onRate, onDelete, onEdit, onAddComment }) => (
  <>
    <h1>{recipe.name}</h1>
    <RatingSection rating={recipe.averageRating} onRate={onRate} />
    {recipe.image && <img src={recipe.image} alt={recipe.name} className={styles.recipeImage} />}
    <AllergenWarning allergens={recipe.allergens} />
    <IngredientSection ingredients={recipe.ingredients} />
    <InstructionsSection instructions={recipe.instructions} />
    <NutritionSection nutritionInfo={recipe.nutritionInfo} />
    <ActionButtons onEdit={onEdit} onDelete={onDelete} />
    <CommentSection comments={recipe.comments} onAddComment={onAddComment} />
  </>
);

const RatingSection = ({ rating, onRate }) => (
  <div className={styles.ratingSection}>
    <RatingStars initialRating={rating || 0} onRating={onRate} />
    <p>דירוג ממוצע: {rating?.toFixed(1) || 'לא דורג'}</p>
  </div>
);

const IngredientSection = ({ ingredients }) => (
  <section aria-labelledby="ingredients-heading">
    <h2 id="ingredients-heading">מרכיבים:</h2>
    <ul>
      {ingredients?.map((ingredient, index) => (
        <li key={index}>
          {ingredient.trim()}
          <IngredientSubstitution ingredient={ingredient} />
        </li>
      ))}
    </ul>
  </section>
);

const InstructionsSection = ({ instructions }) => (
  <section aria-labelledby="instructions-heading">
    <h2 id="instructions-heading">הוראות הכנה:</h2>
    <ol>
      {instructions?.split('\n').map((instruction, index) => (
        <li key={index}>{instruction.trim()}</li>
      ))}
    </ol>
  </section>
);

const NutritionSection = ({ nutritionInfo }) => (
  <section aria-labelledby="nutrition-heading">
    <h2 id="nutrition-heading">מידע תזונתי:</h2>
    <p>קלוריות: {nutritionInfo?.calories || 'לא זמין'}</p>
    <p>חלבון: {nutritionInfo?.protein || 'לא זמין'}ג</p>
    <p>פחמימות: {nutritionInfo?.carbohydrates || 'לא זמין'}ג</p>
    <p>שומן: {nutritionInfo?.fat || 'לא זמין'}ג</p>
  </section>
);

const ActionButtons = ({ onEdit, onDelete }) => (
  <div className={styles.actionButtons}>
    <button onClick={onEdit}>ערוך מתכון</button>
    <button onClick={onDelete}>מחק מתכון</button>
  </div>
);

export default React.memo(RecipeDetails);