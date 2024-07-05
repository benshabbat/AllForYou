import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // החלף זאת עם כתובת ה-API האמיתית שלך
});

// אינטרספטור להוספת טוקן לכל בקשה
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;