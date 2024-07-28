import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchRecipes, createRecipe, updateRecipe, deleteRecipe } from '../services/recipeService';

export const useRecipes = () => {
  const queryClient = useQueryClient();

  const recipes = useQuery('recipes', fetchRecipes);

  const createRecipeMutation = useMutation(createRecipe, {
    onSuccess: () => {
      queryClient.invalidateQueries('recipes');
    },
  });

  const updateRecipeMutation = useMutation(updateRecipe, {
    onSuccess: () => {
      queryClient.invalidateQueries('recipes');
    },
  });

  const deleteRecipeMutation = useMutation(deleteRecipe, {
    onSuccess: () => {
      queryClient.invalidateQueries('recipes');
    },
  });

  return {
    recipes,
    createRecipe: createRecipeMutation.mutate,
    updateRecipe: updateRecipeMutation.mutate,
    deleteRecipe: deleteRecipeMutation.mutate,
  };
};