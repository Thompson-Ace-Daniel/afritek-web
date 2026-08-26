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

/**
 * Normalise a rejection into a real Error that keeps BOTH shapes readable:
 * `err.message` for new code, and `err.response.data.message` for the many
 * components that read the raw axios shape.
 *
 * This interceptor used to reject a bare object literal, so every
 * `err.response?.data?.message` in the app evaluated to undefined and users only
 * ever saw the generic fallback toast ("Purchase failed", "Verification
 * failed") instead of the real reason the request was rejected.
 */
const normalizeError = ({ message, status, errors, data, isNetworkError }) => {
  const error = new Error(message);
  error.status = status ?? null;
  error.errors = errors || [];
  error.isNetworkError = Boolean(isNetworkError);
  error.data = data ?? null;
  error.response = status ? { status, data: data ?? { message, errors } } : undefined;
  return error;
};

// The auth routes live under /auth on the API; API_BASE_URL points at the
// version root (…/api/v1). Build the refresh URL from both, tolerating a
// trailing slash on the configured base.
const REFRESH_URL = `${API_BASE_URL.replace(/\/+$/, "")}/auth/refresh-token`;

/**
 * Bounce to login, preserving where the user was.
 *
 * The query string matters as much as the path: a session that expires while the
 * buyer is at a payment gateway returns to /payment/callback?reference=SHR_…, and
 * dropping the search here threw that reference away, leaving a paid purchase
 * with no way to be verified.
 */
const redirectToLogin = () => {
  if (typeof window === 'undefined') return;
  if (window.location.pathname.includes('/login')) return;

  const returnTo = `${window.location.pathname}${window.location.search}`.replace(/^\//, '');
  window.location.href = `/login?redirect=${encodeURIComponent(returnTo)}`;
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
      return Promise.reject(
        normalizeError({
          message: 'Network error. Please check your connection.',
          isNetworkError: true,
        })
      );
    }

    const { status, data } = error.response;
    const message = data?.message || 'An unexpected error occurred.';

    if (status === HTTP_STATUS.UNAUTHORIZED && originalRequest && !originalRequest._retry) {
      if (originalRequest.url?.includes('/login') || originalRequest.url?.includes('/refresh-token')) {
        return Promise.reject(normalizeError({ message, status, errors: data?.errors, data }));
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
        redirectToLogin();
        return Promise.reject(
          normalizeError({
            message: 'Session expired. Please log in again.',
            status: HTTP_STATUS.UNAUTHORIZED,
          })
        );
      }

      try {
        const response = await axios.post(
          REFRESH_URL,
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
        redirectToLogin();
        return Promise.reject(
          normalizeError({
            message: 'Session expired. Please log in again.',
            status: HTTP_STATUS.UNAUTHORIZED,
          })
        );
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(normalizeError({ message, status, errors: data?.errors, data }));
  }
);

export default api;
