import React from 'react';
import PropTypes from 'prop-types';
import { useRecipes } from '../context/RecipeContext';

function RecipeRating({ recipeId, currentRating }) {
  const { rateRecipe } = useRecipes();

  const handleRating = async (score) => {
    try {
      // בפרויקט אמיתי, היינו משתמשים במזהה משתמש אמיתי כאן
      await rateRecipe(recipeId, 'user123', score);
    } catch (error) {
      console.error('Failed to rate recipe:', error);
    }
  };

  return (
    <div className="recipe-rating">
      <p>דירוג ממוצע: {currentRating.toFixed(1)}</p>
      <div>
        {[1, 2, 3, 4, 5].map(score => (
          <button key={score} onClick={() => handleRating(score)}>
            {score}
          </button>
        ))}
      </div>
    </div>
  );
}

RecipeRating.propTypes = {
  recipeId: PropTypes.string.isRequired,
  currentRating: PropTypes.number.isRequired,
};

export default RecipeRating;