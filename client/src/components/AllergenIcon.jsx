import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip';
import styles from './AllergenIcon.module.css';

const AllergenIcon = ({ allergen, size = 'medium', showTooltip = true }) => {
  // בדיקה אם allergen הוא מחרוזת או אובייקט
  const allergenObject = typeof allergen === 'string' 
    ? { _id: allergen, name: allergen, hebrewName: allergen, icon: '❓' } 
    : allergen;

  const iconClass = `${styles.allergenIcon} ${styles[size]}`;
  const iconId = `allergen-icon-${allergenObject._id}`;

  return (
    <>
      <span 
        id={iconId}
        className={iconClass} 
        role="img" 
        aria-label={`${allergenObject.name} allergen`}
        data-tooltip-id={showTooltip ? `tooltip-${allergenObject._id}` : undefined}
      >
        {allergenObject.icon || '❓'}
      </span>
      {showTooltip && (
        <Tooltip id={`tooltip-${allergenObject._id}`} place="top" effect="solid">
          <div className={styles.tooltipContent}>
            <h4>{allergenObject.hebrewName} ({allergenObject.name})</h4>
            <p>{allergenObject.description || 'אין תיאור'}</p>
            {allergenObject.severity && (
              <p className={styles.severity}>
                חומרה: <span className={styles[allergenObject.severity.toLowerCase()]}>{allergenObject.severity}</span>
              </p>
            )}
          </div>
        </Tooltip>
      )}
    </>
  );
};

AllergenIcon.propTypes = {
  allergen: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      hebrewName: PropTypes.string.isRequired,
      icon: PropTypes.string,
      description: PropTypes.string,
      severity: PropTypes.oneOf(['Low', 'Medium', 'High'])
    })
  ]).isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showTooltip: PropTypes.bool
};

export default React.memo(AllergenIcon);