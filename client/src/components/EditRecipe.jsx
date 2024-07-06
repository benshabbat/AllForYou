import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateRecipe } from '../store/slices/recipeSlice';

function EditRecipe({ recipe, onClose }) {
  const [editedRecipe, setEditedRecipe] = useState(recipe);
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.recipes);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRecipe(prev => ({
      ...prev,
      [name]: name === 'allergens' ? value.split(',').map(item => item.trim()) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateRecipe({ id: recipe._id, recipeData: editedRecipe }));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>עריכת מתכון</h3>
      <input
        type="text"
        name="name"
        value={editedRecipe.name}
        onChange={handleChange}
        placeholder="שם המתכון"
      />
      <textarea
        name="ingredients"
        value={editedRecipe.ingredients}
        onChange={handleChange}
        placeholder="רכיבים"
      />
      <textarea
        name="instructions"
        value={editedRecipe.instructions}
        onChange={handleChange}
        placeholder="הוראות הכנה"
      />
      <input
        type="text"
        name="allergens"
        value={editedRecipe.allergens.join(', ')}
        onChange={handleChange}
        placeholder="אלרגנים (מופרדים בפסיקים)"
      />
      <textarea
        name="alternatives"
        value={editedRecipe.alternatives}
        onChange={handleChange}
        placeholder="חלופות אפשריות"
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'מעדכן...' : 'עדכן מתכון'}
      </button>
      <button type="button" onClick={onClose}>ביטול</button>
    </form>
  );
}

export default EditRecipe;