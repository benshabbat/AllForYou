import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchRecipes } from '../store/slices/recipeSlice';
import styles from './AdvancedSearch.module.css';
import { GiPeanut, GiMilkCarton, GiEgg, GiWheat } from 'react-icons/gi';
const allergenIcons = {
  'בוטנים': GiPeanut,
  'חלב': GiMilkCarton,
  'ביצים': GiEgg,
  'גלוטן': GiWheat
};

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
        <label>סנן אלרגנים:</label>
        <div className={styles.allergenButtons}>
          {Object.entries(allergenIcons).map(([allergen, Icon]) => (
            <button
              key={allergen}
              type="button"
              onClick={() => handleAllergenChange(allergen)}
              className={`${styles.allergenButton} ${searchParams.allergens.includes(allergen) ? styles.active : ''}`}
            >
              <Icon className={styles.allergenIcon} />
              <span>{allergen}</span>
            </button>
          ))}
        </div>
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