import React, { useState } from 'react';
import RecipeList from './components/RecipeList';
import AddRecipeForm from './components/AddRecipeForm';
import AllergenFilter from './components/AllergenFilter';
import RecipeSearch from './components/RecipeSearch';
import './styles/App.css';

function App() {
  const [filter, setFilter] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const allergens = ['גלוטן', 'חלב', 'ביצים', 'בוטנים', 'סויה'];

  const handleFilterChange = (allergen, isChecked) => {
    if (isChecked) {
      setFilter([...filter, allergen]);
    } else {
      setFilter(filter.filter(a => a !== allergen));
    }
  };

  const handleAddRecipe = (recipe) => {
    console.log('מתכון חדש נוסף:', recipe);
    setSearchResults(null); // Reset search results when a new recipe is added
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  return (
    <div className="App">
      <h1>מתכונים ידידותיים לאלרגיות</h1>
      <AllergenFilter allergens={allergens} onFilterChange={handleFilterChange} />
      <RecipeSearch onSearchResults={handleSearchResults} />
      {searchResults ? (
        <RecipeList recipes={searchResults} filter={filter} />
      ) : (
        <RecipeList filter={filter} />
      )}
      <AddRecipeForm onAddRecipe={handleAddRecipe} />
    </div>
  );
}

export default App;