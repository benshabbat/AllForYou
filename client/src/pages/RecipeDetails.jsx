
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { FaClock, FaUtensils, FaUsers, FaHeart, FaRegHeart } from 'react-icons/fa';
import api from '../services/api';
import RatingStars from '../components/RatingStars';
import AllergenWarning from '../components/AllergenWarning';
import CommentSection from '../components/CommentSection';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { translateDifficulty } from '../utils/recipeUtils';
import styles from './RecipeDetails.module.css';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useSelector(state => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  const { data: recipe, isLoading, error } = useQuery(['recipe', id], 
    () => api.get(`/recipes/${id}`).then(res => res.data)
  );

  const deleteMutation = useMutation(() => api.delete(`/recipes/${id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries('recipes');
      navigate('/my-recipes');
    }
  });

  const rateMutation = useMutation((rating) => api.post(`/recipes/${id}/rate`, { rating }), {
    onSuccess: () => queryClient.invalidateQueries(['recipe', id])
  });

  const toggleFavoriteMutation = useMutation(() => api.post(`/recipes/${id}/favorite`), {
    onSuccess: () => queryClient.invalidateQueries(['recipe', id])
  });

  const handleDelete = () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק מתכון זה?')) {
      deleteMutation.mutate();
    }
  };

  const handleRate = (rating) => rateMutation.mutate(rating);

  const handleToggleFavorite = () => {
    if (user) {
      toggleFavoriteMutation.mutate();
    } else {
      alert('עליך להתחבר כדי להוסיף למועדפים');
    }
  };

  if (isLoading) return <Loading message="טוען מתכון..." />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <article className={styles.recipeDetails}>
      <div className={styles.recipeHeader}>
        <h1 className={styles.recipeTitle}>{recipe.name}</h1>
        <div className={styles.recipeActions}>
          <RatingStars rating={recipe.averageRating} onRate={handleRate} />
          <button onClick={handleToggleFavorite} className={styles.favoriteButton}>
            {recipe.isFavorite ? <FaHeart /> : <FaRegHeart />}
            {recipe.isFavorite ? 'הסר ממועדפים' : 'הוסף למועדפים'}
          </button>
        </div>
      </div>
      
      {recipe.image && <img src={recipe.image} alt={recipe.name} className={styles.recipeImage} />}
      
      <div className={styles.recipeInfo}>
        <div className={styles.infoItem}>
          <FaClock className={styles.infoIcon} />
          <span>{recipe.totalTime} דקות</span>
        </div>
        <div className={styles.infoItem}>
          <FaUtensils className={styles.infoIcon} />
          <span>{translateDifficulty(recipe.difficulty)}</span>
        </div>
        <div className={styles.infoItem}>
          <FaUsers className={styles.infoIcon} />
          <span>{recipe.servings} מנות</span>
        </div>
      </div>

      <p className={styles.recipeDescription}>{recipe.description}</p>

      <AllergenWarning allergens={recipe.allergens} />

      <section className={styles.recipeSection}>
        <h2 className={styles.sectionTitle}>מרכיבים:</h2>
        <ul className={styles.ingredientsList}>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </section>

      <section className={styles.recipeSection}>
        <h2 className={styles.sectionTitle}>הוראות הכנה:</h2>
        <ol className={styles.instructionsList}>
          {recipe.instructions.split('\n').map((instruction, index) => (
            <li key={index}>{instruction.trim()}</li>
          ))}
        </ol>
      </section>

      {recipe.nutritionInfo && (
        <section className={styles.recipeSection}>
          <h2 className={styles.sectionTitle}>מידע תזונתי:</h2>
          <div className={styles.nutritionInfo}>
            <div className={styles.nutritionItem}>
              <span>קלוריות:</span>
              <span>{recipe.nutritionInfo.calories || 'לא זמין'}</span>
            </div>
            <div className={styles.nutritionItem}>
              <span>חלבון:</span>
              <span>{recipe.nutritionInfo.protein || 'לא זמין'}ג</span>
            </div>
            <div className={styles.nutritionItem}>
              <span>פחמימות:</span>
              <span>{recipe.nutritionInfo.carbohydrates || 'לא זמין'}ג</span>
            </div>
            <div className={styles.nutritionItem}>
              <span>שומן:</span>
              <span>{recipe.nutritionInfo.fat || 'לא זמין'}ג</span>
            </div>
          </div>
        </section>
      )}

      {user && user.id === recipe.createdBy && (
        <div className={styles.ownerActions}>
          <button onClick={() => navigate(`/edit-recipe/${recipe._id}`)} className={styles.editButton}>
            ערוך מתכון
          </button>
          <button onClick={handleDelete} className={styles.deleteButton}>
            מחק מתכון
          </button>
        </div>
      )}

      <CommentSection comments={recipe.comments} recipeId={recipe._id} />
    </article>
  );
};

export default RecipeDetails;