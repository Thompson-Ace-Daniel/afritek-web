import api from './axios';

export const authApi = {
  signup(payload) {
    return api.post('/signup', payload).then((res) => res.data);
  },

  login(payload) {
    return api.post('/login', payload).then((res) => res.data);
  },

  logout() {
    return api.post('/logout').then((res) => res.data);
  },

  refreshToken(refreshToken) {
    return api.post('/refresh-token', { refreshToken }).then((res) => res.data);
  },

  forgotPassword(email) {
    return api.post('/forgot-password', { email }).then((res) => res.data);
  },

  resetPassword({ oobCode, newPassword }) {
    return api.post('/reset-password', { oobCode, newPassword }).then((res) => res.data);
  },

  sendEmailVerification() {
    return api.post('/send-email-verification').then((res) => res.data);
  },

  verifyEmail(oobCode) {
    return api.post('/verify-email', { oobCode }).then((res) => res.data);
  },

  changePassword({ currentPassword, newPassword }) {
    return api
      .patch('/change-password', { currentPassword, newPassword })
      .then((res) => res.data);
  },

  getMe() {
    return api.get('/me').then((res) => res.data);
  },

  updateProfile(payload) {
    return api.patch('/profile', payload).then((res) => res.data);
  },

  deleteAccount() {
    return api.delete('/account').then((res) => res.data);
  },
};
