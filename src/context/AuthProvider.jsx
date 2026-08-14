import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { authApi } from "../api/auth.api";
import { tokenService } from "../services/token.service";
import { storage } from "../utils/storage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    tokenService.isAuthenticated(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const initRef = useRef(false);

  const persistSession = useCallback(
    ({ accessToken, refreshToken, userData, remember }) => {
      storage.setSession({
        accessToken,
        refreshToken,
        user: userData,
        remember,
      });
      setUser(userData);
      setIsAuthenticated(Boolean(accessToken));
    },
    [],
  );

  const clearSession = useCallback(() => {
    tokenService.clear();
    storage.clearAll();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    const response = await authApi.getMe();
    const userData = response?.data?.user || response?.data || response?.user;
    if (userData) {
      storage.setUser(userData, storage.getRememberMe());
      setUser(userData);
      setIsAuthenticated(true);
    }
    return userData;
  }, []);

  const initialize = useCallback(async () => {
    if (initRef.current) return;
    initRef.current = true;

    setIsLoading(true);
    try {
      const accessToken = tokenService.getAccessToken();
      const refreshToken = tokenService.getRefreshToken();

      if (!accessToken && !refreshToken) {
        clearSession();
        return;
      }

      if (accessToken) {
        try {
          await fetchCurrentUser();
          return;
        } catch {
          // fall through to refresh
        }
      }

      if (refreshToken) {
        try {
          const response = await authApi.refreshToken(refreshToken);
          const payload = response?.data;
          const tokens = payload?.tokens || payload;
          const newAccessToken = tokens?.idToken || tokens?.accessToken;
          const newRefreshToken = tokens?.refreshToken || refreshToken;

          if (!newAccessToken) {
            clearSession();
            return;
          }

          tokenService.setTokens({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });

          await fetchCurrentUser();
        } catch {
          clearSession();
        }
      } else {
        clearSession();
      }
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [clearSession, fetchCurrentUser]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = useCallback(
    async ({ email, password, remember = true }) => {
      const response = await authApi.login({ email, password });
      const payload = response?.data || response;
      const userData = payload?.user;
      const tokens = payload?.tokens || {};
      const accessToken = tokens.idToken || tokens.accessToken;
      const refreshToken = tokens.refreshToken;

      if (!accessToken) {
        throw new Error(
          response?.message || "Login failed. No token received.",
        );
      }

      persistSession({
        accessToken,
        refreshToken,
        userData,
        remember,
      });

      return { user: userData, tokens };
    },
    [persistSession],
  );

  const register = useCallback(async (payload) => {
    const response = await authApi.signup({
      email: payload.email,
      password: payload.password,
      fullName: payload.fullName,
      phone: payload.phone || undefined,
      role: payload.role || "user",
      referralCode: payload.referralCode || null,
    });
    return response;
  }, []);

  const logout = useCallback(async () => {
    try {
      if (tokenService.getAccessToken()) {
        await authApi.logout();
      }
    } catch {
      // Always clear local session even if API fails
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const updateProfile = useCallback(async (data) => {
    const response = await authApi.updateProfile(data);
    const userData = response?.data?.user || response?.data || response?.user;
    if (userData) {
      storage.setUser(userData, storage.getRememberMe());
      setUser(userData);
    }
    return userData;
  }, []);

  const changePassword = useCallback(
    async ({ currentPassword, newPassword }) => {
      const response = await authApi.changePassword({
        currentPassword,
        newPassword,
      });
      clearSession();
      return response;
    },
    [clearSession],
  );

  const forgotPassword = useCallback(async (email) => {
    return authApi.forgotPassword(email);
  }, []);

  const resetPassword = useCallback(async ({ oobCode, newPassword }) => {
    return authApi.resetPassword({ oobCode, newPassword });
  }, []);

  const verifyEmail = useCallback(
    async (oobCode) => {
      const response = await authApi.verifyEmail(oobCode);
      if (tokenService.isAuthenticated()) {
        try {
          await fetchCurrentUser();
        } catch {
          // ignore
        }
      }
      return response;
    },
    [fetchCurrentUser],
  );

  const sendEmailVerification = useCallback(async () => {
    return authApi.sendEmailVerification();
  }, []);

  const deleteAccount = useCallback(async () => {
    const response = await authApi.deleteAccount();
    clearSession();
    return response;
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      isInitialized,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      forgotPassword,
      resetPassword,
      verifyEmail,
      sendEmailVerification,
      deleteAccount,
      refreshUser: fetchCurrentUser,
      fetchCurrentUser,
      clearSession,
      setUser,
      isAdmin: user?.role === "admin",
      isModerator: user?.role === "moderator" || user?.role === "admin",
    }),
    [
      user,
      isAuthenticated,
      isLoading,
      isInitialized,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      forgotPassword,
      resetPassword,
      verifyEmail,
      sendEmailVerification,
      deleteAccount,
      fetchCurrentUser,
      clearSession,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
