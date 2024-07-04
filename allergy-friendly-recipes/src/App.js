import React from 'react';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Recipe from './pages/Recipe';
import AddRecipe from './pages/AddRecipe';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route exact path="/" component={Home} />
          <Route path="/recipe/:id" component={Recipe} />
          <Route path="/add-recipe" component={AddRecipe} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;