import axios from 'axios';
import {
  getAccessToken,
//   setAccessToken,
  refreshAccessToken
} from '../auth/authservice';
// import useAuth from '../hooks/useAuth';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // replace with your API base URL
});

// const refreshInstance = axios.create({
//   baseURL: 'http://localhost:8000/api', // same API base URL
// });

// Request interceptor to add the access token to headers
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to refresh token on 401 status
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error('Token refresh failed', err);
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;