import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (userData) => {
    const response = await api.post('/auth/login', userData);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  getApps: () => api.get('/user/apps'),
  updateApps: (trackedApps) => api.put('/user/apps', { tracked_apps: trackedApps }),
  getAppTime: (days = 7) => api.get(`/user/apptime?days=${days}`),
  updateAppTime: (data) => api.post('/user/apptime', data),
};

export const leaderboardAPI = {
  getLeaderboard: () => api.get('/leaderboard'),
};

export const investmentsAPI = {
  getPortfolio: () => api.get('/investments/portfolio'),
  setupInvestments: (riskLevel) => api.post('/investments/setup', { risk_level: riskLevel }),
  getHistory: (days = 30) => api.get(`/investments/history?days=${days}`),
};

export default api;

