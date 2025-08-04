// src/services/root.service.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor para agregar el token a cada request
instance.interceptors.request.use((config) => {

  const userData = sessionStorage.getItem("usuario");
  const token = userData ? JSON.parse(userData).token : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Si es FormData, dejar que el navegador establezca el Content-Type
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
});

export default instance;
