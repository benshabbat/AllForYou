import React, { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { FaClock, FaUtensils, FaUsers, FaHeart, FaRegHeart, FaPrint, FaShare } from 'react-icons/fa';
import api from '../services/api';
import RatingStars from '../components/RatingStars';
import AllergenWarning from '../components/AllergenWarning';
import CommentSection from '../components/CommentSection';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { translateDifficulty } from '../utils/recipeUtils';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';
import styles from './RecipeDetails.module.css';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useSelector(state => state.auth);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { addToast } = useToast();

  const { data: recipe, isLoading, error } = useQuery(['recipe', id], 
    () => api.get(`/recipes/${id}`).then(res => res.data)
  );

  const deleteMutation = useMutation(() => api.delete(`/recipes/${id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries('recipes');
      addToast('המתכון נמחק בהצלחה', 'success');
      navigate('/my-recipes');
    },
    onError: (error) => {
      addToast(`שגיאה במחיקת המתכון: ${error.message}`, 'error');
    }
  });

  const rateMutation = useMutation((rating) => api.post(`/recipes/${id}/rate`, { rating }), {
    onSuccess: () => {
      queryClient.invalidateQueries(['recipe', id]);
      addToast('הדירוג נשמר בהצלחה', 'success');
    },
    onError: (error) => {
      addToast(`שגיאה בשמירת הדירוג: ${error.message}`, 'error');
    }
  });

  const toggleFavoriteMutation = useMutation(() => api.post(`/recipes/${id}/favorite`), {
    onSuccess: () => {
      queryClient.invalidateQueries(['recipe', id]);
      addToast(recipe.isFavorite ? 'המתכון הוסר מהמועדפים' : 'המתכון נוסף למועדפים', 'success');
    },
    onError: (error) => {
      addToast(`שגיאה בעדכון המועדפים: ${error.message}`, 'error');
    }
  });

  const handleDelete = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    deleteMutation.mutate();
    setIsDeleteModalOpen(false);
  }, [deleteMutation]);

  const handleRate = useCallback((rating) => {
    rateMutation.mutate(rating);
  }, [rateMutation]);

  const handleToggleFavorite = useCallback(() => {
    toggleFavoriteMutation.mutate();
  }, [toggleFavoriteMutation]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: recipe.name,
        text: recipe.description,
        url: window.location.href,
      }).then(() => {
        addToast('המתכון שותף בהצלחה', 'success');
      }).catch((error) => {
        addToast(`שגיאה בשיתוף המתכון: ${error}`, 'error');
      });
    } else {
      addToast('שיתוף אינו נתמך בדפדפן זה', 'info');
    }
  }, [recipe, addToast]);

  if (isLoading) return <Loading message="טוען מתכון..." />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <article className={styles.recipeDetails}>
      <header className={styles.recipeHeader}>
        <h1 className={styles.recipeTitle}>{recipe.name}</h1>
        <div className={styles.recipeActions}>
          <RatingStars rating={recipe.averageRating} onRate={handleRate} />
          <button onClick={handleToggleFavorite} className={styles.actionButton}>
            {recipe.isFavorite ? <FaHeart /> : <FaRegHeart />}
            {recipe.isFavorite ? 'הסר ממועדפים' : 'הוסף למועדפים'}
          </button>
          <button onClick={handlePrint} className={styles.actionButton}>
            <FaPrint /> הדפס
          </button>
          <button onClick={handleShare} className={styles.actionButton}>
            <FaShare /> שתף
          </button>
        </div>
      </header>
      
      {recipe.image && (
        <div className={styles.imageContainer}>
          <img src={recipe.image} alt={recipe.name} className={styles.recipeImage} />
        </div>
      )}
      
      <section className={styles.recipeInfo}>
        <div className={styles.infoItem}>
          <FaClock className={styles.infoIcon} />
          <span>זמן הכנה: {recipe.preparationTime} דקות</span>
        </div>
        <div className={styles.infoItem}>
          <FaUtensils className={styles.infoIcon} />
          <span>רמת קושי: {translateDifficulty(recipe.difficulty)}</span>
        </div>
        <div className={styles.infoItem}>
          <FaUsers className={styles.infoIcon} />
          <span>מספר מנות: {recipe.servings}</span>
        </div>
      </section>

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

      <Modal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="אישור מחיקת מתכון"
        onConfirm={confirmDelete}
      >
        <p>האם אתה בטוח שברצונך למחוק את המתכון "{recipe.name}"?</p>
      </Modal>

      <CommentSection comments={recipe.comments} recipeId={recipe._id} />
    </article>
  );
};

export default RecipeDetails;