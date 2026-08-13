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

export const BuySharesTab = ({ darkMode }) => {
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
        gateway: "paystack",
      });

      setPaymentData(data.data);
      toast.success(data.message || "Purchase initiated successfully!");

      if (data.data?.authorizationUrl) {
        window.open(data.data.authorizationUrl, "_blank");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Purchase failed");
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Add Shares – AFRITEK
        </h1>
        <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
          Invest in quality companies and grow your portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Purchase Controls */}
        <div
          className={`${
            darkMode
              ? "bg-zinc-900/50 border-zinc-800"
              : "bg-white border-gray-200"
          } border rounded-2xl p-6 flex flex-col justify-between`}
        >
          <div>
            <div className="flex items-center gap-4 mb-6">
              <img
                src="/afritek-logo-transparent.png"
                alt="AFRITEK Logo"
                className="h-12 w-12 rounded-lg object-contain"
              />
              <div>
                <h3
                  className={`font-bold ${
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
                  ₦{sharePrice.toLocaleString()}
                  <span className="text-green-500 ml-2">+4.82% Today</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-zinc-800/30 rounded-xl">
              <div>
                <p
                  className={`text-xs ${
                    darkMode ? "text-zinc-400" : "text-gray-500"
                  }`}
                >
                  Remaining Shares
                </p>
                <p
                  className={`text-sm font-semibold ${
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
                  className={`text-xs ${
                    darkMode ? "text-zinc-400" : "text-gray-500"
                  }`}
                >
                  Sold Shares
                </p>
                <p
                  className={`text-sm font-semibold ${
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
            <div className="mb-6">
              <label
                className={`text-sm font-medium ${
                  darkMode ? "text-zinc-300" : "text-gray-700"
                } block mb-2`}
              >
                Quantity
              </label>
              <div className="flex items-center gap-4">
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
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white bg-transparent" : "text-gray-900"
                  } w-20 text-center outline-none border-b border-zinc-700 focus:border-amber-400`}
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
            <div className="flex items-center justify-between py-4 border-t border-zinc-800">
              <span
                className={`text-lg font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Total
              </span>
              <span
                className={`text-2xl font-bold ${
                  darkMode ? "text-amber-400" : "text-amber-600"
                }`}
              >
                ₦{total.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleBuy}
              disabled={buying}
              className="w-full py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Bank-level security & encryption</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Instant order execution</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Clock className="w-4 h-4 text-amber-400" />
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
          } border rounded-2xl p-6 flex flex-col justify-between`}
        >
          <div>
            <h3
              className={`text-lg font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              } mb-4`}
            >
              Purchase Summary
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className={darkMode ? "text-zinc-400" : "text-gray-500"}>
                  Share Name
                </span>
                <span
                  className={`font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  AFRITEK
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className={darkMode ? "text-zinc-400" : "text-gray-500"}>
                  Current Price
                </span>
                <span
                  className={`font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  ₦{sharePrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className={darkMode ? "text-zinc-400" : "text-gray-500"}>
                  Quantity
                </span>
                <span
                  className={`font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {quantity}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className={darkMode ? "text-zinc-400" : "text-gray-500"}>
                  Subtotal
                </span>
                <span
                  className={`font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className={darkMode ? "text-zinc-400" : "text-gray-500"}>
                  Platform Fee (1%)
                </span>
                <span
                  className={`font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  ₦{platformFee.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span
                  className={`text-lg font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Estimated Total
                </span>
                <span
                  className={`text-xl font-bold ${
                    darkMode ? "text-amber-400" : "text-amber-600"
                  }`}
                >
                  ₦{total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Link Banner */}
          {paymentData && (
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-xs text-amber-400 font-semibold mb-1">
                Order Pending Payment
              </p>
              <p className="text-xs text-zinc-400 mb-2">
                Reference:{" "}
                <code className="text-white">{paymentData.reference}</code>
              </p>
              {paymentData.authorizationUrl && (
                <a
                  href={paymentData.authorizationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:underline"
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
