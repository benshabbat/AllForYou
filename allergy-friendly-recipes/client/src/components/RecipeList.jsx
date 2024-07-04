import React from 'react';
import RecipeItem from './RecipeItem';

function RecipeList({ recipes }) {
  return (
    <div className="recipe-list">
      {recipes.length === 0 ? (
        <p>לא נמצאו מתכונים התואמים לחיפוש שלך.</p>
      ) : (
        recipes.map(recipe => (
          <RecipeItem key={recipe._id} recipe={recipe} />
        ))
      )}
    </div>
  );
}

export default RecipeList;