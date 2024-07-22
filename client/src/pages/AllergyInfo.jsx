import React, { useState } from 'react';
import { useQuery } from 'react-query';
import api from '../services/api';
import AllergenDetails from '../components/AllergenDetails';
import { FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import styles from './AllergyInfo.module.css';

const AllergyInfo = () => {
  const [selectedAllergen, setSelectedAllergen] = useState(null);
  const { data: allergens, isLoading, error } = useQuery('allergens', () =>
    api.get('/allergens').then(res => res.data)
  );

  if (isLoading) return <div className={styles.loading}>טוען מידע על אלרגנים...</div>;
  if (error) return <div className={styles.error}>שגיאה בטעינת מידע: {error.message}</div>;

  return (
    <div className={styles.allergyInfoContainer}>
      <h1 className={styles.mainTitle}>מידע על אלרגיות מזון</h1>
      <div className={styles.infoBox}>
        <FaInfoCircle className={styles.infoIcon} />
        <p>בחר אלרגן מהרשימה כדי לקבל מידע מפורט עליו.</p>
      </div>
      <div className={styles.content}>
        <div className={styles.allergenList}>
          <h2>רשימת אלרגנים</h2>
          <ul>
            {allergens.map(allergen => (
              <li 
                key={allergen._id} 
                className={selectedAllergen === allergen._id ? styles.selected : ''}
                onClick={() => setSelectedAllergen(allergen._id)}
              >
                {allergen.icon && <span className={styles.allergenIcon}>{allergen.icon}</span>}
                {allergen.hebrewName}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.allergenDetails}>
          {selectedAllergen ? (
            <AllergenDetails allergenId={selectedAllergen} />
          ) : (
            <div className={styles.noSelection}>
              <FaExclamationTriangle className={styles.warningIcon} />
              <p>בחר אלרגן מהרשימה כדי לראות מידע מפורט</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllergyInfo;