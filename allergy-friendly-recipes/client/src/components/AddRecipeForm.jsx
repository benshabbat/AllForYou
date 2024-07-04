import React, { useState } from 'react';
import { addRecipe } from '../api';

function AddRecipeForm({ onAddRecipe }) {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [allergens, setAllergens] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newRecipe = await addRecipe({
        name,
        ingredients: ingredients.split(',').map(i => i.trim()),
        allergens: allergens.split(',').map(a => a.trim()),
      });
      onAddRecipe(newRecipe);
      setName('');
      setIngredients('');
      setAllergens('');
    } catch (error) {
      console.error('Failed to add recipe:', error);
    }
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
      <div>
        <label htmlFor="allergens">אלרגנים (מופרדים בפסיקים):</label>
        <input
          type="text"
          id="allergens"
          value={allergens}
          onChange={(e) => setAllergens(e.target.value)}
        />
      </div>
      <button type="submit">הוסף מתכון</button>
    </form>
  );
}

export default AddRecipeForm;