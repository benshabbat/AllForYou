import React, { useState } from 'react';
import RecipeForm from '../components/RecipeForm';
import AllergenInput from '../components/AllergenInput';

// AddRecipe component - עמוד הוספת מתכון חדש
function AddRecipe() {
  const [recipe, setRecipe] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    allergens: [],
    alternatives: ''
  });

  const handleRecipeChange = (updatedRecipe) => {
    setRecipe(updatedRecipe);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // כאן נוסיף את הלוגיקה לשליחת המתכון לשרת
    console.log('Recipe submitted:', recipe);
  };

  return (
    <div className="add-recipe">
      <h2>הוספת מתכון חדש</h2>
      <RecipeForm 
        recipe={recipe} 
        onRecipeChange={handleRecipeChange}
        onSubmit={handleSubmit}
      />
      <AllergenInput 
        allergens={recipe.allergens}
        onAllergensChange={(allergens) => setRecipe({...recipe, allergens})}
      />
    </div>
  );
}

export default AddRecipe;