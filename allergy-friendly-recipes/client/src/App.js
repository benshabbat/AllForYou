import React, { useState } from 'react';
import RecipeList from './components/RecipeList';
import AddRecipeForm from './components/AddRecipeForm';
import AllergenFilter from './components/AllergenFilter';

function App() {
  const [filter, setFilter] = useState([]);
  const allergens = ['גלוטן', 'חלב', 'ביצים', 'בוטנים', 'סויה'];

  const handleFilterChange = (allergen, isChecked) => {
    if (isChecked) {
      setFilter([...filter, allergen]);
    } else {
      setFilter(filter.filter(a => a !== allergen));
    }
  };

  const handleAddRecipe = (recipe) => {
    // כאן נוסיף לוגיקה לשמירת המתכון בשרת
    console.log('מתכון חדש:', recipe);
  };

  return (
    <div className="App">
      <h1>מתכונים ידידותיים לאלרגיות</h1>
      <AllergenFilter allergens={allergens} onFilterChange={handleFilterChange} />
      <RecipeList filter={filter} />
      <AddRecipeForm onAddRecipe={handleAddRecipe} />
    </div>
  );
}

export default App;