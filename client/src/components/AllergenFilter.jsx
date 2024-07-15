import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AllergenIcon from './AllergenIcon';
import styles from './AllergenFilter.module.css';

const AllergenFilter = ({ allergens, onFilterChange }) => {
  const [selectedAllergens, setSelectedAllergens] = useState([]);

  const toggleAllergen = (allergenId) => {
    setSelectedAllergens(prev => {
      const newSelection = prev.includes(allergenId)
        ? prev.filter(id => id !== allergenId)
        : [...prev, allergenId];
      onFilterChange(newSelection);
      return newSelection;
    });
  };

  return (
    <div className={styles.allergenFilter}>
      <h3 className={styles.filterTitle}>Filter by Allergens:</h3>
      <div className={styles.allergenList}>
        {allergens.map(allergen => (
          <button
            key={allergen._id}
            className={`${styles.allergenButton} ${selectedAllergens.includes(allergen._id) ? styles.selected : ''}`}
            onClick={() => toggleAllergen(allergen._id)}
            aria-pressed={selectedAllergens.includes(allergen._id)}
          >
            <AllergenIcon allergen={allergen} size="small" showTooltip={false} />
            <span className={styles.allergenName}>{allergen.hebrewName}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

AllergenFilter.propTypes = {
  allergens: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      hebrewName: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })
  ).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default React.memo(AllergenFilter);