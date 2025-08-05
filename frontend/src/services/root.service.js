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

// Lo puedo borrar
instance.interceptors.request.use((config) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = user?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
