import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRecipeById } from '../services/recipeService';

function Recipe() {
  const [recipe, setRecipe] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    const recipeData = await getRecipeById(id);
    setRecipe(recipeData);
  };

  if (!recipe) return <div>Loading...</div>;

  return (
    <div>
      <h1>{recipe.name}</h1>
      <h2>Ingredients:</h2>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h2>Instructions:</h2>
      <p>{recipe.instructions}</p>
    </div>
  );
}

export default Recipe;