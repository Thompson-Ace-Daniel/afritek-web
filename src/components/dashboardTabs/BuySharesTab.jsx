// ==================== BUY SHARES TAB ====================

import React, { useState, useEffect } from "react";
import {
  Shield,
  Plus,
  Clock,
  Minus,
  Zap,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { shareAPI } from "../../api/auth.api.js";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { savePendingPayment } from "../../utils/pendingPayment";
import { formatUsd, describeCharge } from "../../utils/money";

export const BuySharesTab = ({ darkMode }) => {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [shareInfo, setShareInfo] = useState(null);

  // Loading & Action states
  const [fetchingInfo, setFetchingInfo] = useState(false);
  const [buying, setBuying] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  // Fetch market/share info on component mount
  useEffect(() => {
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
  }, []);

  // No fabricated fallback price — the real one comes from GET /shares.
  const sharePrice = shareInfo?.pricePerShare ?? null;
  const remainingShares = shareInfo?.remainingShares ?? null;
  const subtotal = sharePrice === null ? null : quantity * sharePrice;

  // The backend charges quantity × pricePerShare exactly, with no fee added, so
  // quoting a 1% platform fee here made the gateway amount disagree with the
  // total the buyer had just approved.
  const total = subtotal;

  const exceedsSupply = remainingShares !== null && quantity > remainingShares;
  const canBuy = !buying && sharePrice !== null && quantity >= 1 && !exceedsSupply;

  // Shares are priced in USD (`SHARE_PRICE_USD` server-side), so the quote is
  // rendered as USD. Not from GET /shares' `currency`: that field echoes the
  // API's CURRENCY env var, and a stale NGN there quoted a $20 share as "₦20".
  // The Naira the buyer is actually debited is the charge leg, shown by
  // describeCharge below once the server has pinned the rate.
  const money = (value) => formatUsd(value);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  // Initiate purchase request via API
  const handleBuy = async () => {
    setBuying(true);
    setPaymentData(null);
    try {
      const { data } = await shareAPI.buy({
        quantity: Number(quantity),
        gateway: "paystack",
      });

      const payment = data.data;
      setPaymentData(payment);

      // Stash the reference so /payment/callback can verify even if the gateway
      // does not echo it back on the return trip.
      if (payment?.reference) {
        savePendingPayment({
          reference: payment.reference,
          gateway: "paystack",
          quantity: payment.quantity ?? Number(quantity),
          amount: payment.amount,
          currency: payment.currency,
          uid: user?.uid,
        });
      }

      // Same tab: window.open after an await is outside the click gesture and
      // gets blocked, and redirecting here means the gateway returns the buyer
      // to /payment/callback, which verifies and credits the shares.
      if (payment?.authorizationUrl) {
        toast.success("Redirecting you to complete payment…");
        window.location.assign(payment.authorizationUrl);
        return;
      }

      toast.success(data.message || "Purchase initiated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Purchase failed");
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1
          className={`text-xl sm:text-2xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Add Shares – AFRITEK
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
              : "bg-white border-gray-200"
          } border rounded-2xl p-4 sm:p-6 flex flex-col justify-between`}
        >
          <div>
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <img
                src="/afritek-logo-transparent.png"
                alt="AFRITEK Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-contain"
              />
              <div>
                <h3
                  className={`font-bold text-base sm:text-lg ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  AFRITEK
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
                      : "bg-gray-100 hover:bg-gray-200"
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
                      : "bg-gray-100 hover:bg-gray-200"
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
          </div>

          <div>
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

            {exceedsSupply && (
              <p className="mb-3 text-xs text-red-400">
                Only {remainingShares.toLocaleString()} shares remain — reduce the
                quantity to continue.
              </p>
            )}

            <button
              onClick={handleBuy}
              disabled={!canBuy}
              className="w-full py-2.5 sm:py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
            >
              {buying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Initiating Order...
                </>
              ) : (
                "Proceed to Payment →"
              )}
            </button>

            <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-2 text-[10px] sm:text-xs text-zinc-500">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span>Bank-level security & encryption</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs text-zinc-500">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span>Instant order execution</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs text-zinc-500">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span>24/7 dedicated institutional support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div
          className={`${
            darkMode
              ? "bg-zinc-900/50 border-zinc-800"
              : "bg-white border-gray-200"
          } border rounded-2xl p-4 sm:p-6 flex flex-col justify-between`}
        >
          <div>
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
                  AFRITEK
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

              {/* Shares are priced in USD but this tab pays via Paystack, which
                  can only bill Naira. The exact Naira figure depends on the rate
                  the server resolves at checkout, so it is not knowable here —
                  saying so is better than showing a converted number that the
                  gateway might then disagree with. Unconditional because this tab
                  has no gateway choice: it always initiates with Paystack. */}
              <p
                className={`pt-2 text-[10px] sm:text-xs ${
                  darkMode ? "text-zinc-500" : "text-gray-500"
                }`}
              >
                Paystack settles in Naira. You will be shown the exact Naira
                amount, at the current rate, before you confirm payment.
              </p>
            </div>
          </div>

          {/* Payment Link Banner */}
          {paymentData && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-[10px] sm:text-xs text-amber-400 font-semibold mb-1">
                Order Pending Payment
              </p>
              <p className="text-[10px] sm:text-xs text-zinc-400 mb-2">
                Reference:{" "}
                <code className="text-white">{paymentData.reference}</code>
              </p>
              {describeCharge(paymentData) && (
                <p className="text-[10px] sm:text-xs text-zinc-400 mb-2">
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
                  Complete Checkout on Gateway{" "}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
