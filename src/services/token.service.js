import { storage } from '../utils/storage';

export const tokenService = {
  getAccessToken() {
    return storage.getAccessToken();
  },

  getRefreshToken() {
    return storage.getRefreshToken();
  },

  setTokens({ accessToken, refreshToken, remember }) {
    const rememberMe = remember ?? storage.getRememberMe();
    storage.setAccessToken(accessToken, rememberMe);
    if (refreshToken) {
      storage.setRefreshToken(refreshToken, rememberMe);
    }
  },

  clear() {
    storage.clearTokens();
  },

  hasTokens() {
    return Boolean(this.getAccessToken() || this.getRefreshToken());
  },

  isAuthenticated() {
    return Boolean(this.getAccessToken());
  },
};
