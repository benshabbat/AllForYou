import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from '../hooks/useForm';
import { addRecipe } from '../services/api';
import SubstituteInput from './SubstituteInput';

function AddRecipeForm({ onAddRecipe }) {
  const [formValues, handleChange, reset] = useForm({
    name: '',
    ingredients: '',
    allergens: '',
  });
  const [substitutes, setSubstitutes] = useState([{ ingredient: '', alternatives: '' }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newRecipe = await addRecipe({
        ...formValues,
        ingredients: formValues.ingredients.split(',').map(i => i.trim()),
        allergens: formValues.allergens.split(',').map(a => a.trim()),
        substitutes: substitutes.map(s => ({
          ingredient: s.ingredient,
          alternatives: s.alternatives.split(',').map(a => a.trim())
        }))
      });
      onAddRecipe(newRecipe);
      reset();
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
          name="name"
          value={formValues.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="ingredients">מרכיבים (מופרדים בפסיקים):</label>
        <textarea
          id="ingredients"
          name="ingredients"
          value={formValues.ingredients}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="allergens">אלרגנים (מופרדים בפסיקים):</label>
        <input
          type="text"
          id="allergens"
          name="allergens"
          value={formValues.allergens}
          onChange={handleChange}
        />
      </div>
      <SubstituteInput
        substitutes={substitutes}
        onChange={setSubstitutes}
      />
      <button type="submit" className="submit-button">הוסף מתכון</button>
    </form>
  );
}

AddRecipeForm.propTypes = {
  onAddRecipe: PropTypes.func.isRequired,
};

export default AddRecipeForm;