import { useMutation } from 'react-query';
import api from '../services/api';

export const useAddRecipe = () => {
  return useMutation(
    async (newRecipe) => {
      console.log("Sending recipe data to server:", newRecipe);
      const response = await api.post('/recipes', newRecipe, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Server response:", response.data);
      return response.data;
    },
    {
      onError: (error) => {
        console.error("Error in useAddRecipe:", error);
        console.error("Error response:", error.response?.data);
        throw error;
      }
    }
  );
};