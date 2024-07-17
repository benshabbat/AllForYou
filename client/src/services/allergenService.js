import api from './api';

const fetchAllergens = async () => {
  try {
    const response = await api.get('/allergens');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch allergens');
  }
};

const allergenService = {
  fetchAllergens
};

export default allergenService;