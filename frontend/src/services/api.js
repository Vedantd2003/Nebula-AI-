import axios from 'axios';
import { useAuthStore } from '../store';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Token Expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const currentRefreshToken = useAuthStore.getState().refreshToken;
        
        // Call refresh endpoint
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken: currentRefreshToken,
        });

        // FIXED: Extract both tokens because of Refresh Token Rotation
        const { accessToken, refreshToken } = response.data.data;

        // Update the global store with the new pair of tokens
        useAuthStore.getState().setAuth({ 
            user: useAuthStore.getState().user, // Keep existing user
            accessToken, 
            refreshToken 
        });

        // Retry the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // If refresh fails, clear store and kick to login
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
};

// AI API
export const aiAPI = {
  generateText: (data) => api.post('/ai/generate-text', data),
  analyzeDocument: (data) => api.post('/ai/analyze-document', data),
  summarize: (data) => api.post('/ai/summarize', data),
  generateContent: (data) => api.post('/ai/generate-content', data),
  getHistory: (params) => api.get('/ai/history', { params }), // Matches History.jsx
  getGeneration: (id) => api.get(`/ai/history/${id}`),
  deleteGeneration: (id) => api.delete(`/ai/history/${id}`), // Fixed for your Delete button
};

// Usage API
export const usageAPI = {
  getCredits: () => api.get('/usage/credits'),
  getStats: () => api.get('/usage/stats'),
  getHistory: (params) => api.get('/usage/history', { params }),
};

// Subscription API
export const subscriptionAPI = {
  getPlans: () => api.get('/subscriptions/plans'),
  subscribe: (data) => api.post('/subscriptions/subscribe', data),
};

export default api;