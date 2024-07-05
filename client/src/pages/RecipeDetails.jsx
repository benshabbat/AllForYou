import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipeById, deleteRecipe } from '../store/slices/recipeSlice';
import EditRecipe from '../components/EditRecipe';
import styles from './RecipeDetails.module.css';

function RecipeDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentRecipe, isLoading, error } = useSelector((state) => state.recipes);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // טעינת פרטי המתכון בעת טעינת הדף
    dispatch(fetchRecipeById(id));
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק מתכון זה?')) {
      await dispatch(deleteRecipe(id));
      navigate('/recipes');
    }
  };

  if (isLoading) return <div aria-live="polite">טוען...</div>;
  if (error) return <div aria-live="assertive">שגיאה: {error}</div>;
  if (!currentRecipe) return <div aria-live="assertive">מתכון לא נמצא</div>;

  return (
    <div className={styles.recipeDetails}>
      {isEditing ? (
        <EditRecipe recipe={currentRecipe} onClose={() => setIsEditing(false)} />
      ) : (
        <>
          <h2>{currentRecipe.name}</h2>
          <section aria-labelledby="ingredients-heading">
            <h3 id="ingredients-heading">רכיבים:</h3>
            <p>{currentRecipe.ingredients}</p>
          </section>
          <section aria-labelledby="instructions-heading">
            <h3 id="instructions-heading">הוראות הכנה:</h3>
            <p>{currentRecipe.instructions}</p>
          </section>
          <section aria-labelledby="allergens-heading">
            <h3 id="allergens-heading">אלרגנים:</h3>
            <p>{currentRecipe.allergens.join(', ')}</p>
          </section>
          <section aria-labelledby="alternatives-heading">
            <h3 id="alternatives-heading">חלופות אפשריות:</h3>
            <p>{currentRecipe.alternatives}</p>
          </section>
          <div className={styles.actionButtons}>
            <button onClick={() => setIsEditing(true)} aria-label="ערוך מתכון">ערוך מתכון</button>
            <button onClick={handleDelete} aria-label="מחק מתכון">מחק מתכון</button>
          </div>
        </>
      )}
    </div>
  );
}

export default RecipeDetails;