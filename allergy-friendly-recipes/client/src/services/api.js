import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const handleError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    // השרת הגיב עם קוד סטטוס שאינו בטווח 2xx
    throw new Error(error.response.data.message || 'שגיאת שרת');
  } else if (error.request) {
    // הבקשה נשלחה אך לא התקבלה תשובה
    throw new Error('לא ניתן להתחבר לשרת');
  } else {
    // משהו השתבש בהגדרת הבקשה
    throw new Error('שגיאה בשליחת הבקשה');
  }
};

export const getRecipes = () => axios.get(`${API_URL}/recipes`).catch(handleError);
export const getRecipe = (id) => axios.get(`${API_URL}/recipes/${id}`).catch(handleError);
export const addRecipe = (recipe) => axios.post(`${API_URL}/recipes/add`, recipe).catch(handleError);
export const updateRecipe = (id, updatedRecipe) => axios.post(`${API_URL}/recipes/update/${id}`, updatedRecipe).catch(handleError);
export const deleteRecipe = (id) => axios.delete(`${API_URL}/recipes/${id}`).catch(handleError);