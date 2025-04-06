import axios from 'axios';

// פונקציה לשליפת נושאים בפורום
export const fetchForumTopics = async (page = 1, searchTerm = '') => {
  const response = await axios.get(`/api/forum/topics`, {
    params: { page, search: searchTerm },
  });
  return response.data;
};

// פונקציה לחיפוש נושאים בפורום
export const searchForumTopics = async (searchTerm) => {
  const response = await axios.get(`/api/forum/topics/search`, {
    params: { search: searchTerm },
  });
  return response.data;
};