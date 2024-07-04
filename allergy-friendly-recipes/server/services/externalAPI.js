import axios from 'axios';

const externalAPI = axios.create({
  baseURL: 'https://api.example.com/', // Replace with the actual third-party API base URL
  timeout: 5000,
});

export const getSubstituteOptions = async (ingredient) => {
  try {
    const response = await externalAPI.get(`/substitute?ingredient=${ingredient}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch substitute options');
  }
};