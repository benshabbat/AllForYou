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
      <h4 id="allergens-title" className={styles.allergenTitle}>Allergens:</h4>
      <ul className={styles.allergenIcons}>
        {allergens.map(allergen => (
          <li key={allergen._id} className={styles.allergenItem}>
            <AllergenIcon 
              allergen={allergen} 
              size="small" 
              showTooltip={showTooltips}
            />
            <span className={styles.allergenName}>{allergen.hebrewName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

AllergenList.propTypes = {
  allergens: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      hebrewName: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      severity: PropTypes.oneOf(['Low', 'Medium', 'High'])
    })
  ).isRequired,
  showTooltips: PropTypes.bool
};

export default React.memo(AllergenList);