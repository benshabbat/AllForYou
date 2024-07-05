import React from 'react';

// RecipeForm component - טופס להוספת או עריכת מתכון
function RecipeForm({ recipe, onRecipeChange, onSubmit }) {
  const handleChange = (e) => {
    onRecipeChange({ ...recipe, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" value={recipe.name} placeholder="שם המתכון" onChange={handleChange} />
      <textarea name="ingredients" value={recipe.ingredients} placeholder="רכיבים" onChange={handleChange}></textarea>
      <textarea name="instructions" value={recipe.instructions} placeholder="הוראות הכנה" onChange={handleChange}></textarea>
      <textarea name="alternatives" value={recipe.alternatives} placeholder="חלופות אפשריות" onChange={handleChange}></textarea>
      <button type="submit">שמור מתכון</button>
    </form>
  );
}

export default RecipeForm;