import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store/index.js'; 
import { loadUser, setInitialized } from './store/slices/authSlice';
import Header from './components/Header';
import Home from './pages/Home';
import RecipeList from './pages/RecipeList';
import AddRecipe from './pages/AddRecipe';
import Register from './pages/Register';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import MyRecipes from './pages/MyRecipes';
import RecipeDetails from './pages/RecipeDetails';
import PrivateRoute from './components/PrivateRoute';

function AppContent() {
  const dispatch = useDispatch();
  const { isInitialized, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      if (localStorage.getItem('token')) {
        console.log('Token found in localStorage, loading user...');
        await dispatch(loadUser());
      } else {
        console.log('No token found in localStorage');
        dispatch(setInitialized());
      }
    };

    initializeAuth();
  }, [dispatch]);

  if (!isInitialized) {
    return <div>טוען...</div>; // או כל מסך טעינה אחר
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-recipe" element={<PrivateRoute><AddRecipe /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
        <Route path="/my-recipes" element={<PrivateRoute><MyRecipes /></PrivateRoute>} />
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