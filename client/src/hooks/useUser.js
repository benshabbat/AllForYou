import { useQuery } from 'react-query';
import { fetchUserProfile } from '../store/user/userSlice';

export const useUser = () => {
  return useQuery('userProfile', fetchUserProfile);
};