import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addRecipe } from '../store/slices/recipeSlice';
import { RootState } from '../store';
import styles from './AddRecipe.module.css';

const AddRecipe = () => {
  const [recipe, setRecipe] = useState({
    name: '',
    description: '',
    ingredients: '',
    instructions: '',
    category: '',
    allergens: [],
    prepTime: '',
    cookTime: '',
    servings: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.recipes);

  // טיפול בשינויים בשדות הטופס
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      [name]: name === 'allergens' ? value.split(',').map(item => item.trim()) : value
    }));
  };

  // שליחת הטופס
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(addRecipe(recipe));
    if (!result.error) {
      navigate('/recipes');
    }
  };

  // רינדור הטופס
  return (
    <div className={styles.addRecipeContainer}>
      <h2 className={styles.title}>הוספת מתכון חדש</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* כאן יבואו כל השדות של הטופס */}
        {/* ... */}

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'מוסיף מתכון...' : 'הוסף מתכון'}
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;