import { useQuery } from 'react-query';
import { fetchUserProfile } from '../store/user/userService';

export const useUser = () => {
  return useQuery('userProfile', fetchUserProfile);
};