import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getRecipes = () => axios.get(`${API_URL}/recipes`);
export const getRecipe = (id) => axios.get(`${API_URL}/recipes/${id}`);
export const addRecipe = (recipe) => axios.post(`${API_URL}/recipes/add`, recipe);
// הוסף פונקציות נוספות לעדכון ומחיקה