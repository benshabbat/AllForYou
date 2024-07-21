import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../services/api';
import { FaPlus, FaMinus } from 'react-icons/fa';
import styles from './AllergenManagement.module.css';

const AllergenManagement = () => {
  const [userAllergens, setUserAllergens] = useState([]);
  const [newAllergen, setNewAllergen] = useState('');
  const queryClient = useQueryClient();

  const { data: allAllergens, isLoading: isLoadingAllergens } = useQuery('allergens', () =>
    api.get('/allergens').then(res => res.data)
  );

  const { data: userData, isLoading: isLoadingUserData } = useQuery('userData', () =>
    api.get('/user/allergens').then(res => res.data)
  );

  useEffect(() => {
    if (userData) {
      setUserAllergens(userData.allergens);
    }
  }, [userData]);

  const updateAllergensMutation = useMutation(
    (allergens) => api.put('/user/allergens', { allergens }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userData');
      },
    }
  );

  const handleAddAllergen = () => {
    if (newAllergen && !userAllergens.includes(newAllergen)) {
      const updatedAllergens = [...userAllergens, newAllergen];
      setUserAllergens(updatedAllergens);
      updateAllergensMutation.mutate(updatedAllergens);
      setNewAllergen('');
    }
  };

  const handleRemoveAllergen = (allergen) => {
    const updatedAllergens = userAllergens.filter(a => a !== allergen);
    setUserAllergens(updatedAllergens);
    updateAllergensMutation.mutate(updatedAllergens);
  };

  if (isLoadingAllergens || isLoadingUserData) {
    return <div>טוען...</div>;
  }

  return (
    <div className={styles.allergenManagement}>
      <h2>ניהול אלרגנים</h2>
      <div className={styles.addAllergen}>
        <select
          value={newAllergen}
          onChange={(e) => setNewAllergen(e.target.value)}
          className={styles.allergenSelect}
        >
          <option value="">בחר אלרגן</option>
          {allAllergens.map((allergen) => (
            <option key={allergen._id} value={allergen.name}>
              {allergen.hebrewName}
            </option>
          ))}
        </select>
        <button onClick={handleAddAllergen} className={styles.addButton}>
          <FaPlus /> הוסף
        </button>
      </div>
      <ul className={styles.allergenList}>
        {userAllergens.map((allergen) => (
          <li key={allergen} className={styles.allergenItem}>
            {allergen}
            <button
              onClick={() => handleRemoveAllergen(allergen)}
              className={styles.removeButton}
            >
              <FaMinus />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllergenManagement;