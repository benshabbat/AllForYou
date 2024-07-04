import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MealList from './components/MealList';

const App = () => {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/meals" component={MealList} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;