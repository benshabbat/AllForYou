import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Recipe from './pages/Recipe';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          {/* הנתיב הראשי משתמש בקומפוננטת Layout */}
          <Route path="/" element={<Layout />}>
            {/* נתיבי המשנה יוצגו בתוך ה-Outlet של ה-Layout */}
            <Route index element={<Home />} />
            <Route path="recipe/:id" element={<Recipe />} />
            <Route path="add-recipe" element={<AddRecipe />} />
            <Route path="edit-recipe/:id" element={<EditRecipe />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;