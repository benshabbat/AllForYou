import { useMemo } from 'react';

export const useRecipeFilter = (recipes, allergenFilter) => {
  return useMemo(() => 
    recipes.filter(recipe => 
      allergenFilter.length === 0 || 
      !recipe.allergens.some(allergen => allergenFilter.includes(allergen._id))
    ),
    [recipes, allergenFilter]
  );
};