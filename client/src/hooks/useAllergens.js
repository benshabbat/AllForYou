import { useSelector } from 'react-redux';

export const useAllergens = () => {
  const { allergens, isLoading: allergensLoading, error: allergensError } = useSelector(state => state.recipes);

  return { allergens, allergensLoading, allergensError };
};