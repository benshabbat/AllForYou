
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

// Importing components
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MealPage from './pages/MealPage';
import AddMealPage from './pages/AddMealPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import SubstituteFinder from './components/SubstituteFinder';
import AllergyFilter from './components/AllergyFilter';

// Importing styles
import './styles/styles.css';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/meals/:id" element={<MealPage />} />
            <Route path="/add-meal" element={<AddMealPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <SubstituteFinder />
        <AllergyFilter />
      </Router>
    </Provider>
  );
};

export default App;