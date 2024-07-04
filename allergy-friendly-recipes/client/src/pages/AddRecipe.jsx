import React, { useState } from 'react';

import { addRecipe } from '../services/api';

function AddRecipe() {
  const [recipe, setRecipe] = useState({
    name: '',
    ingredients: [''],
    instructions: '',
    allergens: [''],
    substitutions: [{ ingredient: '', alternatives: [''] }]
  });

  const handleChange = (e, index, field, subField) => {
    const { name, value } = e.target;
    if (field === 'ingredients' || field === 'allergens') {
      const newArray = [...recipe[field]];
      newArray[index] = value;
      setRecipe({ ...recipe, [field]: newArray });
    } else if (field === 'substitutions') {
      const newSubs = [...recipe.substitutions];
      newSubs[index][subField] = value;
      setRecipe({ ...recipe, substitutions: newSubs });
    } else {
      setRecipe({ ...recipe, [name]: value });
    }
  };

  const addField = (field) => {
    if (field === 'substitutions') {
      setRecipe({
        ...recipe,
        substitutions: [...recipe.substitutions, { ingredient: '', alternatives: [''] }]
      });
    } else {
      setRecipe({ ...recipe, [field]: [...recipe[field], ''] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addRecipe(recipe).then(() => {

    });
  };

  return (
    <form onSubmit={handleSubmit} className="add-recipe-form">
      <input
        type="text"
        name="name"
        value={recipe.name}
        onChange={handleChange}
        placeholder="שם המתכון"
        required
      />
      
      <h3>מצרכים:</h3>
      {recipe.ingredients.map((ing, index) => (
        <input
          key={index}
          type="text"
          value={ing}
          onChange={(e) => handleChange(e, index, 'ingredients')}
          placeholder="מצרך"
        />
      ))}
      <button type="button" onClick={() => addField('ingredients')}>הוסף מצרך</button>

      <textarea
        name="instructions"
        value={recipe.instructions}
        onChange={handleChange}
        placeholder="הוראות הכנה"
        required
      />

      <h3>אלרגנים:</h3>
      {recipe.allergens.map((allergen, index) => (
        <input
          key={index}
          type="text"
          value={allergen}
          onChange={(e) => handleChange(e, index, 'allergens')}
          placeholder="אלרגן"
        />
      ))}
      <button type="button" onClick={() => addField('allergens')}>הוסף אלרגן</button>

      <h3>תחליפים:</h3>
      {recipe.substitutions.map((sub, index) => (
        <div key={index}>
          <input
            type="text"
            value={sub.ingredient}
            onChange={(e) => handleChange(e, index, 'substitutions', 'ingredient')}
            placeholder="מצרך לתחליף"
          />
          <input
            type="text"
            value={sub.alternatives.join(', ')}
            onChange={(e) => handleChange(e, index, 'substitutions', 'alternatives')}
            placeholder="תחליפים (מופרדים בפסיקים)"
          />
        </div>
      ))}
      <button type="button" onClick={() => addField('substitutions')}>הוסף תחליף</button>

      <button type="submit">הוסף מתכון</button>
    </form>
  );
}

export default AddRecipe;