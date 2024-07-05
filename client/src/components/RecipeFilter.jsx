import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchRecipes } from '../store/slices/recipeSlice';
import styles from './RecipeFilter.module.css';

function RecipeFilter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [category, setCategory] = useState('');
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchRecipes({
      searchTerm,
      ingredients: ingredients.split(',').map(i => i.trim()),
      category
    }));
  };

  return (
    <form onSubmit={handleSearch} className={styles.filterForm}>
      <input
        type="text"
        placeholder="חפש מתכון..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.inputField}
      />
      <input
        type="text"
        placeholder="רכיבים (מופרדים בפסיקים)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        className={styles.inputField}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className={styles.selectField}
      >
        <option value="">כל הקטגוריות</option>
        <option value="עיקריות">עיקריות</option>
        <option value="קינוחים">קינוחים</option>
        <option value="סלטים">סלטים</option>
        <option value="מרקים">מרקים</option>
      </select>
      <button type="submit" className={styles.searchButton}>חפש</button>
    </form>
  );
}

export default RecipeFilter;