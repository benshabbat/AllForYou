import React from 'react';
import PropTypes from 'prop-types';
import AllergenIcon from './AllergenIcon';
import styles from './AllergenList.module.css';

const AllergenList = ({ allergens, showTooltips = true }) => {
  if (!allergens || allergens.length === 0) {
    return <p className={styles.noAllergens}>לא נמצאו אלרגנים</p>; // אם אין אלרגנים, לא מציגים כלום
  }

  return (
    <div className={styles.allergenList} aria-label="רשימת אלרגנים">
      <h4 className={styles.allergenTitle}>אלרגנים:</h4>
      <ul className={styles.allergenIcons}>
        {allergens.map(allergen => {
          // בדיקה אם האלרגן הוא אובייקט או מחרוזת
          const allergenObject = typeof allergen === 'string'
            ? { _id: allergen, name: allergen, hebrewName: allergen, icon: '❓' }
            : allergen;

          return (
            <li key={allergenObject._id} className={styles.allergenItem}>
              <AllergenIcon 
                allergen={allergenObject} 
                size="small" 
                showTooltip={showTooltips}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

AllergenList.propTypes = {
  allergens: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        hebrewName: PropTypes.string.isRequired,
        icon: PropTypes.string,
        description: PropTypes.string,
        severity: PropTypes.oneOf(['Low', 'Medium', 'High', 'Unknown'])
      })
    ])
  ).isRequired,
  showTooltips: PropTypes.bool
};

export default React.memo(AllergenList);