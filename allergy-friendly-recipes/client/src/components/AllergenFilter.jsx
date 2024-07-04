import React from 'react';

function AllergenFilter({ allergens, allergenFilter, handleAllergenChange }) {
  return (
    <div className="allergen-filter">
      <h3>סנן לפי אלרגנים:</h3>
      {allergens.map(allergen => (
        <label key={allergen} className="allergen-checkbox">
          <input
            type="checkbox"
            checked={allergenFilter.includes(allergen)}
            onChange={() => handleAllergenChange(allergen)}
          />
          {allergen}
        </label>
      ))}
    </div>
  );
}

export default AllergenFilter;