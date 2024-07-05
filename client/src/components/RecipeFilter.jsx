import React, { useState } from 'react';

// RecipeFilter component - רכיב לסינון מתכונים לפי אלרגנים
function RecipeFilter({ onFilter }) {
  const [allergens, setAllergens] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(allergens.split(',').map(a => a.trim()));
  };

  return (
    <form onSubmit={handleSubmit} className="recipe-filter">
      <input 
        type="text" 
        value={allergens} 
        onChange={(e) => setAllergens(e.target.value)}
        placeholder="הכנס אלרגנים לסינון (מופרדים בפסיקים)"
      />
      <button type="submit">סנן</button>
    </form>
  );
}

export default RecipeFilter;