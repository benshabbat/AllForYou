import React from 'react';
import PropTypes from 'prop-types';
import AllergenIcon from './AllergenIcon';
import styles from './AllergenList.module.css';

const AllergenList = ({ allergens, showTooltips = true }) => {
  if (!allergens || allergens.length === 0) {
    return null;
  }

  return (
    <div className={styles.allergenList} aria-labelledby="allergens-title">
      <h4 id="allergens-title" className={styles.allergenTitle}>אלרגנים:</h4>
      <ul className={styles.allergenIcons}>
        {allergens.map(allergen => {
          // בדיקה אם allergen הוא מחרוזת או אובייקט
          const allergenObject = typeof allergen === 'string' 
            ? { _id: allergen, name: allergen, hebrewName: allergen } 
            : allergen;
          
          return (
            <li key={allergenObject._id} className={styles.allergenItem}>
              <AllergenIcon 
                allergen={allergenObject} 
                size="small" 
                showTooltip={showTooltips}
              />
              <span className={styles.allergenName}>{allergenObject.hebrewName}</span>
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
        severity: PropTypes.oneOf(['Low', 'Medium', 'High'])
      })
    ])
  ).isRequired,
  showTooltips: PropTypes.bool
};

export default React.memo(AllergenList);