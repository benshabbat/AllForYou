import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import Home from './pages/Home';
import AddRecipe from './pages/AddRecipe';
import RecipeList from './pages/RecipeList';
import Register from './components/Register';
import Login from './components/Login';
import Header from './components/Header';
import Footer from './components/Footer';

// Layout component - מגדיר את המבנה הכללי של האפליקציה
function Layout() {
  return (
    <div className="App">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// App component - הרכיב הראשי של האפליקציה
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="add-recipe" element={<AddRecipe />} />
            <Route path="recipes" element={<RecipeList />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;