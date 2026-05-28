import axios from 'axios';

const API_BASE = import.meta.env.PROD ? '/api' : '/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach JWT token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401s
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => client.post('/auth/register', data),
  login: (data) => client.post('/auth/login', data),
  getMe: () => client.get('/auth/me'),
  getUsers: () => client.get('/auth/users'),
};

// Projects API
export const projectsAPI = {
  getAll: () => client.get('/projects'),
  getById: (id) => client.get(`/projects/${id}`),
  create: (data) => client.post('/projects', data),
  update: (id, data) => client.put(`/projects/${id}`, data),
  delete: (id) => client.delete(`/projects/${id}`),
};

// Tasks API
export const tasksAPI = {
  create: (data) => client.post('/tasks', data),
  updateStatus: (id, status) => client.put(`/tasks/${id}/status`, { status }),
  update: (id, data) => client.put(`/tasks/${id}`, data),
  delete: (id) => client.delete(`/tasks/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  get: () => client.get('/dashboard'),
};

export default client;
