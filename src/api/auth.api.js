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
    return api.delete("/auth/account");
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

  /**
   * Start a purchase. Returns a gateway authorizationUrl (Paystack/PayPal) or a
   * clientSecret (Stripe), plus the reference used to verify later.
   */
  buy({ quantity, gateway }) {
    return api.post("/shares/buy", {
      action: "initiate",
      quantity: Number(quantity),
      gateway,
    });
  },

  /**
   * Confirm a payment with the gateway and credit the shares.
   *
   * The backend exposes this as the `verify` mode of POST /shares/buy — there is
   * no /shares/verify/:gateway route, and calling one 404s, which is why a
   * successful payment used to leave shares uncredited.
   */
  verify({ reference, orderId } = {}) {
    return api.post("/shares/buy", {
      action: "verify",
      reference,
      ...(orderId ? { orderId } : {}),
    });
  },
};

// ====================== WALLET ======================
export const walletAPI = {
  get() {
    return api.get("/wallet");
  },
  // Admin-only manual credit. Regular users get 403; balance is earned through
  // referral commissions on verified purchases, not self-service deposits.
  adminCredit(body) {
    return api.post("/wallet/credit", body);
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
