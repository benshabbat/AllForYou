import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import RecipeList from './pages/RecipeList';
import AddRecipe from './pages/AddRecipe';
import Register from './pages/Register';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/add-recipe" 
          element={
            <PrivateRoute>
              <AddRecipe />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;