import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import api from '../services/api';
import AllergenIcon from './AllergenIcon';
import styles from './AllergenList.module.css';

const AllergenList = ({ allergens = [], showTooltips = true }) => {
  const areAllergenIds = allergens.length > 0 && typeof allergens[0] === 'string';

  const { data: allergenDetails, isLoading, error } = useQuery(
    ['allergens', allergens],
    () => areAllergenIds ? api.getAllergensByIds(allergens) : Promise.resolve(allergens),
    { 
      enabled: allergens.length > 0 && areAllergenIds,
      staleTime: 5 * 60 * 1000 // 5 דקות
    }
  );

  if (!allergens || allergens.length === 0) {
    return null;
  }

  if (isLoading) return <p>טוען אלרגנים...</p>;
  if (error) return <p>שגיאה בטעינת אלרגנים</p>;

  const displayAllergens = areAllergenIds 
    ? (allergenDetails || []).filter(a => allergens.includes(a._id))
    : allergens;

  return (
    <div className={styles.allergenList} aria-label="רשימת אלרגנים">
      <h4 className={styles.allergenTitle}>אלרגנים:</h4>
      <ul className={styles.allergenIcons}>
        {displayAllergens.map(allergen => (
          <li key={allergen._id} className={styles.allergenItem}>
            <AllergenIcon 
              allergen={allergen} 
              size="small" 
              showTooltip={showTooltips}
            />
            <span className={styles.allergenName}>{allergen.hebrewName || allergen.name}</span>
          </li>
        ))}
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
        hebrewName: PropTypes.string,
        icon: PropTypes.string
      })
    ])
  ).isRequired,
  showTooltips: PropTypes.bool
};

export default React.memo(AllergenList);