import React, { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../services/api';
import styles from './AllergenManagement.module.css';

const AllergenManagement = ({ userId }) => {
  const queryClient = useQueryClient();
  const [selectedAllergens, setSelectedAllergens] = useState([]);

  // שליפת האלרגנים מהשרת
  const { data: allergens = [], isLoading: allergensLoading, error: allergensError } = useQuery('allergens', () =>
    api.get('/allergens').then(res => res.data)
  );

  // שליפת העדפות האלרגנים של המשתמש
  const { data: userAllergens = [], isLoading: userAllergensLoading, error: userAllergensError } = useQuery(['userAllergens', userId], () =>
    api.get(`/users/${userId}/allergens`).then(res => res.data),
    {
      onSuccess: (data) => {
        setSelectedAllergens(data.map(allergen => allergen._id));
      }
    }
  );

  // עדכון העדפות האלרגנים בשרת
  const updateAllergensMutation = useMutation(
    (newAllergens) => api.put('/users/allergen-preferences', { allergenPreferences: newAllergens }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userAllergens', userId]);
      },
    }
  );

  // עדכון הרשימה המקומית של האלרגנים הנבחרים
  const handleAllergenToggle = useCallback((allergenId) => {
    setSelectedAllergens(prevSelected => {
      const newSelected = prevSelected.includes(allergenId)
        ? prevSelected.filter(id => id !== allergenId)
        : [...prevSelected, allergenId];
      
      updateAllergensMutation.mutate(newSelected);
      return newSelected;
    });
  }, [updateAllergensMutation]);

  // מיזוג האלרגנים הכלליים עם האלרגנים של המשתמש
  const mergedAllergens = useMemo(() => {
    return allergens.map(allergen => ({
      ...allergen,
      isSelected: selectedAllergens.includes(allergen._id)
    }));
  }, [allergens, selectedAllergens]);

  if (allergensLoading || userAllergensLoading) return <div>טוען אלרגנים...</div>;
  if (allergensError) return <div>שגיאה בטעינת אלרגנים: {allergensError.message}</div>;
  if (userAllergensError) return <div>שגיאה בטעינת אלרגנים של המשתמש: {userAllergensError.message}</div>;

  return (
    <div className={styles.allergenManagement}>
      <h2>ניהול אלרגנים</h2>
      <div className={styles.allergenGrid}>
        {mergedAllergens.map((allergen) => (
          <button
            key={allergen._id}
            className={`${styles.allergenButton} ${allergen.isSelected ? styles.selected : ''}`}
            onClick={() => handleAllergenToggle(allergen._id)}
          >
            {allergen.icon} {allergen.hebrewName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(AllergenManagement);