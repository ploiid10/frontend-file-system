import axios from 'axios';

const API = axios.create({
  baseURL: 'http://142.93.108.126', // Backend URL
});

// Add JWT token to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
