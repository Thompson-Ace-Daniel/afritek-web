export const APP_NAME = import.meta.env.VITE_APP_NAME || "Afritek";

// The API version root. Every call site adds its own resource prefix
// (`/auth/login`, `/shares/buy`, `/wallet`), so this must NOT end in `/auth` —
// that fallback produced `/api/v1/auth/auth/login` and 404'd every request
// whenever VITE_API_BASE_URL was unset. Matches .env.example.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://afritek-api.vercel.app/api/v1";

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
  // Where the payment gateways send the buyer back to. The backend builds its
  // callback_url/return_url from FRONTEND_URL + this path, so the two must match
  // or a paid buyer lands on the 404 page and the purchase is never verified.
  PAYMENT_CALLBACK: "/payment/callback",
  PAYMENT_CANCEL: "/payment/cancel",
};

/**
 * Withdrawal limits, for form hints only.
 *
 * The server is the authority — `WITHDRAWAL.MIN_USD` in the API's constants
 * enforces this floor and re-checks every request. Mirroring it here just spares
 * the user a round trip to be told the amount was too small.
 *
 * The unit is USD, matching the wallet balance withdrawals are paid from. Keep
 * this in step with the API's `MIN_WITHDRAWAL_USD`; it must never be read from
 * the old Naira-scale `MIN_WITHDRAWAL`, which would turn a ₦1,000 floor into an
 * unreachable $1,000 one.
 */
export const WITHDRAWAL = {
  MIN_USD: Number(import.meta.env.VITE_MIN_WITHDRAWAL_USD) || 10,
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
