import React from 'react';

// RecipeCard component - כרטיסיית מתכון בודד
function RecipeCard({ recipe }) {
  return (
    <div className="recipe-card">
      <h3>{recipe.name}</h3>
      <p>אלרגנים: {recipe.allergens.join(', ')}</p>
      <button onClick={() => console.log('פתיחת פרטי מתכון', recipe.id)}>
        צפה במתכון
      </button>
    </div>
  );
}

export default RecipeCard;