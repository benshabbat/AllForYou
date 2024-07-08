import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addRecipe } from '../store/slices/recipeSlice';
import styles from './AddRecipe.module.css';

function AddRecipe() {
  const [recipe, setRecipe] = useState({
    name: '',
    description: '',
    ingredients: '',
    instructions: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'medium',
    allergens: [],
    alternatives: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.recipes);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      [name]: name === 'allergens' ? value.split(',').map(item => item.trim()) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addRecipe(recipe)).unwrap();
      navigate('/my-recipes');
    } catch (err) {
      console.error('Failed to add recipe:', err);
    }
  };

  return (
    <div className={styles.addRecipeContainer}>
      <h2 className={styles.title}>הוספת מתכון חדש</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">שם המתכון</label>
          <input type="text" id="name" name="name" value={recipe.name} onChange={handleChange} required />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">תיאור קצר</label>
          <textarea id="description" name="description" value={recipe.description} onChange={handleChange} required />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="ingredients">מרכיבים (כל מרכיב בשורה חדשה)</label>
          <textarea id="ingredients" name="ingredients" value={recipe.ingredients} onChange={handleChange} required />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="instructions">הוראות הכנה</label>
          <textarea id="instructions" name="instructions" value={recipe.instructions} onChange={handleChange} required />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="prepTime">זמן הכנה (דקות)</label>
            <input type="number" id="prepTime" name="prepTime" value={recipe.prepTime} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cookTime">זמן בישול (דקות)</label>
            <input type="number" id="cookTime" name="cookTime" value={recipe.cookTime} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="servings">מספר מנות</label>
            <input type="number" id="servings" name="servings" value={recipe.servings} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="difficulty">רמת קושי</label>
          <select id="difficulty" name="difficulty" value={recipe.difficulty} onChange={handleChange}>
            <option value="easy">קל</option>
            <option value="medium">בינוני</option>
            <option value="hard">קשה</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="allergens">אלרגנים (מופרדים בפסיקים)</label>
          <input type="text" id="allergens" name="allergens" value={recipe.allergens.join(', ')} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="alternatives">חלופות</label>
          <textarea id="alternatives" name="alternatives" value={recipe.alternatives} onChange={handleChange} />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'מוסיף מתכון...' : 'הוסף מתכון'}
        </button>
      </form>
    </div>
  );
}

export default AddRecipe;