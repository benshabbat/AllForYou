import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

export const useAddRecipe = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation(
    (recipeData) => api.post('/recipes', recipeData),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('recipes');
        toast.success('המתכון נוסף בהצלחה');
        navigate(`/recipe/${data.data._id}`);
      },
      onError: (error) => {
        console.error('שגיאה בהוספת מתכון:', error.response?.data || error);
        toast.error(`שגיאה בהוספת המתכון: ${error.response?.data?.message || error.message}`);
      },
    }
  );
};