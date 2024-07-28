import api from '../../services/api';

export const login = (credentials) => api.post('/users/login', credentials);
export const register = (userData) => api.post('/users/register', userData);
export const logout = () => {
  localStorage.removeItem('token');
  // Additional logout logic if needed
};
