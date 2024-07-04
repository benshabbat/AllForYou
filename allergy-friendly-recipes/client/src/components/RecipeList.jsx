import React, { useState, useEffect } from 'react';
import { getRecipes } from '../services/api';
import RecipeItem from './RecipeItem';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    getRecipes().then(res => setRecipes(res.data));
  }, []);

  return (
    <div>
      <h2>מתכונים</h2>
      {recipes.map(recipe => (
        <RecipeItem key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
}

export default RecipeList;