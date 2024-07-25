import React, { useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../services/api';
import { updateUserAllergenPreferences } from '../store/slices/userSlice';
import AllergenIcon from './AllergenIcon';
import { useToast } from '../hooks/useToast';
import styles from './AllergenManagement.module.css';

/**
 * AllergenManagement component for managing user's allergen preferences.
 */
const AllergenManagement = () => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const user = useSelector(state => state.auth.user);
  const [selectedAllergens, setSelectedAllergens] = useState(user?.allergenPreferences || []);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: allergens = [], isLoading, error } = useQuery('allergens', () =>
    api.get('/allergens').then(res => res.data)
  );

  const updateAllergensMutation = useMutation(
    (newAllergens) => api.put('/users/allergen-preferences', { allergenPreferences: newAllergens }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user');
        addToast('העדפות האלרגנים עודכנו בהצלחה', 'success');
      },
      onError: (error) => {
        addToast(`שגיאה בעדכון העדפות האלרגנים: ${error.message}`, 'error');
      }
    }
  );

  const handleAllergenToggle = useCallback((allergenId) => {
    setSelectedAllergens(prevSelected => {
      const newSelected = prevSelected.includes(allergenId)
        ? prevSelected.filter(id => id !== allergenId)
        : [...prevSelected, allergenId];
      
      dispatch(updateUserAllergenPreferences(newSelected));
      updateAllergensMutation.mutate(newSelected);

      return newSelected;
    });
  }, [dispatch, updateAllergensMutation]);

  const filteredAllergens = useMemo(() => {
    return allergens.filter(allergen => 
      allergen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allergen.hebrewName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allergens, searchTerm]);

  if (isLoading) return <div>טוען אלרגנים...</div>;
  if (error) return <div>שגיאה בטעינת אלרגנים: {error.message}</div>;

  return (
    <div className={styles.allergenManagement}>
      <h3>ניהול אלרגנים</h3>
      <input
        type="text"
        placeholder="חפש אלרגן..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      <div className={styles.allergenGrid}>
        {filteredAllergens.map((allergen) => (
          <button
            key={allergen._id}
            className={`${styles.allergenButton} ${selectedAllergens.includes(allergen._id) ? styles.selected : ''}`}
            onClick={() => handleAllergenToggle(allergen._id)}
            aria-pressed={selectedAllergens.includes(allergen._id)}
          >
            <AllergenIcon allergen={allergen} />
            <span>{allergen.hebrewName}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(AllergenManagement);