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
api.getForumTopics = () => api.get('/forum/topics');
api.getForumTopic = (topicId) => api.get(`/forum/topics/${topicId}`);
api.createForumTopic = (topicData) => api.post('/forum/topics', topicData);
api.createForumReply = (topicId, replyData) => api.post(`/forum/topics/${topicId}/replies`, replyData);

export default api;