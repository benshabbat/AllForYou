import React, { useState } from 'react';
import { GiPeanut, GiMilkCarton, GiWheat } from 'react-icons/gi';
import { FaEgg } from 'react-icons/fa';
import styles from './AdvancedSearch.module.css';

const allergenIcons = {
  'בוטנים': GiPeanut,
  'חלב': GiMilkCarton,
  'ביצים': FaEgg,
  'גלוטן': GiWheat
};

function AdvancedSearch({ onSearch }) {
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

  const handleAllergenToggle = (allergen) => {
    setSearchParams(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          name="keyword"
          value={searchParams.keyword}
          onChange={handleChange}
          placeholder="חיפוש לפי מילת מפתח"
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
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
          <option value="מרקים">מרקים</option>
        </select>
      </div>

      <div className={styles.allergenGroup}>
        <span className={styles.allergenLabel}>סנן אלרגנים:</span>
        <div className={styles.allergenButtons}>
          {Object.entries(allergenIcons).map(([allergen, Icon]) => (
            <button
              key={allergen}
              type="button"
              onClick={() => handleAllergenToggle(allergen)}
              className={`${styles.allergenButton} ${searchParams.allergens.includes(allergen) ? styles.active : ''}`}
            >
              <Icon className={styles.allergenIcon} />
              <span>{allergen}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.inputGroup}>
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
      </div>

      <button type="submit" className={styles.searchButton}>חיפוש</button>
    </form>
  );
}

export default AdvancedSearch;