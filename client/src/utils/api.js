import axios from 'axios';

const api = axios.create({
  baseURL: 'https://syncboard-ch6b.onrender.com/api', // ✅ no trailing slash
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ Important: allows cookies / CORS credentials
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
