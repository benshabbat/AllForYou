import React from 'react';
import PropTypes from 'prop-types';
import RatingComponent from './RatingComponent';
import { useRecipeContext } from '../contexts/RecipeContext';

function RecipeItem({ recipe }) {
  const { dispatch } = useRecipeContext();

  const handleRatingChange = (newRating) => {
    dispatch({ type: 'UPDATE_RECIPE_RATING', payload: { id: recipe._id, rating: newRating } });
  };

  return (
    <div className="recipe-card">
      <h3>{recipe.name}</h3>
      <p>מרכיבים: {recipe.ingredients.join(', ')}</p>
      {recipe.allergens.length > 0 && <p>אלרגנים: {recipe.allergens.join(', ')}</p>}
      {recipe.substitutes && recipe.substitutes.length > 0 && (
        <div>
          <h4>תחליפים:</h4>
          <ul>
            {recipe.substitutes.map((sub, index) => (
              <li key={index}>
                {sub.ingredient}: {sub.alternatives.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}
      <RatingComponent
        recipeId={recipe._id}
        currentRating={recipe.averageRating}
        onRatingChange={handleRatingChange}
      />
    </div>
  );
}

RecipeItem.propTypes = {
  recipe: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
    allergens: PropTypes.arrayOf(PropTypes.string),
    substitutes: PropTypes.arrayOf(PropTypes.shape({
      ingredient: PropTypes.string,
      alternatives: PropTypes.arrayOf(PropTypes.string)
    })),
    averageRating: PropTypes.number
  }).isRequired,
};

export default RecipeItem;