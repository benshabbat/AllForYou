import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { FaClock, FaUtensils, FaUsers, FaHeart, FaRegHeart, FaPrint, FaShare, FaEdit, FaTrash } from "react-icons/fa";
import { fetchRecipeById, rateRecipe, deleteRecipe, toggleFavoriteRecipe } from "../../utils/apiUtils";
import RatingStars from "../../components/ratingStars/RatingStars";
import AllergenWarning from "../../components/allergenWarning/AllergenWarning";
import CommentSection from "../../components/commentSection/CommentSection";
import IngredientList from "../../components/recipe/ingredientList/IngredientList";
import InstructionList from "../../components/recipe/instructionList/InstructionList";
import NutritionInfo from "../../components/nutritionInfo/NutritionInfo";
import ErrorMessage from "../../components/errorMessage/ErrorMessage";
import { translateDifficulty } from "../../utils/recipeUtils";
import {Modal,Loading} from "../../components/common";
import {useToast} from '../../components/common/toast/Toast';
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
  } = useQuery(["recipe", id], () => fetchRecipeById(id), {
    staleTime: 5 * 60 * 1000
  });

  useEffect(() => {
    refetch();
  }, [id, refetch]);

  const deleteMutation = useMutation(() => deleteRecipe(id), {
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
    (rating) => rateRecipe(id, rating),
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
    () => toggleFavoriteRecipe(id),
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

  const renderRecipeHeader = () => (
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
  );

  const renderRecipeImage = () => (
    recipe.image && (
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
    )
  );

  const renderRecipeInfo = () => (
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
  );

  const renderAdditionalInfo = () => (
    <section className={styles.additionalInfo}>
      <h2>מידע נוסף</h2>
      <p><strong>קטגוריה:</strong> {recipe.category}</p>
      <p><strong>זמן בישול:</strong> {recipe.cookingTime} דקות</p>
      <p><strong>זמן הכנה כולל:</strong> {recipe.preparationTime + recipe.cookingTime} דקות</p>
      {recipe.tags && recipe.tags.length > 0 && (
        <p><strong>תגיות:</strong> {recipe.tags.join(', ')}</p>
      )}
      <p><strong>נוצר על ידי:</strong> {recipe.createdBy.username}</p>
      <p><strong>תאריך יצירה:</strong> {new Date(recipe.createdAt).toLocaleDateString('he-IL')}</p>
      <p><strong>עודכן לאחרונה:</strong> {new Date(recipe.updatedAt).toLocaleDateString('he-IL')}</p>
    </section>
  );

  const renderOwnerActions = () => (
    user && (user.id === recipe.createdBy._id || user.role === 'admin') && (
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
    )
  );

  return (
    <article className={styles.recipeDetails}>
      {renderRecipeHeader()}
      {renderRecipeImage()}
      {renderRecipeInfo()}
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
      {renderAdditionalInfo()}
      {renderOwnerActions()}
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