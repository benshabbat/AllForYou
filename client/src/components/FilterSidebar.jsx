import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import api from '../services/api';
import { CATEGORIES, DIFFICULTY_LEVELS } from '../constants';
import styles from './FilterSidebar.module.css';

const defaultFilters = {
  category: '',
  difficulty: '',
  allergens: []
};

const FilterSidebar = ({ initialFilters = defaultFilters, onFilterChange }) => {
  const [filters, setFilters] = useState(initialFilters);
  const { data: allergens, isLoading: allergensLoading, error: allergensError } = useQuery('allergens', () => 
    api.get('/allergens').then(res => res.data)
  );

  useEffect(() => {
    setFilters(prevFilters => ({
      ...defaultFilters,
      ...prevFilters,
      ...initialFilters
    }));
  }, [initialFilters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleAllergenChange = (allergenId) => {
    setFilters(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergenId)
        ? prev.allergens.filter(id => id !== allergenId)
        : [...prev.allergens, allergenId]
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  if (allergensLoading) return <div className={styles.loading}>טוען אלרגנים...</div>;
  if (allergensError) return <div className={styles.error}>שגיאה בטעינת אלרגנים: {allergensError.message}</div>;

  return (
    <aside className={styles.filterSidebar}>
      <h2 className={styles.filterTitle}>סינון מתכונים</h2>
      
      <section className={styles.filterSection}>
        <h3>קטגוריה</h3>
        <select 
          name="category"
          value={filters.category}
          onChange={handleInputChange}
          className={styles.filterSelect}
        >
          <option value="">כל הקטגוריות</option>
          {CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </section>

      <section className={styles.filterSection}>
        <h3>רמת קושי</h3>
        <select 
          name="difficulty"
          value={filters.difficulty}
          onChange={handleInputChange}
          className={styles.filterSelect}
        >
          <option value="">כל רמות הקושי</option>
          {DIFFICULTY_LEVELS.map(level => (
            <option key={level} value={level}>{level}</option>
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
                className={styles.allergenCheckbox}
                checked={filters.allergens.includes(allergen._id)}
                onChange={() => handleAllergenChange(allergen._id)}
              />
              <span className={styles.allergenLabel}>{allergen.hebrewName}</span>
            </label>
          ))}
        </div>
      </section>

      <button onClick={handleApplyFilters} className={styles.applyFiltersButton}>
        החל סינונים
      </button>
      <button onClick={handleResetFilters} className={`${styles.applyFiltersButton} ${styles.resetButton}`}>
        אפס סינונים
      </button>
    </aside>
  );
};

export default FilterSidebar;