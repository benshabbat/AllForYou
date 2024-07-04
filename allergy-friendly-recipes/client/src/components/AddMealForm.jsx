import React, { useState } from 'react';
import api from '../services/api';

const AddMealForm = () => {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [substitutes, setSubstitutes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/meals', {
        name,
        ingredients: ingredients.split(','),
        substitutes: substitutes.split(','),
      });
      // ניקוי השדות אחרי שליחה מוצלחת
      setName('');
      setIngredients('');
      setSubstitutes('');
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pure-form pure-form-stacked">
      <fieldset>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Ingredients (comma-separated)</label>
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <label>Substitutes (comma-separated)</label>
        <input
          type="text"
          value={substitutes}
          onChange={(e) => setSubstitutes(e.target.value)}
        />
        <button type="submit" className="pure-button pure-button-primary">
          Add Meal
        </button>
      </fieldset>
    </form>
  );
};

export default AddMealForm;