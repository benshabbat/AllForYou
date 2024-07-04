import React from 'react';
import { Link } from 'react-router-dom';

function RecipeItem({ recipe }) {
  return (
    <div className="recipe-item">
      <h3>{recipe.name}</h3>
      <p>אלרגנים: {recipe.allergens.join(', ') || 'אין'}</p>
      <Link to={`/recipe/${recipe._id}`}>צפה במתכון</Link>
    </div>
  );
}

export default RecipeItem;