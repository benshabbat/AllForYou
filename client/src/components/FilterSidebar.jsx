import React from 'react';
import { useQuery } from 'react-query';
import api from '../services/api';
import { CATEGORIES, DIFFICULTY_LEVELS } from '../constants';
import styles from './FilterSidebar.module.css';

const FilterSidebar = ({ filters, onFilterChange }) => {
  const { data: allergens, isLoading: allergensLoading, error: allergensError } = useQuery('allergens', () => 
    api.get('/allergens').then(res => res.data)
  );

  const handleCategoryChange = (e) => {
    onFilterChange({ category: e.target.value });
  };

  const handleAllergenChange = (allergenId) => {
    const newAllergens = filters.allergens.includes(allergenId)
      ? filters.allergens.filter(id => id !== allergenId)
      : [...filters.allergens, allergenId];
    onFilterChange({ allergens: newAllergens });
  };

  const handleDifficultyChange = (e) => {
    onFilterChange({ difficulty: e.target.value });
  };

  if (allergensLoading) return <div>טוען אלרגנים...</div>;
  if (allergensError) return <div>שגיאה בטעינת אלרגנים: {allergensError.message}</div>;

  return (
    <aside className={styles.filterSidebar}>
      <h2>סינון מתכונים</h2>
      
      <section className={styles.filterSection}>
        <h3>קטגוריה</h3>
        <select value={filters.category} onChange={handleCategoryChange}>
          <option value="">כל הקטגוריות</option>
          {CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </section>

      <section className={styles.filterSection}>
        <h3>אלרגנים (ללא)</h3>
        <div className={styles.allergenList}>
          {allergens?.map(allergen => (
            <label key={allergen._id} className={styles.allergenItem}>
              <input
                type="checkbox"
                checked={filters.allergens.includes(allergen._id)}
                onChange={() => handleAllergenChange(allergen._id)}
              />
              {allergen.hebrewName}
            </label>
          ))}
        </div>
      </section>

      <section className={styles.filterSection}>
        <h3>רמת קושי</h3>
        <select value={filters.difficulty} onChange={handleDifficultyChange}>
          <option value="">כל הרמות</option>
          {DIFFICULTY_LEVELS.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </section>
    </aside>
  );
};

export default FilterSidebar;