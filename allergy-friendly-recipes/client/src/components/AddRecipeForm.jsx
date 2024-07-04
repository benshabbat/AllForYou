import React, { useState } from 'react';
import { addRecipe } from '../api';
import SubstituteInput from './SubstituteInput';

function AddRecipeForm({ onAddRecipe }) {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [allergens, setAllergens] = useState('');
  const [substitutes, setSubstitutes] = useState([{ ingredient: '', alternatives: '' }]);

  const handleSubstituteChange = (index, field, value) => {
    const newSubstitutes = [...substitutes];
    if (field === 'remove') {
      newSubstitutes.splice(index, 1);
    } else {
      newSubstitutes[index][field] = value;
    }
    setSubstitutes(newSubstitutes);
  };

  const addSubstitute = () => {
    setSubstitutes([...substitutes, { ingredient: '', alternatives: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newRecipe = await addRecipe({
        name,
        ingredients: ingredients.split(',').map(i => i.trim()),
        allergens: allergens.split(',').map(a => a.trim()),
        substitutes: substitutes.map(s => ({
          ingredient: s.ingredient,
          alternatives: s.alternatives.split(',').map(a => a.trim())
        }))
      });
      onAddRecipe(newRecipe);
      setName('');
      setIngredients('');
      setAllergens('');
      setSubstitutes([{ ingredient: '', alternatives: '' }]);
    } catch (error) {
      console.error('Failed to add recipe:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-recipe-form">
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
      <SubstituteInput
        substitutes={substitutes}
        onChange={handleSubstituteChange}
        onAdd={addSubstitute}
      />
      <button type="submit" className="submit-button">הוסף מתכון</button>
    </form>
  );
}

export default AddRecipeForm;