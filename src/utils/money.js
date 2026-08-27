/**
 * Money formatting.
 *
 * There is exactly one of these because there used to be none: every tab
 * hardcoded a `₦` prefix. When the backend repriced shares to a USD base, all of
 * those kept rendering `₦20` for a $20 share — the display contradicted the
 * amount the buyer was about to be charged.
 *
 * Two formatters, because there are two kinds of money on screen and only one of
 * them can vary:
 *
 * - `formatUsd` — the **ledger**. Share price, order totals, wallet balance,
 *   referral earnings, withdrawal amounts. Always USD, never taken from the
 *   response body. See the note on `formatMoney`'s `currency` argument for why.
 * - `formatMoney` — the **charge leg** only. Paystack cannot bill USD, so it
 *   collects an NGN equivalent that the server pins onto the payment
 *   (`chargeAmount`/`chargeCurrency`/`fxRate`). That figure genuinely is Naira
 *   and must render as such.
 */

/**
 * The currency the API denominates the ledger in — purchases, wallet balances,
 * referral commissions and withdrawals.
 *
 * This is a structural fact about the backend, not a preference: share price is
 * resolved from `SHARE_PRICE_USD`, `WITHDRAWAL.CURRENCY` is the literal 'USD',
 * and payment docs are written with `currency: 'USD'`. So ledger figures are
 * always USD, and `formatUsd` below is what renders them.
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
 * **Reserved for the charge leg.** Pass a `currency` only when the figure really
 * is denominated in that currency — i.e. `chargeAmount` + `chargeCurrency` off a
 * payment doc. Do not pass a ledger response's `currency` field: those responses
 * stamp their code from the API's `CURRENCY` env var, which is deployment
 * configuration rather than a property of the amount, and a stale `CURRENCY=NGN`
 * there made a $20 share render as `₦20`. Ledger figures go through `formatUsd`.
 *
 * @param {number|string|null|undefined} amount
 * @param {string} [currency]  ISO code the amount is actually denominated in
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
 * Format a ledger amount — share prices, order totals, wallet balances, referral
 * earnings, withdrawal amounts and fees.
 *
 * Hardwired to USD on purpose. Every one of those figures is USD server-side, so
 * there is nothing to negotiate with the response body, and taking the code from
 * the response is what caused the symbol to flip: the first paint had no data and
 * fell back to USD (`$20`), then the fetch resolved with `currency: "NGN"` and
 * the same figure re-rendered as `₦20` — the amount unchanged, the meaning off by
 * three orders of magnitude.
 *
 * @param {number|string|null|undefined} amount
 * @param {object} [options]  same options as formatMoney
 * @returns {string}
 */
export const formatUsd = (amount, options = {}) =>
  formatMoney(amount, LEDGER_CURRENCY, options);

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
      ? `for ${formatUsd(amountUsd)}`
      : null,
  ].filter(Boolean);

  const sentence = parts.join(" ");

  return fxRate ? `${sentence} at ${formatMoney(fxRate, code)}/$1.` : `${sentence}.`;
};
