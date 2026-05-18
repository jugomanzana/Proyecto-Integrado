import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle token expiration or unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    if (!error.response) {
      window.dispatchEvent(new CustomEvent('app-notification', {
        detail: { type: 'error', message: 'No hay conexión con el servidor' }
      }));
    } else if (error.response.status >= 500) {
      window.dispatchEvent(new CustomEvent('app-notification', {
        detail: { type: 'error', message: 'Error interno del servidor. Inténtalo más tarde.' }
      }));
    }

    return Promise.reject(error);
  }
);

export default api;
