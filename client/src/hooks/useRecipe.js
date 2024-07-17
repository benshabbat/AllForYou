import { useMutation, useQueryClient } from 'react-query';
import api from '../services/api';

export const useAddRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (newRecipe) => api.post('/recipes', newRecipe),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('recipes');
      },
    }
  );
};

export const useEditRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (updatedRecipe) => api.put(`/recipes/${updatedRecipe._id}`, updatedRecipe),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('recipes');
      },
    }
  );
};