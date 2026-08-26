/**
 * References for purchases that were started but never confirmed.
 *
 * Two jobs:
 *
 * 1. Carry the reference across the gateway round trip. Only Paystack echoes it
 *    back; PayPal returns `token`/`PayerID` and Stripe returns
 *    `payment_intent`/`redirect_status`, and POST /shares/buy will not verify
 *    without a `SHR_…` reference (share.validator.js enforces the format, and
 *    `orderId` alone is rejected).
 *
 * 2. Let a buyer recover a payment they never saw confirmed. The API exposes no
 *    way to list your own payments — GET /shares/me returns only *completed*
 *    purchases — so a reference that is lost here cannot be looked up again
 *    without support reading Firestore directly.
 *
 * localStorage, not sessionStorage: closing the tab is the most common way to
 * lose an in-flight payment, and sessionStorage dies with the tab. A list rather
 * than a single slot, so starting a second order cannot silently drop the first.
 */

const KEY = "afritek_pending_payments";

// Keep a week: long enough that a buyer who pays and comes back tomorrow can
// still self-serve, short enough that the list does not grow indefinitely.
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

// Plenty for real use, and bounds the storage entry.
const MAX_ENTRIES = 10;

export const REFERENCE_PATTERN = /^SHR_[A-Z0-9]{16}$/;

/** Match the casing/trimming the API validates against, so typos 422 for real reasons. */
export const normalizeReference = (value) => String(value ?? "").trim().toUpperCase();

export const isValidReference = (value) => REFERENCE_PATTERN.test(normalizeReference(value));

const readAll = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (!Array.isArray(parsed)) return [];

    const now = Date.now();
    return parsed.filter(
      (entry) =>
        isValidReference(entry?.reference) &&
        entry.savedAt &&
        now - entry.savedAt <= MAX_AGE_MS,
    );
  } catch {
    // Corrupt or unavailable (private mode, storage disabled) — behave as empty.
    return [];
  }
};

const writeAll = (entries) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    // Non-fatal: Paystack still echoes its reference on the redirect, and the
    // manual "Already paid?" box remains as the last resort.
  }
};

/**
 * Remember a purchase we are about to hand off to a gateway.
 *
 * `uid` is stored so a shared browser does not offer one person's pending
 * payment to the next person who logs in. The API also enforces ownership
 * (verifyPurchase returns 403 on a uid mismatch); this just keeps the UI honest.
 */
export const savePendingPayment = ({
  reference,
  gateway,
  quantity,
  amount,
  currency,
  uid,
}) => {
  const normalized = normalizeReference(reference);
  if (!isValidReference(normalized)) return;

  const entry = {
    reference: normalized,
    gateway: gateway || null,
    quantity: quantity ?? null,
    amount: amount ?? null,
    currency: currency || null,
    uid: uid || null,
    savedAt: Date.now(),
  };

  // Newest first, and re-initiating the same reference updates rather than duplicates.
  writeAll([entry, ...readAll().filter((e) => e.reference !== normalized)]);
};

/**
 * Unconfirmed payments, newest first. Pass a uid to see only that user's.
 */
export const readPendingPayments = (uid = null) => {
  const entries = readAll();
  // Entries saved before a uid was known stay visible — dropping them would
  // strand exactly the payment this list exists to recover.
  return uid ? entries.filter((e) => !e.uid || e.uid === uid) : entries;
};

/** The most recent unconfirmed payment, or null. Used by the gateway callback. */
export const readPendingPayment = (uid = null) => readPendingPayments(uid)[0] || null;

/**
 * Forget one reference — it has been verified, or the API says it does not exist.
 * With no argument, forgets the most recent one.
 */
export const clearPendingPayment = (reference = null) => {
  const entries = readAll();

  if (!reference) {
    writeAll(entries.slice(1));
    return;
  }

  const target = normalizeReference(reference);
  writeAll(entries.filter((e) => e.reference !== target));
};

export const clearAllPendingPayments = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Entries expire on their own via MAX_AGE_MS.
  }
};
