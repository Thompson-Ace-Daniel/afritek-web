import React, { useState } from "react";
import { X, Minus, Plus, Shield, Zap, Clock } from "lucide-react";

export default function BuySharesModal({ isOpen, onClose, darkMode }) {
  const [quantity, setQuantity] = useState(14);
  const [paymentGateway, setPaymentGateway] = useState("paystack");
  const [referenceCode, setReferenceCode] = useState("");

  if (!isOpen) return null;

  const sharePrice = 1250;
  const subtotal = quantity * sharePrice;
  const platformFee = Math.round(subtotal * 0.01);
  const total = subtotal + platformFee;

  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const handleVerifyPayment = () => {
    if (referenceCode.trim()) {
      alert("Payment verified successfully!");
      onClose();
    } else {
      alert("Please enter a reference code");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl ${
          darkMode
            ? "bg-zinc-950 border border-zinc-800"
            : "bg-white border border-gray-200"
        } shadow-2xl p-6`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-xl ${
            darkMode ? "hover:bg-zinc-800" : "hover:bg-gray-100"
          } transition-colors`}
        >
          <X className={darkMode ? "text-zinc-400" : "text-gray-500"} />
        </button>

        <div className="mb-6">
          <h1
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Add Shares – Afritek
          </h1>
          <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
            Invest in quality companies and grow your portfolio.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Purchase Form */}
          <div
            className={`${darkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-gray-50 border-gray-200"} border rounded-2xl p-6`}
          >
            <div className="flex items-center gap-4 mb-6">
              <img
                src="/afritek-logo-transparent.png"
                alt="AfriTek Logo"
                className="h-12 w-12 rounded-lg"
              />
              <div>
                <h3
                  className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  Afritek
                </h3>
                <p
                  className={`text-sm ${darkMode ? "text-zinc-400" : "text-gray-500"}`}
                >
                  N{sharePrice.toFixed(2)}
                  <span className="text-green-500 ml-2">+4.82% Today</span>
                </p>
              </div>
            </div>

            {/* Price Info */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-zinc-800/30 rounded-xl">
              <div>
                <p
                  className={`text-xs ${darkMode ? "text-zinc-400" : "text-gray-500"}`}
                >
                  Day High / Low
                </p>
                <p
                  className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  N{sharePrice + 10}.00 / N{sharePrice - 40}.00
                </p>
              </div>
              <div>
                <p
                  className={`text-xs ${darkMode ? "text-zinc-400" : "text-gray-500"}`}
                >
                  52W High / Low
                </p>
                <p
                  className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  N{sharePrice + 100}.00 / N{sharePrice - 360}.00
                </p>
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label
                className={`text-sm font-medium ${darkMode ? "text-zinc-300" : "text-gray-700"} block mb-2`}
              >
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className={`p-2 rounded-xl ${darkMode ? "bg-zinc-800 hover:bg-zinc-700" : "bg-gray-200 hover:bg-gray-300"} transition-colors`}
                >
                  <Minus
                    className={`w-5 h-5 ${darkMode ? "text-white" : "text-gray-700"}`}
                  />
                </button>
                <span
                  className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"} w-16 text-center`}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className={`p-2 rounded-xl ${darkMode ? "bg-zinc-800 hover:bg-zinc-700" : "bg-gray-200 hover:bg-gray-300"} transition-colors`}
                >
                  <Plus
                    className={`w-5 h-5 ${darkMode ? "text-white" : "text-gray-700"}`}
                  />
                </button>
              </div>
            </div>

            {/* Payment Gateway */}
            <div className="mb-6">
              <label
                className={`text-sm font-medium ${darkMode ? "text-zinc-300" : "text-gray-700"} block mb-2`}
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
                } border rounded-xl px-4 py-3 outline-none focus:border-amber-400 transition-colors`}
              >
                <option value="paystack">Paystack</option>
                <option value="flutterwave">Flutterwave</option>
                <option value="stripe">Stripe</option>
              </select>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between py-4 border-t border-zinc-800">
              <span
                className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                Total
              </span>
              <span
                className={`text-2xl font-bold ${darkMode ? "text-amber-400" : "text-amber-600"}`}
              >
                N{total.toLocaleString()}
              </span>
            </div>

            <button className="w-full py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2">
              Review Purchase →
            </button>

            {/* Features */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Bank-level security & encryption</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Instant order execution on verify</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>24/7 dedicated institutional support</span>
              </div>
            </div>
          </div>

          {/* Purchase Summary */}
          <div
            className={`${darkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-gray-50 border-gray-200"} border rounded-2xl p-6`}
          >
            <h3
              className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-4`}
            >
              Purchase Summary
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className={darkMode ? "text-zinc-400" : "text-gray-500"}>
                  Share Name
                </span>
                <span
                  className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  Afritek
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className={darkMode ? "text-zinc-400" : "text-gray-500"}>
                  Current Price
                </span>
                <span
                  className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  N{sharePrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className={darkMode ? "text-zinc-400" : "text-gray-500"}>
                  Quantity
                </span>
                <span
                  className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  {quantity}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className={darkMode ? "text-zinc-400" : "text-gray-500"}>
                  Subtotal
                </span>
                <span
                  className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  N{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className={darkMode ? "text-zinc-400" : "text-gray-500"}>
                  Platform Fee (1%)
                </span>
                <span
                  className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  N{platformFee.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span
                  className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  Estimated Total
                </span>
                <span
                  className={`text-xl font-bold ${darkMode ? "text-amber-400" : "text-amber-600"}`}
                >
                  N{total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Verify Payment */}
            <div className="mt-6 pt-6 border-t border-zinc-800">
              <h4
                className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"} mb-2`}
              >
                Verify Paystack Payment
              </h4>
              <p
                className={`text-xs ${darkMode ? "text-zinc-400" : "text-gray-500"} mb-3`}
              >
                If you've already completed the payment via Paystack, enter your
                reference code below.
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={referenceCode}
                  onChange={(e) => setReferenceCode(e.target.value)}
                  placeholder="e.g. T473957283"
                  className={`flex-1 ${
                    darkMode
                      ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  } border rounded-xl px-4 py-3 outline-none focus:border-amber-400 transition-colors`}
                />
                <button
                  onClick={handleVerifyPayment}
                  className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
