import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Recipe from './pages/Recipe';
import AddRecipe from './pages/AddRecipe';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/recipe/:id" component={Recipe} />
          <Route path="/add-recipe" component={AddRecipe} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;