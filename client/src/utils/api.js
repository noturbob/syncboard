import axios from 'axios';

// Check if the app is running in the 'production' environment (on Vercel)
const isProduction = process.env.NODE_ENV === 'production';

// Set the baseURL based on the environment
const baseURL = isProduction 
  ? 'https://syncboard-ch6b.onrender.com/api' 
  : 'http://localhost:4000/api';

const api = axios.create({
  baseURL: baseURL,
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