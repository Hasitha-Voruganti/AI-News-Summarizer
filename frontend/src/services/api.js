import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// News API calls
export const newsAPI = {
  getHeadlines: (params) => api.get('/news/headlines', { params }),
  search: (params) => api.get('/news/search', { params }),
  getCategories: () => api.get('/news/categories'),
};

// Auth API calls
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data),
};

// User API calls
export const userAPI = {
  getBookmarks: () => api.get('/user/bookmarks'),
  addBookmark: (data) => api.post('/user/bookmarks', data),
  removeBookmark: (articleId) => api.delete(`/user/bookmarks/${articleId}`),
  getHistory: () => api.get('/user/history'),
  addToHistory: (data) => api.post('/user/history', data),
  clearHistory: () => api.delete('/user/history'),
  getStats: () => api.get('/user/stats'),
};

// AI API calls
export const aiAPI = {
  summarize: (data) => api.post('/ai/summarize', data),
};
