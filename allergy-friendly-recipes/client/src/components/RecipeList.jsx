import React, { useMemo } from 'react';
import { useRecipeContext } from '../contexts/RecipeContext';
import RecipeItem from './RecipeItem';

function RecipeList() {
  const { recipes, filter } = useRecipeContext();

  const filteredRecipes = useMemo(() => 
    recipes.filter(recipe => 
      !filter.some(allergen => recipe.allergens.includes(allergen))
    ),
    [recipes, filter]
  );

  return (
    <div className="recipe-list">
      {filteredRecipes.map(recipe => (
        <RecipeItem key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
}

export default RecipeList;