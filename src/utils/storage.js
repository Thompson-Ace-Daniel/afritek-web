import { STORAGE_KEYS } from './constants';

const isBrowser = typeof window !== 'undefined';

function getStore(remember) {
  if (!isBrowser) return null;
  if (remember === true) return localStorage;
  if (remember === false) return sessionStorage;

  const rememberFlag = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
  if (rememberFlag === 'true') return localStorage;
  if (rememberFlag === 'false') return sessionStorage;
  return localStorage;
}

export const storage = {
  setRememberMe(value) {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, String(Boolean(value)));
  },

  getRememberMe() {
    if (!isBrowser) return true;
    const flag = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
    if (flag === null) return true;
    return flag === 'true';
  },

  setAccessToken(token, remember) {
    const store = getStore(remember);
    if (!store) return;
    if (token) {
      store.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    } else {
      store.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    }
  },

  getAccessToken() {
    if (!isBrowser) return null;
    return (
      localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ||
      sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    );
  },

  setRefreshToken(token, remember) {
    const store = getStore(remember);
    if (!store) return;
    if (token) {
      store.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    } else {
      store.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
  },

  getRefreshToken() {
    if (!isBrowser) return null;
    return (
      localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) ||
      sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    );
  },

  setUser(user, remember) {
    const store = getStore(remember);
    if (!store) return;
    if (user) {
      store.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      store.removeItem(STORAGE_KEYS.USER);
    }
  },

  getUser() {
    if (!isBrowser) return null;
    const raw =
      localStorage.getItem(STORAGE_KEYS.USER) ||
      sessionStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setSession({ accessToken, refreshToken, user, remember }) {
    const rememberMe = remember ?? this.getRememberMe();
    this.setRememberMe(rememberMe);
    this.clearTokens();
    this.setAccessToken(accessToken, rememberMe);
    this.setRefreshToken(refreshToken, rememberMe);
    if (user) this.setUser(user, rememberMe);
  },

  clearTokens() {
    if (!isBrowser) return;
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER);
  },

  clearAll() {
    this.clearTokens();
    if (isBrowser) {
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    }
  },
};
