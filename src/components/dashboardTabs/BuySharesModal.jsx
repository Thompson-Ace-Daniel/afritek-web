// ==================== BUY SHARES MODAL ====================

import React, { useState, useEffect } from "react";
import {
  Shield,
  Plus,
  Clock,
  X,
  Minus,
  Zap,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { shareAPI } from "../../api/auth.api.js";
import { toast } from "react-hot-toast";
import { StripeCheckout } from "../payment/StripeCheckout.jsx";
import { useAuth } from "../../hooks/useAuth";
import {
  normalizeReference,
  savePendingPayment,
  clearPendingPayment,
  readPendingPayments,
} from "../../utils/pendingPayment";
import { formatUsd, describeCharge } from "../../utils/money";

/** "3 hours ago" — enough to tell a stale attempt from the one just made. */
const timeAgo = (savedAt) => {
  const minutes = Math.floor((Date.now() - savedAt) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export const BuySharesModal = ({ isOpen, onClose, darkMode, onSuccess }) => {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [paymentGateway, setPaymentGateway] = useState("paystack");
  const [referenceCode, setReferenceCode] = useState("");
  const [shareInfo, setShareInfo] = useState(null);
  const [pending, setPending] = useState([]);

  // Loading & process states
  const [fetchingInfo, setFetchingInfo] = useState(false);
  const [buying, setBuying] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  // Fetch share market info when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchMarketInfo = async () => {
        setFetchingInfo(true);
        try {
          const { data } = await shareAPI.getInfo();
          setShareInfo(data.data);
        } catch (err) {
          toast.error(
            err.response?.data?.message || "Failed to fetch market info",
          );
        } finally {
          setFetchingInfo(false);
        }
      };
      fetchMarketInfo();
    }
  }, [isOpen]);

  // Re-read on open so a payment abandoned earlier (or in another tab) shows up
  // as something the buyer can act on.
  useEffect(() => {
    if (isOpen) setPending(readPendingPayments(user?.uid));
  }, [isOpen, user?.uid]);

  // A PaymentIntent/checkout is priced for the exact order that created it, so a
  // changed quantity or gateway must invalidate it — otherwise the buyer could
  // pay the old amount on a form that now shows a different total.
  useEffect(() => {
    setPaymentData(null);
  }, [quantity, paymentGateway]);

  if (!isOpen) return null;

  // No fabricated fallback price: showing $1,250 while the API reports $20 makes
  // the gateway's amount look wrong to the buyer. Show nothing until the real
  // price has loaded.
  const sharePrice = shareInfo?.pricePerShare ?? null;
  const remainingShares = shareInfo?.remainingShares ?? null;
  const subtotal = sharePrice === null ? null : quantity * sharePrice;

  // The backend charges quantity × pricePerShare exactly (payment.service.js
  // resolves the price through shareService.getPriceUsd()). A 1% "platform fee"
  // was being added to the displayed total only, so the amount on the gateway
  // never matched what the buyer was quoted here.
  const total = subtotal;

  const exceedsSupply = remainingShares !== null && quantity > remainingShares;
  const canBuy = !buying && sharePrice !== null && quantity >= 1 && !exceedsSupply;

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  // Shares are priced in USD (`SHARE_PRICE_USD` server-side), so the quote is
  // rendered as USD rather than from GET /shares' `currency` — that field echoes
  // the API's CURRENCY env var and mislabelled the quote as Naira. Paystack then
  // bills the Naira equivalent, which is what the charge notice below explains.
  const money = (value) => formatUsd(value);

  // Initiate purchase request via API
  const handleBuy = async () => {
    setBuying(true);
    setPaymentData(null);
    try {
      const { data } = await shareAPI.buy({
        quantity: Number(quantity),
        gateway: paymentGateway,
      });

      const payment = data.data;
      setPaymentData(payment);

      if (payment?.reference) {
        setReferenceCode(payment.reference);

        // Stash before handing off. PayPal returns token/PayerID and Stripe
        // returns payment_intent/redirect_status — neither echoes the reference
        // that POST /shares/buy requires to verify.
        savePendingPayment({
          reference: payment.reference,
          gateway: paymentGateway,
          quantity: payment.quantity ?? Number(quantity),
          amount: payment.amount,
          currency: payment.currency,
          uid: user?.uid,
        });
        setPending(readPendingPayments(user?.uid));
      }

      // Same tab, not window.open: this runs after an await so it is no longer
      // inside the click gesture and popup blockers eat the new window. It also
      // means the gateway's callback_url lands back on our /payment/callback
      // route, which auto-verifies and credits the shares.
      if (payment?.authorizationUrl) {
        toast.success("Redirecting you to complete payment…");
        window.location.assign(payment.authorizationUrl);
        return;
      }

      // Stripe hands back a PaymentIntent to confirm in-page rather than a
      // redirect, so the card form below takes over from here.
      if (payment?.clientSecret) {
        toast.success("Enter your card details to finish paying.");
        return;
      }

      toast.success(data.message || "Purchase initiated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Purchase failed");
    } finally {
      setBuying(false);
    }
  };

  /**
   * Confirm a completed payment and credit the shares.
   *
   * Shared by the inline Stripe confirmation and the manual "Already paid?" box.
   * Fulfilment is entirely server-side — the API re-checks the reference with the
   * gateway before crediting anything.
   */
  const verifyReference = async (rawReference) => {
    const reference = normalizeReference(rawReference);

    if (!reference) {
      toast.error("Please enter a reference code");
      return;
    }

    setVerifying(true);
    try {
      const { data } = await shareAPI.verify({ reference });
      const credited = data?.data?.shares?.sharesOwned;

      toast.success(
        credited !== undefined
          ? `${data.message || "Payment verified"} — you now own ${Number(credited).toLocaleString()} shares.`
          : data.message || "Payment verified successfully!",
      );

      clearPendingPayment(reference);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      // A 404 means no payment carries this reference, so keeping it in the
      // recovery list would only invite the buyer to retry something that can
      // never succeed. Any other failure may well be transient — keep it.
      if (err.status === 404) {
        clearPendingPayment(reference);
      }
      setPending(readPendingPayments(user?.uid));

      toast.error(err.response?.data?.message || err.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const handleVerifyPayment = () => verifyReference(referenceCode);

  const dismissPending = (reference) => {
    clearPendingPayment(reference);
    setPending(readPendingPayments(user?.uid));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-2xl ${
          darkMode
            ? "bg-zinc-950 border border-zinc-800"
            : "bg-white border border-gray-200"
        } shadow-2xl p-4 sm:p-6`}
      >
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-xl ${
            darkMode ? "hover:bg-zinc-800" : "hover:bg-gray-100"
          } transition-colors`}
        >
          <X
            className={`w-5 h-5 ${darkMode ? "text-zinc-400" : "text-gray-500"}`}
          />
        </button>

        <div className="mb-4 sm:mb-6">
          <h1
            className={`text-xl sm:text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Add Shares – AfriTek
          </h1>
          <p
            className={`text-sm ${darkMode ? "text-zinc-400" : "text-gray-500"}`}
          >
            Invest in quality companies and grow your portfolio.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column: Purchase Controls */}
          <div
            className={`${
              darkMode
                ? "bg-zinc-900/50 border-zinc-800"
                : "bg-gray-50 border-gray-200"
            } border rounded-2xl p-4 sm:p-6`}
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div>
                <img
                  src="/afritek-logo-transparent.png"
                  alt="AfriTek Logo"
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-contain"
                />
              </div>
              <div>
                <h3
                  className={`font-bold text-base sm:text-lg ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  AfriTek
                </h3>
                <p
                  className={`text-sm ${
                    darkMode ? "text-zinc-400" : "text-gray-500"
                  }`}
                >
                  {fetchingInfo || sharePrice === null
                    ? "Loading…"
                    : money(sharePrice)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-zinc-800/30 rounded-xl">
              <div>
                <p
                  className={`text-[10px] sm:text-xs ${
                    darkMode ? "text-zinc-400" : "text-gray-500"
                  }`}
                >
                  Remaining Shares
                </p>
                <p
                  className={`text-sm sm:text-base font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {fetchingInfo
                    ? "Loading..."
                    : (shareInfo?.remainingShares ?? 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p
                  className={`text-[10px] sm:text-xs ${
                    darkMode ? "text-zinc-400" : "text-gray-500"
                  }`}
                >
                  Sold Shares
                </p>
                <p
                  className={`text-sm sm:text-base font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {fetchingInfo
                    ? "Loading..."
                    : (shareInfo?.soldShares ?? 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-4 sm:mb-6">
              <label
                className={`text-sm font-medium ${
                  darkMode ? "text-zinc-300" : "text-gray-700"
                } block mb-2`}
              >
                Quantity
              </label>
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  className={`p-2 rounded-xl ${
                    darkMode
                      ? "bg-zinc-800 hover:bg-zinc-700"
                      : "bg-gray-200 hover:bg-gray-300"
                  } transition-colors`}
                >
                  <Minus
                    className={`w-5 h-5 ${
                      darkMode ? "text-white" : "text-gray-700"
                    }`}
                  />
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className={`text-xl sm:text-2xl font-bold ${
                    darkMode ? "text-white bg-transparent" : "text-gray-900"
                  } w-16 sm:w-20 text-center outline-none border-b border-zinc-700 focus:border-amber-400`}
                />
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  className={`p-2 rounded-xl ${
                    darkMode
                      ? "bg-zinc-800 hover:bg-zinc-700"
                      : "bg-gray-200 hover:bg-gray-300"
                  } transition-colors`}
                >
                  <Plus
                    className={`w-5 h-5 ${
                      darkMode ? "text-white" : "text-gray-700"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Payment Gateway */}
            <div className="mb-4 sm:mb-6">
              <label
                className={`text-sm font-medium ${
                  darkMode ? "text-zinc-300" : "text-gray-700"
                } block mb-2`}
              >
                Payment Gateway
              </label>
              <select
                value={paymentGateway}
                onChange={(e) => setPaymentGateway(e.target.value)}
                className={`w-full ${
                  darkMode
                    ? "bg-zinc-800 border-zinc-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } border rounded-xl px-4 py-3 outline-none focus:border-amber-400 transition-colors text-sm sm:text-base`}
              >
                <option value="paystack">Paystack</option>
                <option value="stripe">Stripe (card, USD)</option>
                <option value="paypal">PayPal (USD)</option>
              </select>
            </div>

            {exceedsSupply && (
              <p className="mb-3 text-xs text-red-400">
                Only {remainingShares.toLocaleString()} shares remain — reduce the quantity
                to continue.
              </p>
            )}

            <div className="flex items-center justify-between py-3 sm:py-4 border-t border-zinc-800">
              <span
                className={`text-base sm:text-lg font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Total
              </span>
              <span
                className={`text-xl sm:text-2xl font-bold ${
                  darkMode ? "text-amber-400" : "text-amber-600"
                }`}
              >
                {money(total)}
              </span>
            </div>

            <button
              onClick={handleBuy}
              disabled={!canBuy}
              className="w-full py-2.5 sm:py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
            >
              {buying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Initiating...
                </>
              ) : (
                "Continue to Payment →"
              )}
            </button>

            <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-2 text-[10px] sm:text-xs text-zinc-500">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span>Bank-level security & encryption</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs text-zinc-500">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span>Instant order execution on verify</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs text-zinc-500">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span>24/7 dedicated institutional support</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Payment Verification */}
          <div
            className={`${
              darkMode
                ? "bg-zinc-900/50 border-zinc-800"
                : "bg-gray-50 border-gray-200"
            } border rounded-2xl p-4 sm:p-6`}
          >
            <h3
              className={`text-base sm:text-lg font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              } mb-3 sm:mb-4`}
            >
              Purchase Summary
            </h3>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span
                  className={`text-sm ${darkMode ? "text-zinc-400" : "text-gray-500"}`}
                >
                  Share Name
                </span>
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  AfriTek
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span
                  className={`text-sm ${darkMode ? "text-zinc-400" : "text-gray-500"}`}
                >
                  Current Price
                </span>
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {money(sharePrice)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span
                  className={`text-sm ${darkMode ? "text-zinc-400" : "text-gray-500"}`}
                >
                  Quantity
                </span>
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {quantity}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span
                  className={`text-sm ${darkMode ? "text-zinc-400" : "text-gray-500"}`}
                >
                  Subtotal
                </span>
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {money(subtotal)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span
                  className={`text-sm ${darkMode ? "text-zinc-400" : "text-gray-500"}`}
                >
                  Fees
                </span>
                <span className="text-sm font-medium text-green-500">None</span>
              </div>
              <div className="flex justify-between py-2">
                <span
                  className={`text-base sm:text-lg font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Amount Due
                </span>
                <span
                  className={`text-lg sm:text-xl font-bold ${
                    darkMode ? "text-amber-400" : "text-amber-600"
                  }`}
                >
                  {money(total)}
                </span>
              </div>

              {/* Paystack cannot bill USD, so it collects the Naira equivalent at
                  a rate the server resolves when the payment is initiated. The
                  exact figure is therefore not knowable until then — this says so
                  rather than showing a converted number the gateway may not match.
                  Gated on the gateway alone: the order is always USD-priced, so
                  whenever Paystack is the selected gateway there is a conversion
                  worth warning about. */}
              {paymentGateway === "paystack" && (
                <p
                  className={`pt-2 text-[10px] sm:text-xs ${
                    darkMode ? "text-zinc-500" : "text-gray-500"
                  }`}
                >
                  Paystack settles in Naira. The exact Naira amount and the rate
                  used are shown before you confirm payment.
                </p>
              )}
            </div>

            {/* Payment Link Banner */}
            {paymentData && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-[10px] sm:text-xs text-amber-400 font-semibold mb-1">
                  Payment Initiated
                </p>
                <p className="text-[10px] sm:text-xs text-zinc-400 mb-2">
                  Reference:{" "}
                  <code className="text-white">{paymentData.reference}</code>
                </p>
                {/* The pinned quote: what will actually be debited, and at what
                    rate. Null for the USD gateways, where there is nothing to
                    explain. */}
                {describeCharge(paymentData) && (
                  <p className="text-[10px] sm:text-xs text-zinc-300 mb-2 font-medium">
                    {describeCharge(paymentData)}
                  </p>
                )}
                {paymentData.authorizationUrl && (
                  <a
                    href={paymentData.authorizationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-amber-400 hover:underline"
                  >
                    Complete Payment on Gateway{" "}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

            {/* Stripe collects the card in-page — there is no redirect to follow. */}
            {paymentData?.clientSecret && (
              <div className="mt-4 sm:mt-6">
                <h4
                  className={`text-sm font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  } mb-3`}
                >
                  Pay by card
                </h4>
                <StripeCheckout
                  clientSecret={paymentData.clientSecret}
                  publicKey={paymentData.publicKey}
                  darkMode={darkMode}
                  amountLabel={money(paymentData.amount ?? total)}
                  onConfirmed={() => verifyReference(paymentData.reference)}
                />
              </div>
            )}

            {/* Verification Section */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-zinc-800">
              {/* Recover a payment the buyer never saw confirmed — a closed tab,
                  an interrupted redirect, a phone that went to sleep. The API has
                  no "list my payments" endpoint, so this local record is the only
                  way to hand the reference back to them. */}
              {pending.length > 0 && (
                <div className="mb-4 sm:mb-5">
                  <h4
                    className={`text-sm font-semibold ${
                      darkMode ? "text-white" : "text-gray-900"
                    } mb-1`}
                  >
                    Unconfirmed payments
                  </h4>
                  <p
                    className={`text-[10px] sm:text-xs ${
                      darkMode ? "text-zinc-400" : "text-gray-500"
                    } mb-2`}
                  >
                    Orders you started but we never saw confirmed. If you paid, verify
                    here to get your shares — you will not be charged again.
                  </p>

                  <div className="space-y-2">
                    {pending.map((entry) => (
                      <div
                        key={entry.reference}
                        className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border ${
                          darkMode
                            ? "bg-zinc-800/50 border-zinc-700"
                            : "bg-amber-50 border-amber-200"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <code
                            className={`block text-[10px] sm:text-xs truncate ${
                              darkMode ? "text-amber-300" : "text-amber-700"
                            }`}
                          >
                            {entry.reference}
                          </code>
                          <p className="text-[10px] text-zinc-500 truncate">
                            {[
                              entry.gateway,
                              entry.quantity ? `${entry.quantity} shares` : null,
                              entry.amount !== null ? money(entry.amount) : null,
                              timeAgo(entry.savedAt),
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>

                        <button
                          onClick={() => verifyReference(entry.reference)}
                          disabled={verifying}
                          className="px-3 py-1.5 bg-amber-500 text-white text-[10px] sm:text-xs font-semibold rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                          {verifying ? "…" : "Verify"}
                        </button>
                        <button
                          onClick={() => dismissPending(entry.reference)}
                          aria-label={`Dismiss ${entry.reference}`}
                          className="p-1 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <h4
                className={`text-sm font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                Already paid? Verify here
              </h4>
              <p
                className={`text-[10px] sm:text-xs ${
                  darkMode ? "text-zinc-400" : "text-gray-500"
                } mb-3`}
              >
                You are normally verified automatically when the gateway returns you to
                the site. If that was interrupted and the order is not listed above,
                paste its reference — Paystack includes it in the receipt it emails you.
                Otherwise contact support and we will look it up.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={referenceCode}
                  // Uppercased as you type: the API validates against
                  // /^SHR_[A-Z0-9]{16}$/, so a pasted lowercase reference would
                  // 422 for a reason the buyer cannot see.
                  onChange={(e) => setReferenceCode(normalizeReference(e.target.value))}
                  placeholder="e.g. SHR_9F2A7C41B8E63D05"
                  className={`w-full sm:flex-1 ${
                    darkMode
                      ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  } border rounded-xl px-4 py-3 outline-none focus:border-amber-400 transition-colors text-sm`}
                />
                <button
                  onClick={handleVerifyPayment}
                  disabled={verifying}
                  className="w-full sm:w-auto px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                >
                  {verifying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Verify"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

