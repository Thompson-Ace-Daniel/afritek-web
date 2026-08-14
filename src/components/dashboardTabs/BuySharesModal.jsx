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

export const BuySharesModal = ({ isOpen, onClose, darkMode, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [paymentGateway, setPaymentGateway] = useState("paystack");
  const [referenceCode, setReferenceCode] = useState("");
  const [shareInfo, setShareInfo] = useState(null);

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

  if (!isOpen) return null;

  const sharePrice = shareInfo?.pricePerShare || 1250;
  const subtotal = quantity * sharePrice;
  const platformFee = Math.round(subtotal * 0.01);
  const total = subtotal + platformFee;

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
        gateway: paymentGateway,
      });

      setPaymentData(data.data);
      toast.success(data.message || "Purchase initiated successfully!");

      if (data.data?.reference) {
        setReferenceCode(data.data.reference);
      }

      if (data.data?.authorizationUrl) {
        window.open(data.data.authorizationUrl, "_blank");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Purchase failed");
    } finally {
      setBuying(false);
    }
  };

  // Verify Paystack transaction via API
  const handleVerifyPayment = async () => {
    if (!referenceCode.trim()) {
      toast.error("Please enter a reference code");
      return;
    }

    setVerifying(true);
    try {
      const { data } = await shareAPI.verifyPaystack(referenceCode);
      toast.success(data.message || "Payment verified successfully!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
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
                  ₦{sharePrice.toLocaleString()}
                  <span className="text-green-500 ml-2">+4.82% Today</span>
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
                <option value="stripe">Stripe</option>
                <option value="paypal">Paypal</option>
                <option value="wallet">Wallet</option>
              </select>
            </div>

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
                ₦{total.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleBuy}
              disabled={buying}
              className="w-full py-2.5 sm:py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
            >
              {buying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Initiating...
                </>
              ) : (
                "Review Purchase →"
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
                  ₦{sharePrice.toLocaleString()}
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
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span
                  className={`text-sm ${darkMode ? "text-zinc-400" : "text-gray-500"}`}
                >
                  Platform Fee (1%)
                </span>
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  ₦{platformFee.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span
                  className={`text-base sm:text-lg font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Estimated Total
                </span>
                <span
                  className={`text-lg sm:text-xl font-bold ${
                    darkMode ? "text-amber-400" : "text-amber-600"
                  }`}
                >
                  ₦{total.toLocaleString()}
                </span>
              </div>
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
                {paymentData.clientSecret && (
                  <p className="text-[10px] sm:text-xs text-zinc-400 mt-1 break-all">
                    Paystack Client Secret:{" "}
                    <code>{paymentData.clientSecret}</code>
                  </p>
                )}
              </div>
            )}

            {/* Verification Section */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-zinc-800">
              <h4
                className={`text-sm font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                Verify Paystack Payment
              </h4>
              <p
                className={`text-[10px] sm:text-xs ${
                  darkMode ? "text-zinc-400" : "text-gray-500"
                } mb-3`}
              >
                If you've completed the payment via Paystack, enter your
                reference code below.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={referenceCode}
                  onChange={(e) => setReferenceCode(e.target.value)}
                  placeholder="e.g. SHR_ABC123"
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

