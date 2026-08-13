import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("idToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: auto refresh on 401 (basic)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });
          const { idToken, refreshToken: newRefresh } = data.data.tokens;
          localStorage.setItem("idToken", idToken);
          localStorage.setItem("refreshToken", newRefresh);
          original.headers.Authorization = `Bearer ${idToken}`;
          return api(original);
        } catch (e) {
          localStorage.removeItem("idToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;

// ====================== AUTH ======================
export const authAPI = {
  signup: (body) => api.post("/auth/signup", body),
  login: (body) => api.post("/auth/login", body),
  logout: () => api.post("/auth/logout"),
  refreshToken: (refreshToken) =>
    api.post("/auth/refresh-token", { refreshToken }),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (body) => api.post("/auth/reset-password", body),
  sendEmailVerification: () => api.post("/auth/send-email-verification"),
  verifyEmail: (oobCode) => api.post("/auth/verify-email", { oobCode }),
  changePassword: (body) => api.patch("/auth/change-password", body),
  getMe: () => api.get("/auth/me"),
  updateProfile: (body) => api.patch("/auth/profile", body),
  deleteAccount: () => api.delete("/auth/account"),
  deleteAccountAdmin: (uid) => api.delete(`/auth/account/${uid}`),
};

// ====================== REFERRALS ======================
export const referralAPI = {
  resolve: (code) => api.get(`/referrals/resolve/${code}`),
  getMyStats: () => api.get("/referrals/me"),
};

// ====================== SHARES ======================
export const shareAPI = {
  getInfo: () => api.get("/shares"),
  getMyShares: () => api.get("/shares/me"),
  buy: (body) => api.post("/shares/buy", body),
  verifyPaystack: (reference) =>
    api.post("/shares/verify/paystack", { reference }),
};

// ====================== WALLET ======================
export const walletAPI = {
  get: () => api.get("/wallet"),
  deposit: (body) => api.post("/wallet/deposit", body),
};

// ====================== WITHDRAWALS ======================
export const withdrawalAPI = {
  request: (body) => api.post("/withdrawals", body),
  getMine: () => api.get("/withdrawals/me"),
  getPending: () => api.get("/withdrawals/pending"),
  process: (id, body) => api.patch(`/withdrawals/${id}/process`, body),
};
