import React from 'react';
import PropTypes from 'prop-types';
import AllergenIcon from './AllergenIcon';
import styles from './AllergenWarning.module.css';

const AllergenWarning = ({ allergens = [], isLoading = false }) => {
  if (isLoading) {
    return <div className={styles.allergenWarning}>טוען מידע על אלרגנים...</div>;
  }

  if (!allergens || allergens.length === 0) {
    return null;
  }

  return (
    <div className={styles.allergenWarning} role="alert">
      <h3 className={styles.warningTitle}>
        <span className={styles.warningIcon} aria-hidden="true">⚠️</span>
        אזהרת אלרגנים
      </h3>
      <p className={styles.warningDescription}>מתכון זה מכיל את האלרגנים הבאים:</p>
      <ul className={styles.allergenList}>
        {allergens.map((allergen) => (
          <li key={allergen._id} className={styles.allergenItem}>
            <AllergenIcon allergen={allergen} size="medium" />
            <span className={styles.allergenName}>{allergen.hebrewName || allergen.name}</span>
          </li>
        ))}
      </ul>
      <p className={styles.warningFooter}>
        אם יש לך אלרגיה לאחד מהמרכיבים הללו, אנא התייעץ עם רופא לפני צריכת המתכון.
      </p>
    </div>
  );
};

AllergenWarning.propTypes = {
  allergens: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      hebrewName: PropTypes.string,
      icon: PropTypes.string,
      severity: PropTypes.string
    })
  ),
  isLoading: PropTypes.bool
};

export default React.memo(AllergenWarning);