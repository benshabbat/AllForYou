import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { addRecipe } from '../services/recipeService';

function AddRecipe() {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newRecipe = {
      name,
      ingredients: ingredients.split('\n'),
      instructions,
    };
    await addRecipe(newRecipe);
    history.push('/');
  };

  return (
    <div>
      <h1>Add New Recipe</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Ingredients (one per line):</label>
          <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} required />
        </div>
        <div>
          <label>Instructions:</label>
          <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} required />
        </div>
        <button type="submit">Add Recipe</button>
      </form>
    </div>
  );
}

export default AddRecipe;