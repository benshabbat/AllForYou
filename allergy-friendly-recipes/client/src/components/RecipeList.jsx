import React from 'react';
import PropTypes from 'prop-types';
import { useRecipes } from '../context/RecipeContext';

function RecipeList({ filter }) {
  const { recipes, loading, error, deleteExistingRecipe } = useRecipes();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredRecipes = recipes.filter(recipe => 
    !filter.some(allergen => recipe.allergens.includes(allergen))
  );

  return (
    <div className="recipe-list">
      {filteredRecipes.map(recipe => (
        <div key={recipe._id} className="recipe-card">
          <h3>{recipe.name}</h3>
          <p>מרכיבים: {recipe.ingredients.join(', ')}</p>
          {recipe.allergens && <p>אלרגנים: {recipe.allergens.join(', ')}</p>}
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
          <button onClick={() => deleteExistingRecipe(recipe._id)}>מחק</button>
        </div>
      ))}
    </div>
  );
}

RecipeList.propTypes = {
  filter: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RecipeList;