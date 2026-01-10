import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Questions API
export const questionsAPI = {
  getAll: () => api.get('/questions'),
  getById: (id) => api.get(`/questions/${id}`),
  getByCategory: (category) => api.get(`/questions/category/${category}`),
  search: (keyword) => api.get(`/questions/search?keyword=${keyword}`),
  create: (data) => api.post('/questions', data),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`),
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
};

export default api;