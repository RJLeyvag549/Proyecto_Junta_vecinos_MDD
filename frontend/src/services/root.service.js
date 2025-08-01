// services/root.service.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Adjuntar token automáticamente si existe
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // o donde sea que guardes tu JWT
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
