import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authAPI } from "../api/auth.api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState({
    idToken: localStorage.getItem("idToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  });

  const saveTokens = useCallback((t) => {
    if (t?.idToken) localStorage.setItem("idToken", t.idToken);
    if (t?.refreshToken) localStorage.setItem("refreshToken", t.refreshToken);
    setTokens({
      idToken: t?.idToken || null,
      refreshToken: t?.refreshToken || null,
    });
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem("idToken");
    localStorage.removeItem("refreshToken");
    setTokens({ idToken: null, refreshToken: null });
    setUser(null);
  }, []);

  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem("idToken");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await authAPI.getMe();
      setUser(data.data.user);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, [clearAuth]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    saveTokens(data.data.tokens);
    setUser(data.data.user);
    return data;
  };

  const signup = async (payload) => {
    const { data } = await authAPI.signup(payload);
    saveTokens(data.data.tokens);
    setUser(data.data.user);
    return data;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      // ignore
    }
    clearAuth();
  };

  const value = {
    user,
    tokens,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isModerator: user?.role === "moderator" || user?.role === "admin",
    login,
    signup,
    logout,
    saveTokens,
    clearAuth,
    refreshUser: fetchMe,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
