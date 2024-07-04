import React, { Suspense, lazy } from 'react';
import { RecipeProvider } from './context/RecipeContext';
import ErrorBoundary from './components/ErrorBoundary';
import AllergenFilter from './components/AllergenFilter';
import RecipeSearch from './components/RecipeSearch';
import './styles/App.css';

const RecipeList = lazy(() => import('./components/RecipeList'));
const AddRecipeForm = lazy(() => import('./components/AddRecipeForm'));

function App() {
  const [filter, setFilter] = React.useState([]);
  const allergens = ['גלוטן', 'חלב', 'ביצים', 'בוטנים', 'סויה'];

  const handleFilterChange = (allergen, isChecked) => {
    setFilter(prevFilter => 
      isChecked 
        ? [...prevFilter, allergen]
        : prevFilter.filter(a => a !== allergen)
    );
  };

  return (
    <ErrorBoundary>
      <RecipeProvider>
        <div className="App">
          <h1>מתכונים ידידותיים לאלרגיות</h1>
          <AllergenFilter allergens={allergens} onFilterChange={handleFilterChange} />
          <RecipeSearch />
          <Suspense fallback={<div>Loading...</div>}>
            <RecipeList filter={filter} />
            <AddRecipeForm />
          </Suspense>
        </div>
      </RecipeProvider>
    </ErrorBoundary>
  );
}

export default App;