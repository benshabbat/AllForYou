import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip';
import { translateSeverity } from '../utils/allergenUtils';
import styles from './AllergenIcon.module.css';

const AllergenIcon = ({ allergen, size = 'medium', showTooltip = true }) => {
  const tooltipId = React.useId();
  
  const allergenObject = typeof allergen === 'string' 
    ? { _id: allergen, name: allergen, hebrewName: allergen, icon: '⚠️' } 
    : allergen;

  const iconClass = `${styles.allergenIcon} ${styles[size]}`;

  const renderTooltipContent = () => (
    <div className={styles.tooltipContent}>
      <h4>{allergenObject.hebrewName || allergenObject.name}</h4>
      <p>{allergenObject.description || 'אין תיאור זמין'}</p>
      {allergenObject.severity && (
        <p className={styles.severity}>
          חומרה: <span className={styles[allergenObject.severity.toLowerCase()]}>
            {translateSeverity(allergenObject.severity)}
          </span>
        </p>
      )}
    </div>
  );

  return (
    <>
      <span 
        className={iconClass} 
        data-tooltip-id={showTooltip ? tooltipId : undefined}
        aria-label={`אלרגן ${allergenObject.hebrewName || allergenObject.name}`}
      >
        {allergenObject.icon || '⚠️'}
      </span>
      {showTooltip && (
        <Tooltip id={tooltipId} place="top" effect="solid">
          {renderTooltipContent()}
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
      hebrewName: PropTypes.string,
      icon: PropTypes.string,
      description: PropTypes.string,
      severity: PropTypes.oneOf(['Low', 'Medium', 'High', 'Unknown'])
    })
  ]).isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showTooltip: PropTypes.bool
};

export default React.memo(AllergenIcon);