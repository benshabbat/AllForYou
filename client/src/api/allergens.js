import api from '../services/api';

export const fetchAllergens = async () => {
  try {
    const response = await api.get('/allergens');
    return response.data;
  } catch (error) {
    throw new Error('שגיאה בטעינת אלרגנים');
  }
};

export const createAllergen = async (allergenData) => {
  try {
    const response = await api.post('/allergens', allergenData);
    return response.data;
  } catch (error) {
    throw new Error('שגיאה ביצירת אלרגן');
  }
};

// ניתן להוסיף פונקציות נוספות לפי הצורך, כמו עדכון או מחיקה של אלרגנים