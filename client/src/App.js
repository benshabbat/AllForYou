import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './store/store';
import Home from './pages/Home';
import AddRecipe from './pages/AddRecipe';
import RecipeList from './pages/RecipeList';
import RecipeDetails from './pages/RecipeDetails';
import Register from './components/Register';
import Login from './components/Login';
import Header from './components/Header';
import Footer from './components/Footer';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          {/* הוספת Header קבוע */}
          <Header />
          <main className="container">
            {/* הגדרת נתיבים לדפים השונים */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/add-recipe" element={<AddRecipe />} />
              <Route path="/recipes" element={<RecipeList />} />
              <Route path="/recipes/:id" element={<RecipeDetails />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
          {/* הוספת Footer קבוע */}
          <Footer />
          {/* הגדרת ToastContainer להצגת הודעות toast */}
          <ToastContainer position="bottom-right" rtl />
        </div>
      </Router>
    </Provider>
  );
}

export default App;