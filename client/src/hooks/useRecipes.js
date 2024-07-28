import { useQuery } from 'react-query';
import { fetchRecipes } from '../store/recipe/recipeService';
export const useRecipes = (params) => {
  return useQuery(['recipes', params], () => fetchRecipes(params));
};
