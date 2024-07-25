import React, { useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from 'react-query';
import api from '../services/api';
import { updateUserAllergenPreferences } from '../store/slices/userSlice';
import AllergenIcon from './AllergenIcon';
import { useToast } from './Toast';
import styles from './AllergenManagement.module.css';

const AllergenManagement = () => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const user = useSelector(state => state.auth.user);
  const [selectedAllergens, setSelectedAllergens] = useState(user?.allergenPreferences || []);

  // Fetch all allergens
  const { data: allergens = [], isLoading, error } = useQuery('allergens', () =>
    api.get('/allergens').then(res => res.data)
  );

  // Handle allergen toggle
  const handleAllergenToggle = useCallback((allergenId) => {
    setSelectedAllergens(prevSelected => {
      const newSelected = prevSelected.includes(allergenId)
        ? prevSelected.filter(id => id !== allergenId)
        : [...prevSelected, allergenId];
      
      dispatch(updateUserAllergenPreferences(newSelected))
        .unwrap()
        .then(() => {
          addToast('העדפות האלרגנים עודכנו בהצלחה', 'success');
        })
        .catch((error) => {
          addToast('שגיאה בעדכון העדפות האלרגנים', 'error');
          console.error('Error updating allergen preferences:', error);
        });

      return newSelected;
    });
  }, [dispatch, addToast]);

  // Merge allergens with user preferences
  const mergedAllergens = useMemo(() => {
    if (!Array.isArray(allergens)) return [];
    return allergens.map(allergen => ({
      ...allergen,
      isSelected: selectedAllergens.includes(allergen._id)
    }));
  }, [allergens, selectedAllergens]);

  if (isLoading) return <div>טוען אלרגנים...</div>;
  if (error) return <div>שגיאה בטעינת אלרגנים: {error.message}</div>;

  return (
    <div className={styles.allergenManagement}>
      <h3>ניהול אלרגנים</h3>
      <div className={styles.allergenGrid}>
      {mergedAllergens.length > 0 ? (
  mergedAllergens.map((allergen) => (
          <button
            key={allergen._id}
            className={`${styles.allergenButton} ${allergen.isSelected ? styles.selected : ''}`}
            onClick={() => handleAllergenToggle(allergen._id)}
          >
            <AllergenIcon allergen={allergen} />
            <span>{allergen.hebrewName}</span>
          </button>
          ))
        ) : (
          <p>No allergens available</p>
        )}
      </div>
    </div>
  );
};

export default React.memo(AllergenManagement);