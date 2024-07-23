import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { FaClock, FaUtensils, FaUsers, FaHeart, FaRegHeart, FaPrint, FaShare, FaEdit, FaTrash } from "react-icons/fa";
import api from "../services/api";
import RatingStars from "../components/RatingStars";
import AllergenWarning from "../components/AllergenWarning";
import CommentSection from "../components/CommentSection";
import IngredientList from "../components/IngredientList";
import InstructionList from "../components/InstructionList";
import NutritionInfo from "../components/NutritionInfo";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { translateDifficulty } from "../utils/recipeUtils";
import Modal from "../components/Modal";
import { useToast } from "../components/Toast";
import styles from "./RecipeDetails.module.css";

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { addToast } = useToast();

  const {
    data: recipe,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ["recipe", id],
    () => api.get(`/recipes/${id}`).then((res) => res.data),
    { staleTime: 5 * 60 * 1000 } // 5 דקות
  );

  useEffect(() => {
    refetch();
  }, [id, refetch]);

  const deleteMutation = useMutation(() => api.delete(`/recipes/${id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries("recipes");
      addToast("המתכון נמחק בהצלחה", "success");
      navigate("/my-recipes");
    },
    onError: (error) => {
      addToast(`שגיאה במחיקת המתכון: ${error.message}`, "error");
    },
  });

  const rateMutation = useMutation(
    (rating) => api.post(`/recipes/${id}/rate`, { rating }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["recipe", id]);
        addToast("הדירוג נשמר בהצלחה", "success");
      },
      onError: (error) => {
        addToast(`שגיאה בשמירת הדירוג: ${error.message}`, "error");
      },
    }
  );

  const toggleFavoriteMutation = useMutation(
    () => api.post(`/recipes/${id}/favorite`),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["recipe", id]);
        addToast(
          data.isFavorite ? "המתכון נוסף למועדפים" : "המתכון הוסר מהמועדפים",
          "success"
        );
      },
      onError: (error) => {
        addToast(`שגיאה בעדכון המועדפים: ${error.message}`, "error");
      },
    }
  );

  const handleDelete = useCallback(() => setIsDeleteModalOpen(true), []);
  const confirmDelete = useCallback(() => {
    deleteMutation.mutate();
    setIsDeleteModalOpen(false);
  }, [deleteMutation]);

  const handleRate = useCallback(
    (rating) => rateMutation.mutate(rating),
    [rateMutation]
  );
  const handleToggleFavorite = useCallback(
    () => toggleFavoriteMutation.mutate(),
    [toggleFavoriteMutation]
  );

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator
        .share({
          title: recipe.name,
          text: recipe.description,
          url: window.location.href,
        })
        .then(() => {
          addToast("המתכון שותף בהצלחה", "success");
        })
        .catch((error) => {
          addToast(`שגיאה בשיתוף המתכון: ${error}`, "info");
        });
    } else {
      addToast("שיתוף אינו נתמך בדפדפן זה", "info");
    }
  }, [recipe, addToast]);

  if (isLoading) return <Loading message="טוען מתכון..." />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!recipe) return <ErrorMessage message="המתכון לא נמצא" />;

  const imageUrl = recipe.image 
    ? `http://localhost:5000/${recipe.image}`
    : '/placeholder-image.jpg';

  return (
    <article className={styles.recipeDetails}>
      <header className={styles.recipeHeader}>
        <h1 className={styles.recipeTitle}>{recipe.name}</h1>
        <div className={styles.recipeActions}>
          <RatingStars rating={recipe.averageRating} onRate={handleRate} />
          <button
            onClick={handleToggleFavorite}
            className={styles.actionButton}
            aria-label={recipe.isFavorite ? "הסר ממועדפים" : "הוסף למועדפים"}
          >
            {recipe.isFavorite ? <FaHeart /> : <FaRegHeart />}
            {recipe.isFavorite ? "הסר ממועדפים" : "הוסף למועדפים"}
          </button>
          <button
            onClick={handlePrint}
            className={styles.actionButton}
            aria-label="הדפס מתכון"
          >
            <FaPrint /> הדפס
          </button>
          <button
            onClick={handleShare}
            className={styles.actionButton}
            aria-label="שתף מתכון"
          >
            <FaShare /> שתף
          </button>
        </div>
      </header>

      {recipe.image && (
        <div className={styles.imageContainer}>
          <img
            src={imageUrl}
            alt={recipe.name}
            className={styles.recipeImage}
            onError={(e) => {
              console.error("שגיאה בטעינת תמונה:", imageUrl);
              e.target.onerror = null;
              e.target.src = "/placeholder-image.jpg";
            }}
          />
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

      <IngredientList
        ingredients={recipe.ingredients}
        defaultServings={recipe.servings}
      />
      <InstructionList instructions={recipe.instructions} />
      {recipe.nutritionInfo && (
        <NutritionInfo
          nutritionInfo={recipe.nutritionInfo}
          servings={recipe.servings}
        />
      )}

      {user && user.id === recipe.createdBy && (
        <div className={styles.ownerActions}>
          <button
            onClick={() => navigate(`/edit-recipe/${recipe._id}`)}
            className={styles.editButton}
          >
            <FaEdit /> ערוך מתכון
          </button>
          <button onClick={handleDelete} className={styles.deleteButton}>
            <FaTrash /> מחק מתכון
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
        <p>פעולה זו אינה הפיכה.</p>
      </Modal>

      <CommentSection comments={recipe.comments} recipeId={recipe._id} />
    </article>
  );
};

export default React.memo(RecipeDetails);