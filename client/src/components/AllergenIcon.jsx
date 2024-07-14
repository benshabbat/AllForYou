import React from 'react';
import PropTypes from 'prop-types';
import styles from './AllergenIcon.module.css';

const AllergenIcon = ({ allergen, size = 'medium' }) => {
  return (
    <span 
      className={`${styles.allergenIcon} ${styles[size]}`} 
      title={allergen.hebrewName}
    >
      {allergen.icon}
    </span>
  );
};

AllergenIcon.propTypes = {
  allergen: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    hebrewName: PropTypes.string.isRequired,
  }).isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default AllergenIcon;