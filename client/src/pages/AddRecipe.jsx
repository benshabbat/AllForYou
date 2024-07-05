import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addRecipe } from '../store/slices/recipeSlice';
import { useNavigate } from 'react-router-dom';

function AddRecipe() {
  const [recipe, setRecipe] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    allergens: [],
    alternatives: ''
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'allergens') {
      setRecipe({ ...recipe, allergens: e.target.value.split(',').map(item => item.trim()) });
    } else {
      setRecipe({ ...recipe, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(addRecipe(recipe));
    if (!result.error) {
      navigate('/recipes');
    }
  };

  return (
    <div className="add-recipe">
      <h2>הוספת מתכון חדש</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="שם המתכון" onChange={handleChange} required />
        <textarea name="ingredients" placeholder="רכיבים" onChange={handleChange} required></textarea>
        <textarea name="instructions" placeholder="הוראות הכנה" onChange={handleChange} required></textarea>
        <input type="text" name="allergens" placeholder="אלרגנים (מופרדים בפסיקים)" onChange={handleChange} />
        <textarea name="alternatives" placeholder="חלופות אפשריות" onChange={handleChange}></textarea>
        <button type="submit">הוסף מתכון</button>
      </form>
    </div>
  );
}

export default AddRecipe;