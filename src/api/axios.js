import axios from 'axios';
import { API_BASE_URL, HTTP_STATUS } from '../utils/constants';
import { tokenService } from '../services/token.service';
import { storage } from '../utils/storage';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = tokenService.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        isNetworkError: true,
      });
    }

    const { status, data } = error.response;
    const message = data?.message || 'An unexpected error occurred.';

    if (status === HTTP_STATUS.UNAUTHORIZED && originalRequest && !originalRequest._retry) {
      if (originalRequest.url?.includes('/login') || originalRequest.url?.includes('/refresh-token')) {
        return Promise.reject({
          message,
          status,
          errors: data?.errors,
          data,
        });
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenService.getRefreshToken();

      if (!refreshToken) {
        isRefreshing = false;
        tokenService.clear();
        storage.clearAll();
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname.replace(/^\//, ''))}`;
        }
        return Promise.reject({
          message: 'Session expired. Please log in again.',
          status: HTTP_STATUS.UNAUTHORIZED,
        });
      }

      try {
        const response = await axios.post(
          `${API_BASE_URL}/refresh-token`,
          { refreshToken },
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 15000,
          }
        );

        const payload = response.data?.data;
        const tokens = payload?.tokens || payload;
        const newAccessToken = tokens?.idToken || tokens?.accessToken;
        const newRefreshToken = tokens?.refreshToken;

        if (!newAccessToken) {
          throw new Error('Invalid refresh response');
        }

        tokenService.setTokens({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken || refreshToken,
        });

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenService.clear();
        storage.clearAll();
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname.replace(/^\//, ''))}`;
        }
        return Promise.reject({
          message: 'Session expired. Please log in again.',
          status: HTTP_STATUS.UNAUTHORIZED,
        });
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject({
      message,
      status,
      errors: data?.errors,
      data,
    });
  }
);

export default api;
