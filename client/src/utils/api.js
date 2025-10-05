import axios from 'axios';

const api = axios.create({
  // This is now hardcoded to your live backend URL.
  // There are no variables or conditions.
  baseURL: 'https://syncboard-ch6b.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;