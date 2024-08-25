import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/users/login`, { email, password });
  return response.data;
};

export const register = async (firstName,lastName, email, password, allergies) => {
  const response = await axios.post(`${API_URL}/users/register`, { 
    firstName, 
    lastName, 
    email, 
    password,
    allergies
  });
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const token = JSON.parse(localStorage.getItem('userInfo')).token;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/users/profile`, userData, config);
  return response.data;
};

export const getRecipes = async () => {
  const response = await axios.get(`${API_URL}/recipes`);
  return response.data;
};

export const getRecipeById = async (id) => {
  const response = await axios.get(`${API_URL}/recipes/${id}`);
  return response.data;
};

export const addRecipe = async (recipeData) => {
  const token = JSON.parse(localStorage.getItem('userInfo')).token;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}/recipes`, recipeData, config);
  return response.data;
};

export const updateRecipe = async (id, recipeData) => {
  const token = JSON.parse(localStorage.getItem('userInfo')).token;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/recipes/${id}`, recipeData, config);
  return response.data;
};