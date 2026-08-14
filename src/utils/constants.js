export const APP_NAME = import.meta.env.VITE_APP_NAME || "Afritek";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://afritek-api.vercel.app/api/v1/auth";

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "afritek_access_token",
  REFRESH_TOKEN: "afritek_refresh_token",
  USER: "afritek_user",
  REMEMBER_ME: "afritek_remember_me",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",
  DASHBOARD: "/dashboard",
  CHANGE_PASSWORD: "/change-password",
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
};
