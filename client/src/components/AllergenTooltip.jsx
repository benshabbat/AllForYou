import React from 'react';
import PropTypes from 'prop-types';
import styles from './AllergenTooltip.module.css';

const AllergenTooltip = ({ allergen }) => {
  return (
    <div className={styles.tooltipContent}>
      <h4>{allergen.hebrewName}</h4>
      <p>{allergen.description}</p>
      <h5>תסמינים:</h5>
      <ul>
        {allergen.symptoms.map((symptom, index) => (
          <li key={index}>{symptom}</li>
        ))}
      </ul>
      <h5>מזונות להימנע מהם:</h5>
      <ul>
        {allergen.avoidList.map((food, index) => (
          <li key={index}>{food}</li>
        ))}
      </ul>
      <h5>חלופות אפשריות:</h5>
      <ul>
        {allergen.alternatives.map((alternative, index) => (
          <li key={index}>{alternative}</li>
        ))}
      </ul>
    </div>
  );
};

AllergenTooltip.propTypes = {
  allergen: PropTypes.shape({
    hebrewName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    symptoms: PropTypes.arrayOf(PropTypes.string).isRequired,
    avoidList: PropTypes.arrayOf(PropTypes.string).isRequired,
    alternatives: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default AllergenTooltip;