import React from 'react';

function AllergenFilter({ allergens, onFilterChange }) {
  return (
    <div>
      <h2>סנן לפי אלרגנים</h2>
      {allergens.map(allergen => (
        <label key={allergen}>
          <input
            type="checkbox"
            value={allergen}
            onChange={(e) => onFilterChange(allergen, e.target.checked)}
          />
          {allergen}
        </label>
      ))}
    </div>
  );
}

export default AllergenFilter;