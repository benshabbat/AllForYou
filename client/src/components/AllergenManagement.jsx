import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../services/api';
import styles from './AllergenManagement.module.css';

const AllergenManagement = () => {
  const queryClient = useQueryClient();
  const { data: allergens, isLoading, error } = useQuery('allergens', () =>
    api.get('/users/allergens').then(res => res.data)
  );

  const updateAllergensMutation = useMutation(
    (allergens) => api.put('/users/allergen-preferences', { allergenPreferences: allergens }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('allergens');
      },
    }
  );

  if (isLoading) return <div>טוען אלרגנים...</div>;
  if (error) return <div>שגיאה בטעינת אלרגנים: {error.message}</div>;

  const handleAllergenToggle = (allergenId) => {
    const updatedAllergens = allergens.includes(allergenId)
      ? allergens.filter(id => id !== allergenId)
      : [...allergens, allergenId];
    updateAllergensMutation.mutate(updatedAllergens);
  };

  return (
    <div className={styles.allergenManagement}>
      <h2>ניהול אלרגנים</h2>
      {allergens && allergens.length > 0 ? (
        <div className={styles.allergenList}>
          {allergens.map((allergen) => (
            <div key={allergen._id} className={styles.allergenItem}>
              <label>
                <input
                  type="checkbox"
                  checked={allergens.includes(allergen._id)}
                  onChange={() => handleAllergenToggle(allergen._id)}
                />
                {allergen.name}
              </label>
            </div>
          ))}
        </div>
      ) : (
        <p>אין אלרגנים זמינים כרגע.</p>
      )}
    </div>
  );
};

export default AllergenManagement;