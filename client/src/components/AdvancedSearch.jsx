import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchRecipes } from '../store/slices/recipeSlice';
import { GiPeanut, GiMilkCarton, GiBrokenEggshell, GiWheat } from 'react-icons/gi';
import styles from './AdvancedSearch.module.css';

// מיפוי אייקונים לאלרגנים
const allergenIcons = {
  'בוטנים': GiPeanut,
  'חלב': GiMilkCarton,
  'ביצים': GiBrokenEggshell,
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

  // טיפול בשינויים בשדות הטקסט והבחירה
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  // טיפול בשינויים בבחירת אלרגנים
  const handleAllergenChange = (allergen) => {
    setSearchParams(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen]
    }));
  };

  // שליחת טופס החיפוש
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchRecipes(searchParams));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      {/* שדה חיפוש לפי מילת מפתח */}
      <input
        type="text"
        name="keyword"
        value={searchParams.keyword}
        onChange={handleChange}
        placeholder="חיפוש לפי מילת מפתח"
        className={styles.input}
      />

      {/* בחירת קטגוריה */}
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

      {/* בחירת אלרגנים */}
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

      {/* בחירת רמת קושי */}
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

      {/* כפתור שליחת החיפוש */}
      <button type="submit" className={styles.searchButton}>חיפוש</button>
    </form>
  );
}

export default AdvancedSearch;