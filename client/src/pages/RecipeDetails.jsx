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
    dispatch(fetchRecipeById(id));
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק מתכון זה?')) {
      await dispatch(deleteRecipe(id));
      navigate('/recipes');
    }
  };

  if (isLoading) return <div>טוען...</div>;
  if (error) return <div>שגיאה: {error}</div>;
  if (!currentRecipe) return <div>מתכון לא נמצא</div>;

  return (
    <div className={styles.recipeDetails}>
      {isEditing ? (
        <EditRecipe recipe={currentRecipe} onClose={() => setIsEditing(false)} />
      ) : (
        <>
          <h2>{currentRecipe.name}</h2>
          <h3>רכיבים:</h3>
          <p>{currentRecipe.ingredients}</p>
          <h3>הוראות הכנה:</h3>
          <p>{currentRecipe.instructions}</p>
          <h3>אלרגנים:</h3>
          <p>{currentRecipe.allergens.join(', ')}</p>
          <h3>חלופות אפשריות:</h3>
          <p>{currentRecipe.alternatives}</p>
          <button onClick={() => setIsEditing(true)}>ערוך מתכון</button>
          <button onClick={handleDelete}>מחק מתכון</button>
        </>
      )}
    </div>
  );
}

export default RecipeDetails;