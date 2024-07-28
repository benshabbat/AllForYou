import api from '../../services/api';

export const fetchAllergens = () => api.get('/allergens');
export const fetchAllergensByIds = (ids) => api.get('/allergens/byIds', { params: { ids: ids.join(',') } });