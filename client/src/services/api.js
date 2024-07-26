import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

export const getAllergens = async () => {
  try {
    const response = await api.get('/allergens');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching allergens:', error);
    return [];
  }
};

export const getRecipes = async ({ search, category, allergens, difficulty, sortBy, order, page, pageSize }) => {
  try {
    const response = await api.get('/recipes', {
      params: { search, category, allergens: allergens.join(','), difficulty, sortBy, order, page, pageSize }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

export const getDailyTip = async () => {
  try {
    const response = await api.get('/tips/daily');
    return response.data;
  } catch (error) {
    console.error('Error fetching daily tip:', error);
    return null;
  }
};

export const getPopularRecipes = async () => {
  try {
    const response = await api.get('/recipes/popular');
    return response.data;
  } catch (error) {
    console.error('Error fetching popular recipes:', error);
    return [];
  }
};

export default {
  getAllergens,
  getRecipes,
  getDailyTip,
  getPopularRecipes,
};