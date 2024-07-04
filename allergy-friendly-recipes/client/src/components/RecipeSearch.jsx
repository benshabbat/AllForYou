import React, { useState } from 'react';
import { searchRecipes } from '../api';

function RecipeSearch({ onSearchResults }) {
  const [ingredients, setIngredients] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const results = await searchRecipes(ingredients.split(',').map(i => i.trim()));
      onSearchResults(results);
    } catch (error) {
      console.error('Failed to search recipes:', error);
    }
  };

  return (
    <form onSubmit={handleSearch} className="recipe-search">
      <input
        type="text"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="הכנס מרכיבים זמינים (מופרדים בפסיקים)"
      />
      <button type="submit">חפש מתכונים</button>
    </form>
  );
}

export default RecipeSearch;