import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchRecipes } from '../store/slices/recipeSlice';
import styles from './AdvancedSearch.module.css';

function AdvancedSearch() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    category: '',
    allergens: [],
    difficulty: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleAllergenChange = (allergen) => {
    setSearchParams(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchRecipes(searchParams));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <input
        type="text"
        name="keyword"
        value={searchParams.keyword}
        onChange={handleChange}
        placeholder="חיפוש לפי מילת מפתח"
        className={styles.input}
      />
      <select
        name="category"
        value={searchParams.category}
        onChange={handleChange}
        className={styles.select}
      >
        <option value="">כל הקטגוריות</option>
        <option value="עיקריות">עיקריות</option>
        <option value="קינוחים">קינוחים</option>
        <option value="סלטים">סלטים</option>
      </select>
      <div className={styles.allergens}>
        <label>אלרגנים:</label>
        {['בוטנים', 'חלב', 'ביצים', 'גלוטן'].map(allergen => (
          <label key={allergen} className={styles.allergenLabel}>
            <input
              type="checkbox"
              checked={searchParams.allergens.includes(allergen)}
              onChange={() => handleAllergenChange(allergen)}
            />
            {allergen}
          </label>
        ))}
      </div>
      <select
        name="difficulty"
        value={searchParams.difficulty}
        onChange={handleChange}
        className={styles.select}
      >
        <option value="">כל רמות הקושי</option>
        <option value="קל">קל</option>
        <option value="בינוני">בינוני</option>
        <option value="מאתגר">מאתגר</option>
      </select>
      <button type="submit" className={styles.searchButton}>חיפוש</button>
    </form>
  );
}

export default AdvancedSearch;