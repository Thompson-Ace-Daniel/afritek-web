import api from "./axios";

export const authApi = {
  signup(payload) {
    return api.post("/auth/signup", payload).then((res) => res.data);
  },

  login(payload) {
    return api.post("/auth/login", payload).then((res) => res.data);
  },

  logout() {
    return api.post("/auth/logout").then((res) => res.data);
  },

  refreshToken(refreshToken) {
    return api
      .post("/auth/refresh-token", { refreshToken })
      .then((res) => res.data);
  },

  forgotPassword(email) {
    return api.post("/auth/forgot-password", { email }).then((res) => res.data);
  },

  resetPassword({ oobCode, newPassword }) {
    return api
      .post("/auth/reset-password", { oobCode, newPassword })
      .then((res) => res.data);
  },

  sendEmailVerification() {
    return api.post("/auth/send-email-verification").then((res) => res.data);
  },

  verifyEmail(oobCode) {
    return api.post("/auth/verify-email", { oobCode }).then((res) => res.data);
  },

  changePassword({ currentPassword, newPassword }) {
    return api
      .patch("/auth/change-password", { currentPassword, newPassword })
      .then((res) => res.data);
  },

  getMe() {
    return api.get("/auth/me").then((res) => res.data);
  },

  updateProfile(body) {
    return api.patch("/auth/profile", body).then((res) => res.data);
  },

  deleteAccount() {
    return api.delete("/auth/delete-account").then((res) => res.data);
  },
};

// ====================== REFERRALS ======================
export const referralAPI = {
  resolve(code) {
    return api.get(`/referrals/resolve/${code}`);
  },
  getMyStats() {
    return api.get("/referrals/me");
  },
};

// ====================== SHARES ======================
export const shareAPI = {
  getInfo() {
    return api.get("/shares");
  },
  getMyShares() {
    return api.get("/shares/me");
  },
  buy(body) {
    return api.post("/shares/buy", body);
  },
  verifyPaystack(reference) {
    return api.post("/shares/verify/paystack", { reference });
  },
};

// ====================== WALLET ======================
export const walletAPI = {
  get() {
    return api.get("/wallet");
  },
  deposit(body) {
    return api.post("/wallet/deposit", body);
  },
};

// ====================== WITHDRAWALS ======================
export const withdrawalAPI = {
  request(body) {
    return api.post("/withdrawals", body);
  },
  getMine() {
    return api.get("/withdrawals/me");
  },
  getPending() {
    return api.get("/withdrawals/pending");
  },
  process(id, body) {
    return api.patch(`/withdrawals/${id}/process`, body);
  },
};
