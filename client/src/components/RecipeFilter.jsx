import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchRecipes } from '../store/slices/recipeSlice';

function RecipeFilter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allergen, setAllergen] = useState('');
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchRecipes({ searchTerm, allergen }));
  };

  return (
    <form onSubmit={handleSearch} className="recipe-filter">
      <input
        type="text"
        placeholder="חפש מתכון..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <input
        type="text"
        placeholder="סנן לפי אלרגן..."
        value={allergen}
        onChange={(e) => setAllergen(e.target.value)}
      />
      <button type="submit">חפש</button>
    </form>
  );
}

export default RecipeFilter;