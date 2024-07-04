import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecipes } from '../services/recipeService';

function Home() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    const recipeData = await getRecipes();
    setRecipes(recipeData);
  };

  return (
    <div className="container">
      <h1>מתכונים ידידותיים לאלרגיים</h1>
      <div className="recipe-list">
        {recipes.map(recipe => (
          <div key={recipe.id} className="recipe-card">
            <h3>{recipe.name}</h3>
            <Link to={`/recipe/${recipe.id}`}>צפה במתכון</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;