import React from 'react';
import { useQuery } from 'react-query';
import { fetchAllergens } from '../api/allergens';

const AllergenSelector = ({ selectedAllergens, onAllergenToggle }) => {
  const { data: allergens, isLoading, error } = useQuery('allergens', fetchAllergens);

  if (isLoading) return <div>טוען אלרגנים...</div>;
  if (error) return <div>שגיאה בטעינת אלרגנים</div>;

  return (
    <div>
      <h3>בחר אלרגנים:</h3>
      {allergens.map(allergen => (
        <button
          key={allergen._id}
          onClick={() => onAllergenToggle(allergen._id)}
          style={{ backgroundColor: selectedAllergens.includes(allergen._id) ? 'lightblue' : 'white' }}
        >
          {allergen.name}
        </button>
      ))}
    </div>
  );
};

export default AllergenSelector;