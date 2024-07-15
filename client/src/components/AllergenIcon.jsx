import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip';
import styles from './AllergenIcon.module.css';

const AllergenIcon = ({ allergen, size = 'medium', showTooltip = true }) => {
  const iconClass = `${styles.allergenIcon} ${styles[size]}`;
  const iconId = `allergen-icon-${allergen._id}`;

  return (
    <>
      <span 
        id={iconId}
        className={iconClass} 
        role="img" 
        aria-label={`${allergen.name} allergen`}
        data-tooltip-id={showTooltip ? `tooltip-${allergen._id}` : undefined}
      >
        {allergen.icon}
      </span>
      {showTooltip && (
        <Tooltip id={`tooltip-${allergen._id}`} place="top" effect="solid">
          <div className={styles.tooltipContent}>
            <h4>{allergen.hebrewName} ({allergen.name})</h4>
            <p>{allergen.description}</p>
            {allergen.severity && (
              <p className={styles.severity}>
                Severity: <span className={styles[allergen.severity.toLowerCase()]}>{allergen.severity}</span>
              </p>
            )}
          </div>
        </Tooltip>
      )}
    </>
  );
};

AllergenIcon.propTypes = {
  allergen: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    hebrewName: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    severity: PropTypes.oneOf(['Low', 'Medium', 'High'])
  }).isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showTooltip: PropTypes.bool
};

export default React.memo(AllergenIcon);