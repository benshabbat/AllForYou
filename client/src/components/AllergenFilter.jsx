import React from 'react';
import AllergenIcon from './AllergenIcon';
import styles from './AllergenFilter.module.css';

const AllergenFilter = ({ allergens, selectedAllergens, onFilterChange, isLoading, error }) => {
  if (isLoading) return <div className={styles.loading}>טוען אלרגנים...</div>;
  if (error) return <div className={styles.error}>שגיאה בטעינת אלרגנים: {error}</div>;
  if (!allergens || allergens.length === 0) return null;

  const toggleAllergen = (allergenId) => {
    const newSelection = selectedAllergens.includes(allergenId)
      ? selectedAllergens.filter(id => id !== allergenId)
      : [...selectedAllergens, allergenId];
    onFilterChange(newSelection);
  };

  return (
    <div className={styles.allergenFilter}>
      <h3 className={styles.filterTitle}>סנן לפי אלרגנים:</h3>
      <div className={styles.allergenList}>
        {allergens.map(allergen => (
          <button
            key={allergen._id}
            className={`${styles.allergenButton} ${selectedAllergens.includes(allergen._id) ? styles.selected : ''}`}
            onClick={() => toggleAllergen(allergen._id)}
            aria-pressed={selectedAllergens.includes(allergen._id)}
            type="button"
          >
            <AllergenIcon allergen={allergen} />
            <span className={styles.allergenName}>{allergen.hebrewName}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(AllergenFilter);