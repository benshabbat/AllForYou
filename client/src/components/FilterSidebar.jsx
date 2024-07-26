import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './FilterSidebar.module.css';

const FilterSidebar = ({ allergens, selectedAllergens, onFilterChange, isLoading, error }) => {
  const safeAllergens = Array.isArray(allergens) ? allergens : [];
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    allergens: selectedAllergens || []
  });

  const filteredAllergens = useMemo(() => {
    return safeAllergens.filter(allergen => 
      allergen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allergen.hebrewName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [safeAllergens, searchTerm]);

  const handleAllergenToggle = useCallback((allergenId) => {
    setFilters(prevFilters => {
      const newAllergens = prevFilters.allergens.includes(allergenId)
        ? prevFilters.allergens.filter(id => id !== allergenId)
        : [...prevFilters.allergens, allergenId];
      
      const newFilters = { ...prevFilters, allergens: newAllergens };
      onFilterChange(newFilters);
      return newFilters;
    });
  }, [onFilterChange]);

  if (isLoading) return <div className={styles.loading}>טוען אלרגנים...</div>;
  if (error) return <div className={styles.error}>שגיאה בטעינת אלרגנים: {error}</div>;

  return (
    <div className={styles.filterSidebar}>
      <h3 className={styles.title}>סינון לפי אלרגנים</h3>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="חפש אלרגן..."
        className={styles.searchInput}
      />
      <div className={styles.allergenList}>
        {filteredAllergens.map(allergen => (
          <button
            key={allergen._id}
            className={`${styles.allergenButton} ${filters.allergens.includes(allergen._id) ? styles.selected : ''}`}
            onClick={() => handleAllergenToggle(allergen._id)}
          >
            {allergen.icon} {allergen.hebrewName}
          </button>
        ))}
      </div>
    </div>
  );
};

FilterSidebar.propTypes = {
  allergens: PropTypes.array,
  selectedAllergens: PropTypes.array,
  onFilterChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string
};

export default React.memo(FilterSidebar);