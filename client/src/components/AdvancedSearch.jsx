import React, { useState, useCallback } from "react";
import { GiPeanut, GiMilkCarton, GiWheat } from "react-icons/gi";
import { FaEgg } from "react-icons/fa";
import styles from "./AdvancedSearch.module.css";
import { useQuery } from 'react-query';
import { fetchAllergens } from '../api/allergens';

const difficultyLevels = ['קל', 'בינוני', 'מאתגר'];
const categories = ['עיקריות', 'קינוחים', 'סלטים', 'מרקים'];

function AdvancedSearch({ onSearch }) {
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    category: '',
    allergens: [],
    difficulty: '',
  });
  const { data: allergens } = useQuery('allergens', fetchAllergens);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleAllergenToggle = useCallback((allergenId) => {
    setSearchParams(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergenId)
        ? prev.allergens.filter(id => id !== allergenId)
        : [...prev.allergens, allergenId]
    }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSearch(searchParams);
  }, [onSearch, searchParams]);

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <div className={styles.inputsContainer}>
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
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className={styles.inputGroup}>
          <select
            name="difficulty"
            value={searchParams.difficulty}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">כל רמות הקושי</option>
            {difficultyLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.allergenGroup}>
        <span className={styles.allergenLabel}>סנן אלרגנים:</span>
        <div className={styles.allergenButtons}>
          {allergens?.map((allergen) => (
            <button
              key={allergen._id}
              type="button"
              onClick={() => handleAllergenToggle(allergen._id)}
              className={`${styles.allergenButton} ${
                searchParams.allergens.includes(allergen._id) ? styles.active : ''
              }`}
            >
              {allergen.icon && <span className={styles.allergenIcon}>{allergen.icon}</span>}
              <span>{allergen.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.searchButtonContainer}>
        <button type="submit" className={styles.searchButton}>
          חיפוש
        </button>
      </div>
    </form>
  );
}

export default React.memo(AdvancedSearch);