import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AddRecipe from './pages/AddRecipe';
import RecipeList from './pages/RecipeList';

// App component - הרכיב הראשי של האפליקציה
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" component={Home} />
          <Route path="/add-recipe" component={AddRecipe} />
          <Route path="/recipes" component={RecipeList} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;