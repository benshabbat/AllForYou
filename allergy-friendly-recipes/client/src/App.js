import React from 'react';
import { RecipeProvider } from './contexts/RecipeContext';
import RecipeList from './components/RecipeList';
import AddRecipeForm from './components/AddRecipeForm';
import AllergenFilter from './components/AllergenFilter';
import RecipeSearch from './components/RecipeSearch';
import { ALLERGENS } from './config';
import './styles/App.css';

function App() {
  return (
    <RecipeProvider>
      <div className="App">
        <h1>מתכונים ידידותיים לאלרגיות</h1>
        <AllergenFilter allergens={ALLERGENS} />
        <RecipeSearch />
        <RecipeList />
        <AddRecipeForm />
      </div>
    </RecipeProvider>
  );
}

export default App;