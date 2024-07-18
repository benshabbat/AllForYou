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
  const [searchAllergen, setSearchAllergen] = useState('');
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
    setSearchAllergen('');
    onFilterChange(defaultFilters);
  };

  const filteredAllergens = allergens?.filter(allergen => 
    allergen.hebrewName.toLowerCase().includes(searchAllergen.toLowerCase()) ||
    allergen.name.toLowerCase().includes(searchAllergen.toLowerCase())
  );

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
        <input
          type="text"
          placeholder="חפש אלרגן..."
          value={searchAllergen}
          onChange={(e) => setSearchAllergen(e.target.value)}
          className={styles.allergenSearch}
        />
        <div className={styles.allergenList}>
          {filteredAllergens?.map(allergen => (
            <div 
              key={allergen._id} 
              className={`${styles.allergenItem} ${filters.allergens.includes(allergen._id) ? styles.selected : ''}`}
              onClick={() => handleAllergenChange(allergen._id)}
            >
              <span className={styles.allergenIcon}>{allergen.icon}</span>
              <span className={styles.allergenName}>{allergen.hebrewName}</span>
            </div>
          ))}
        </div>
      </section>

      <button onClick={handleApplyFilters} className={styles.applyFiltersButton}>
        החל סינונים
      </button>
      <button onClick={handleResetFilters} className={styles.resetButton}>
        אפס סינונים
      </button>
    </aside>
  );
};

export default FilterSidebar;