import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/auth/authSlice';
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);





// Forum-related API methods
api.getForumTopics = (page = 1) => 
  api.get(`/forum/topics?page=${page}`).then(res => ({
    topics: res.data.topics || [],
    currentPage: res.data.currentPage,
    totalPages: res.data.totalPages,
    totalTopics: res.data.totalTopics
  }));

api.searchForumTopics = (searchTerm, page = 1) => 
  api.get(`/forum/search?query=${searchTerm}&page=${page}`).then(res => ({
    topics: res.data.topics || [],
    currentPage: res.data.currentPage,
    totalPages: res.data.totalPages,
    totalTopics: res.data.totalTopics
  }));

api.createForumTopic = (topicData) => 
  api.post('/forum/topics', topicData);

api.deleteForumTopic = (topicId) => 
  api.delete(`/forum/topics/${topicId}`);

api.getForumTopic = (topicId) => 
  api.get(`/forum/topics/${topicId}`);

api.createForumReply = (topicId, replyData) => 
  api.post(`/forum/topics/${topicId}/replies`, replyData);


// הוספת פונקציה חדשה לקבלת כל האלרגנים
api.getAllAllergens = () => api.get('/allergens');

// עדכון הפונקציה הקיימת לקבלת אלרגנים לפי ID
api.getAllergensByIds = (ids) => api.get('/allergens/byIds', { params: { ids: ids.join(',') } });

export default api;