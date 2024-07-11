import React, { useState, useCallback } from "react";
import { GiPeanut, GiMilkCarton, GiWheat } from "react-icons/gi";
import { FaEgg } from "react-icons/fa";
import styles from "./AdvancedSearch.module.css";
import { fetchAllergens } from '../api/allergens';
import { useQuery } from 'react-query';

const allergenIcons = {
  בוטנים: GiPeanut,
  חלב: GiMilkCarton,
  ביצים: FaEgg,
  גלוטן: GiWheat,
};

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
      [name]: name === "allergens" ? value.split(",").map((a) => a.trim()) : value,
    }));
  }, []);

  const handleAllergenToggle = (allergenId) => {
    setSearchParams(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergenId)
        ? prev.allergens.filter(id => id !== allergenId)
        : [...prev.allergens, allergenId]
    }));
  };

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSearch(searchParams);
  }, [onSearch, searchParams]);

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      {/* סינון אלרגנים */}
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
      <div className={styles.inpFutsContainer}>
        {/* חיפוש לפי מילת מפתח */}
        <div className={styles.inputGroup}>
          <input
            type="text"
            name="keyword"
            value={searchParams.keyword}
            onChange={handleChange}
            placeholder="חיפוש לפי מילת מפתח"
            className={styles.input}
          />
          <span className={styles.inputIcon}>🔍</span>
        </div>
      </div>
      <div className={styles.inputsContainer}>
        {/* בחירת קטגוריה */}
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
          <span className={styles.inputIcon}>▼</span>
        </div>

        {/* בחירת רמת קושי */}
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
          <span className={styles.inputIcon}>▼</span>
        </div>
      </div>

      {/* כפתור חיפוש */}
      <div className={styles.searchButtonContainer}>
        <button type="submit" className={styles.searchButton}>
          חיפוש
        </button>
      </div>
    </form>
  );
}

export default React.memo(AdvancedSearch);






 

