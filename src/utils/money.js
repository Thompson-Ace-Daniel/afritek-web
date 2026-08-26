/**
 * Money formatting.
 *
 * There is exactly one of these because there used to be none: every tab
 * hardcoded a `₦` prefix. When the backend repriced shares to a USD base, all of
 * those kept rendering `₦20` for a $20 share — the display contradicted the
 * amount the buyer was about to be charged.
 *
 * So nothing here assumes a currency. Callers pass the code the API gave them,
 * and the fallback is the ledger currency rather than a symbol someone typed.
 */

/**
 * The currency the API denominates the ledger in — purchases, wallet balances,
 * referral commissions and withdrawals. Used only when a response omits an
 * explicit `currency`, which should be rare.
 */
export const LEDGER_CURRENCY = "USD";

const SYMBOLS = {
  USD: "$",
  NGN: "₦",
  GBP: "£",
  EUR: "€",
};

export const currencySymbol = (currency) =>
  SYMBOLS[String(currency || LEDGER_CURRENCY).toUpperCase()] || null;

/**
 * Format an amount for display.
 *
 * @param {number|string|null|undefined} amount
 * @param {string} [currency]  ISO code from the API; defaults to the ledger currency
 * @param {object} [options]
 * @param {string} [options.fallback="—"]  shown when the amount is absent
 * @param {boolean} [options.cents]  force 2 decimal places (totals, fees)
 * @returns {string}
 */
export const formatMoney = (amount, currency, options = {}) => {
  const { fallback = "—", cents = false } = options;

  if (amount === null || amount === undefined || amount === "") return fallback;

  const value = Number(amount);
  if (!Number.isFinite(value)) return fallback;

  const code = String(currency || LEDGER_CURRENCY).toUpperCase();

  // Sub-unit precision matters for USD (a $0.60 commission must not render as
  // "$1"), but Naira charges are whole-Naira figures and read better without a
  // trailing ".00".
  const fractionDigits =
    cents || (code !== "NGN" && !Number.isInteger(value)) ? 2 : 0;

  const formatted = value.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

  const symbol = currencySymbol(code);

  // An unknown code is prefixed with the code itself rather than guessed at —
  // "CAD 40" is honest, "$40" would not be.
  return symbol ? `${symbol}${formatted}` : `${code} ${formatted}`;
};

/**
 * The one-line explanation a Naira payer needs before committing: what they will
 * actually be debited, and the rate behind it.
 *
 * Returns null when there is nothing worth saying — i.e. the buyer is being
 * charged in the same currency the order is priced in.
 */
export const describeCharge = ({ amountUsd, chargeAmount, chargeCurrency, fxRate } = {}) => {
  const code = String(chargeCurrency || "").toUpperCase();

  if (!code || code === LEDGER_CURRENCY) return null;
  if (chargeAmount === null || chargeAmount === undefined) return null;

  const parts = [
    `You will be charged ${formatMoney(chargeAmount, code)}`,
    amountUsd !== undefined && amountUsd !== null
      ? `for ${formatMoney(amountUsd, LEDGER_CURRENCY)}`
      : null,
  ].filter(Boolean);

  const sentence = parts.join(" ");

  return fxRate ? `${sentence} at ${formatMoney(fxRate, code)}/$1.` : `${sentence}.`;
};
