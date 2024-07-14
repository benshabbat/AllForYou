import React from 'react';
import PropTypes from 'prop-types';
import AllergenIcon from './AllergenIcon';
import styles from './AllergenWarning.module.css';

const AllergenWarning = ({ allergens }) => {
  if (!allergens || allergens.length === 0) {
    return null;
  }

  return (
    <div className={styles.allergenWarning}>
      <h3>Allergen Warning</h3>
      <p>This recipe contains the following allergens:</p>
      <ul>
        {allergens.map(allergen => (
          <li key={allergen._id}>
            <AllergenIcon allergen={allergen} />
            <span>{allergen.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

AllergenWarning.propTypes = {
  allergens: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired
    })
  ).isRequired
};

export default AllergenWarning;