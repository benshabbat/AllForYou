import React, { useState, useEffect } from 'react';
import { fetchRecipes } from '../api';

function RecipeList({ filter }) {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRecipes() {
      try {
        const data = await fetchRecipes(filter);
        setRecipes(data);
      } catch (err) {
        setError('Failed to load recipes');
      }
    }
    loadRecipes();
  }, [filter]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>רשימת מתכונים</h2>
      <ul>
        {recipes.map(recipe => (
          <li key={recipe._id}>
            <h3>{recipe.name}</h3>
            <p>מרכיבים: {recipe.ingredients.join(', ')}</p>
            {recipe.allergens && <p>אלרגנים: {recipe.allergens.join(', ')}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecipeList;