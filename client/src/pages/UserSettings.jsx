import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserAllergenPreferences } from '../store/slices/userSlice';
import { fetchAllergens } from '../store/slices/allergenSlice';
import AllergenIcon from '../components/AllergenIcon';
import styles from './UserSettings.module.css';

const UserSettings = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const allergens = useSelector(state => state.allergens.allergens);
  const [selectedAllergens, setSelectedAllergens] = useState([]);

  useEffect(() => {
    dispatch(fetchAllergens());
  }, [dispatch]);

  useEffect(() => {
    if (user && user.allergenPreferences) {
      setSelectedAllergens(user.allergenPreferences);
    }
  }, [user]);

  const handleAllergenToggle = (allergenId) => {
    setSelectedAllergens(prev => 
      prev.includes(allergenId)
        ? prev.filter(id => id !== allergenId)
        : [...prev, allergenId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserAllergenPreferences(selectedAllergens));
  };

  return (
    <div className={styles.userSettings}>
      <h2>הגדרות משתמש</h2>
      <form onSubmit={handleSubmit}>
        <h3>העדפות אלרגנים</h3>
        <div className={styles.allergenList}>
          {allergens.map(allergen => (
            <button
              key={allergen._id}
              type="button"
              onClick={() => handleAllergenToggle(allergen._id)}
              className={`${styles.allergenButton} ${
                selectedAllergens.includes(allergen._id) ? styles.selected : ''
              }`}
            >
              <AllergenIcon allergen={allergen} />
              <span>{allergen.hebrewName}</span>
            </button>
          ))}
        </div>
        <button type="submit" className={styles.submitButton}>שמור העדפות</button>
      </form>
    </div>
  );
};

export default UserSettings;