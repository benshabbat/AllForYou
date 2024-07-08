import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store/index.js'; 
import { loadUser } from './store/slices/authSlice';
import Header from './components/Header';
import Home from './pages/Home';
import RecipeList from './pages/RecipeList';
import AddRecipe from './pages/AddRecipe';
import Register from './pages/Register';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import MyRecipes from './pages/MyRecipes'; // יש להוסיף קומפוננטה זו אם היא לא קיימת
import PrivateRoute from './components/PrivateRoute';

function AppContent() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch, token]);

  return (
    <Router>
      <Header />
      <Routes>
        {/* נתיבים ציבוריים */}
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* נתיבים מאובטחים */}
        <Route path="/add-recipe" element={<PrivateRoute><AddRecipe /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
        <Route path="/my-recipes" element={<PrivateRoute><MyRecipes /></PrivateRoute>} /> {/* נתיב חדש */}
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;