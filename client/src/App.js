import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index.js'; 
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
    <Provider store={store}>
      <Router>
        <Header />
        <Routes>
          {/* נתיבים ציבוריים */}
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<RecipeList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* נתיבים מאובטחים */}
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
    </Provider>
  );
}

export default App;