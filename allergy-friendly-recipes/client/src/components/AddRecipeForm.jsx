import React, { useState } from 'react';

function AddRecipeForm({ onAddRecipe }) {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddRecipe({ name, ingredients: ingredients.split(',').map(i => i.trim()) });
    setName('');
    setIngredients('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>הוסף מתכון חדש</h2>
      <div>
        <label htmlFor="name">שם המתכון:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="ingredients">מרכיבים (מופרדים בפסיקים):</label>
        <textarea
          id="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
        />
      </div>
      <button type="submit">הוסף מתכון</button>
    </form>
  );
}

export default AddRecipeForm;