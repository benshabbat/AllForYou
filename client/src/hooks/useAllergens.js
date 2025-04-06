import { useQuery } from 'react-query';
import { apiUtils } from '../utils/apiUtils';

export const useAllergens = () => {
  return useQuery('allergens', apiUtils.fetchAllergens);
};