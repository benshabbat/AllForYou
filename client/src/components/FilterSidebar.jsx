import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import PropTypes from 'prop-types';
import api from '../services/api';
import { CATEGORIES, DIFFICULTY_LEVELS } from '../constants';
import styles from './FilterSidebar.module.css';

/**
 * FilterSidebar component for filtering recipes.
 * 
 * @param {Object} props
 * @param {Object} props.initialFilters - Initial filter values
 * @param {Function} props.onFilterChange - Callback function when filters change
 */
const FilterSidebar = ({ initialFilters = {}, onFilterChange }) => {
  const [filters, setFilters] = useState(initialFilters);
  const [searchAllergen, setSearchAllergen] = useState('');

  const { data: allergens, isLoading: allergensLoading, error: allergensError } = useQuery('allergens', () => 
    api.get('/allergens').then(res => res.data)
  );

  useEffect(() => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...initialFilters
    }));
  }, [initialFilters]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleAllergenChange = useCallback((allergenId) => {
    setFilters(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergenId)
        ? prev.allergens.filter(id => id !== allergenId)
        : [...prev.allergens, allergenId]
    }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleResetFilters = useCallback(() => {
    setFilters({
      category: '',
      difficulty: '',
      allergens: []
    });
    setSearchAllergen('');
    onFilterChange({
      category: '',
      difficulty: '',
      allergens: []
    });
  }, [onFilterChange]);

  const filteredAllergens = useMemo(() => 
    allergens?.filter(allergen => 
      allergen.hebrewName.toLowerCase().includes(searchAllergen.toLowerCase()) ||
      allergen.name.toLowerCase().includes(searchAllergen.toLowerCase())
    ),
    [allergens, searchAllergen]
  );

  const renderSelect = useCallback((name, label, options) => (
    <div className={styles.filterSection}>
      <label htmlFor={name}>{label}</label>
      <select 
        id={name}
        name={name}
        value={filters[name]}
        onChange={handleInputChange}
        className={styles.filterSelect}
      >
        <option value="">הכל</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  ), [filters, handleInputChange]);

  const renderAllergenList = useCallback(() => (
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
  ), [filteredAllergens, filters.allergens, handleAllergenChange]);

  if (allergensLoading) return <div className={styles.loading}>טוען אלרגנים...</div>;
  if (allergensError) return <div className={styles.error}>שגיאה בטעינת אלרגנים: {allergensError.message}</div>;

  return (
    <aside className={styles.filterSidebar}>
      <h2 className={styles.filterTitle}>סינון מתכונים</h2>
      
      {renderSelect('category', 'קטגוריה', CATEGORIES)}
      {renderSelect('difficulty', 'רמת קושי', DIFFICULTY_LEVELS)}

      <div className={styles.filterSection}>
        <h3>אלרגנים (ללא)</h3>
        <input
          type="text"
          placeholder="חפש אלרגן..."
          value={searchAllergen}
          onChange={(e) => setSearchAllergen(e.target.value)}
          className={styles.allergenSearch}
        />
        {renderAllergenList()}
      </div>

      <button onClick={handleApplyFilters} className={styles.applyFiltersButton}>
        החל סינונים
      </button>
      <button onClick={handleResetFilters} className={styles.resetButton}>
        אפס סינונים
      </button>
    </aside>
  );
};

FilterSidebar.propTypes = {
  initialFilters: PropTypes.shape({
    category: PropTypes.string,
    difficulty: PropTypes.string,
    allergens: PropTypes.arrayOf(PropTypes.string)
  }),
  onFilterChange: PropTypes.func.isRequired
};

export default React.memo(FilterSidebar);