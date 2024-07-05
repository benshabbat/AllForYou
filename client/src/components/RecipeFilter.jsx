import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchRecipes } from '../store/slices/recipeSlice';
import { useForm } from '../hooks/useForm';
import { CATEGORIES } from '../constants';
import styles from '../styles/RecipeFilter.module.css';

function RecipeFilter() {
  const dispatch = useDispatch();
  const [formValues, handleChange, reset] = useForm({
    searchTerm: '',
    ingredients: '',
    category: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchRecipes({
      ...formValues,
      ingredients: formValues.ingredients.split(',').map(i => i.trim())
    }));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.filterForm}>
      <input
        type="text"
        name="searchTerm"
        placeholder="חפש מתכון..."
        value={formValues.searchTerm}
        onChange={handleChange}
        className={styles.inputField}
      />
      <input
        type="text"
        name="ingredients"
        placeholder="רכיבים (מופרדים בפסיקים)"
        value={formValues.ingredients}
        onChange={handleChange}
        className={styles.inputField}
      />
      <select
        name="category"
        value={formValues.category}
        onChange={handleChange}
        className={styles.selectField}
      >
        <option value="">כל הקטגוריות</option>
        {CATEGORIES.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <button type="submit" className={styles.searchButton}>חפש</button>
      <button type="button" onClick={reset} className={styles.resetButton}>איפוס</button>
    </form>
  );
}

export default RecipeFilter;