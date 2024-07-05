import React, { useState } from 'react';

// AllergenInput component - קלט להוספת אלרגנים
function AllergenInput({ allergens, onAllergensChange }) {
  const [newAllergen, setNewAllergen] = useState('');

  const handleAddAllergen = () => {
    if (newAllergen && !allergens.includes(newAllergen)) {
      onAllergensChange([...allergens, newAllergen]);
      setNewAllergen('');
    }
  };

  const handleRemoveAllergen = (allergen) => {
    onAllergensChange(allergens.filter(a => a !== allergen));
  };

  return (
    <div className="allergen-input">
      <input 
        type="text"
        value={newAllergen}
        onChange={(e) => setNewAllergen(e.target.value)}
        placeholder="הוסף אלרגן"
      />
      <button type="button" onClick={handleAddAllergen}>הוסף</button>
      <ul>
        {allergens.map(allergen => (
          <li key={allergen}>
            {allergen}
            <button type="button" onClick={() => handleRemoveAllergen(allergen)}>הסר</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllergenInput;