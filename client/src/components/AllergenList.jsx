import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip';
import AllergenIcon from './AllergenIcon';
import { translateSeverity, SEVERITY_CLASSES } from '../utils/allergenUtils';
import styles from './AllergenList.module.css';

const AllergenList = ({ allergens, showTooltips = true }) => {
  if (!allergens || allergens.length === 0) {
    return <p className={styles.noAllergens}>לא נמצאו אלרגנים</p>;
  }

  const renderAllergenTooltip = (allergen) => (
    <div className={styles.tooltipContent}>
      <h5>{allergen.hebrewName}</h5>
      <p>{allergen.description || 'אין תיאור זמין'}</p>
      <p>חומרה: {translateSeverity(allergen.severity)}</p>
    </div>
  );

  const renderAllergenItem = (allergen) => {
    const allergenObject = typeof allergen === 'string'
      ? { _id: allergen, name: allergen, hebrewName: allergen, icon: '❓', severity: 'Unknown' }
      : allergen;

    return (
      <li key={allergenObject._id} className={styles.allergenItem}>
        <span
          id={`allergen-${allergenObject._id}`}
          className={`${styles.allergenIcon} ${styles[SEVERITY_CLASSES[allergenObject.severity]]}`}
          data-tooltip-id={showTooltips ? `tooltip-${allergenObject._id}` : undefined}
        >
          <AllergenIcon allergen={allergenObject} size="small" />
        </span>
        {showTooltips && (
          <Tooltip id={`tooltip-${allergenObject._id}`} place="top" effect="solid">
            {renderAllergenTooltip(allergenObject)}
          </Tooltip>
        )}
      </li>
    );
  };

  return (
    <div className={styles.allergenList} aria-label="רשימת אלרגנים">
      <h4 className={styles.allergenTitle}>אלרגנים:</h4>
      <ul className={styles.allergenIcons}>
        {allergens.map(renderAllergenItem)}
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