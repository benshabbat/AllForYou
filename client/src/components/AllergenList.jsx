import React from 'react';
import { useQuery } from 'react-query';
import api from '../services/api';
import styles from './AllergenList.module.css';

const fetchAllergens = async () => {
  const response = await api.get('/allergens');
  return response.data;
};

const AllergenList = () => {
  const { data: allergens, isLoading, error } = useQuery('allergens', fetchAllergens);

  if (isLoading) return <div>טוען אלרגנים...</div>;
  if (error) return <div>שגיאה בטעינת אלרגנים: {error.message}</div>;

  return (
    <div className={styles.allergenList}>
      <h2>רשימת אלרגנים</h2>
      <ul>
        {allergens.map(allergen => (
          <li key={allergen._id} className={styles.allergenItem}>
            <span className={styles.allergenIcon}>{allergen.icon}</span>
            <span className={styles.allergenName}>{allergen.hebrewName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllergenList;