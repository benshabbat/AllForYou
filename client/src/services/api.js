import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// אינטרספטור להוספת טוקן לכל בקשה
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Token added to request:', token);
    } else {
      console.log('No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// אינטרספטור לטיפול בתגובות
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
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