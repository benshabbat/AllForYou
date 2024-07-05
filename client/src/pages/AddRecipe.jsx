import React, { useState } from 'react';

// AddRecipe component - טופס להוספת מתכון חדש
function AddRecipe() {
  const [recipe, setRecipe] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    allergens: [],
    alternatives: ''
  });

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // כאן נוסיף את הלוגיקה לשליחת המתכון לשרת
    console.log('Recipe submitted:', recipe);
  };

  return (
    <div className="add-recipe">
      <h2>הוספת מתכון חדש</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="שם המתכון" onChange={handleChange} />
        <textarea name="ingredients" placeholder="רכיבים" onChange={handleChange}></textarea>
        <textarea name="instructions" placeholder="הוראות הכנה" onChange={handleChange}></textarea>
        <input type="text" name="allergens" placeholder="אלרגנים (מופרדים בפסיקים)" onChange={handleChange} />
        <textarea name="alternatives" placeholder="חלופות אפשריות" onChange={handleChange}></textarea>
        <button type="submit">הוסף מתכון</button>
      </form>
    </div>
  );
}

export default AddRecipe;
