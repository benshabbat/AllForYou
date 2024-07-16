import { useQuery } from 'react-query';
import api from '../services/api';

export const useAllergens = () => {
  const { data: allergens, isLoading, error } = useQuery('allergens', async () => {
    const response = await api.get('/allergens');
    return response.data;
  });

  return { allergens, isLoading, error };
};