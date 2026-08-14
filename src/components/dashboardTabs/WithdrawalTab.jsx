// ==================== WITHDRAWALS TAB ====================

import React, { useState, useEffect, useCallback } from "react";
import {
  Wallet,
  ArrowUpRight,
  Loader2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { withdrawalAPI } from "../../api/auth.api.js";
import { toast } from "react-hot-toast";

export const WithdrawalsTab = ({ darkMode, user }) => {
  const isAdmin = user?.role === "admin";

  // State Management
  const [withdrawals, setWithdrawals] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  // Form State
  const [form, setForm] = useState({
    amount: "",
    accountName: "",
    accountNumber: "",
    bankCode: "",
    bankName: "",
  });

  // Fetch Withdrawals Data
  const loadWithdrawals = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await withdrawalAPI.getMine();
      const userWithdrawals = data.data?.withdrawals || data.data || [];
      setWithdrawals(Array.isArray(userWithdrawals) ? userWithdrawals : []);

      if (isAdmin) {
        const pendRes = await withdrawalAPI.getPending();
        setPending(pendRes.data?.data || []);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load withdrawal history",
      );
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadWithdrawals();
  }, [loadWithdrawals]);

  // Handle Withdrawal Request
  const handleRequest = async (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await withdrawalAPI.request({
        ...form,
        amount: Number(form.amount),
      });

      toast.success(data.message || "Withdrawal request submitted!");
      setForm({
        amount: "",
        accountName: "",
        accountNumber: "",
        bankCode: "",
        bankName: "",
      });
      loadWithdrawals();
    } catch (err) {
      toast.error(err.response?.data?.message || "Withdrawal request failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Admin Handler for Processing Requests
  const handleProcess = async (id, action) => {
    setProcessingId(id);
    try {
      const { data } = await withdrawalAPI.process(id, {
        action,
        note:
          action === "approve"
            ? "Paid via bank transfer"
            : "Invalid account details",
      });

      toast.success(data.message || `Request ${action}d successfully`);
      loadWithdrawals();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} request`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-6xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1
            className={`text-xl sm:text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Withdrawals
          </h1>
          <p
            className={`text-sm ${darkMode ? "text-zinc-400" : "text-gray-500"}`}
          >
            Request and track your withdrawals
          </p>
        </div>
        <button
          onClick={loadWithdrawals}
          disabled={loading}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 ${
            darkMode
              ? "bg-zinc-800 hover:bg-zinc-700 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          } rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-2 self-start sm:self-auto disabled:opacity-50`}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Request Form */}
        <div
          className={`lg:col-span-3 ${
            darkMode
              ? "bg-zinc-900/50 border-zinc-800"
              : "bg-white border-gray-200"
          } border rounded-2xl p-4 sm:p-6`}
        >
          <h3
            className={`text-base sm:text-lg font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            } mb-3 sm:mb-4`}
          >
            Request Withdrawal
          </h3>

          <form onSubmit={handleRequest} className="space-y-3 sm:space-y-4">
            <div>
              <label
                className={`text-sm font-medium ${
                  darkMode ? "text-zinc-300" : "text-gray-700"
                } block mb-1.5`}
              >
                Amount (₦) <span className="text-amber-500">*</span>
              </label>
              <input
                type="number"
                min="1000"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="Enter amount (min ₦1,000)"
                className={`w-full ${
                  darkMode
                    ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                } border rounded-xl px-4 py-3 outline-none focus:border-amber-400 transition-colors text-sm sm:text-base`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label
                  className={`text-sm font-medium ${
                    darkMode ? "text-zinc-300" : "text-gray-700"
                  } block mb-1.5`}
                >
                  Account Name <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.accountName}
                  onChange={(e) =>
                    setForm({ ...form, accountName: e.target.value })
                  }
                  placeholder="Account holder name"
                  className={`w-full ${
                    darkMode
                      ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                  } border rounded-xl px-4 py-3 outline-none focus:border-amber-400 transition-colors text-sm sm:text-base`}
                />
              </div>

              <div>
                <label
                  className={`text-sm font-medium ${
                    darkMode ? "text-zinc-300" : "text-gray-700"
                  } block mb-1.5`}
                >
                  Account Number <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  required
                  value={form.accountNumber}
                  onChange={(e) =>
                    setForm({ ...form, accountNumber: e.target.value })
                  }
                  placeholder="10 digit account number"
                  className={`w-full ${
                    darkMode
                      ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                  } border rounded-xl px-4 py-3 outline-none focus:border-amber-400 transition-colors text-sm sm:text-base`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label
                  className={`text-sm font-medium ${
                    darkMode ? "text-zinc-300" : "text-gray-700"
                  } block mb-1.5`}
                >
                  Bank Code <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.bankCode}
                  onChange={(e) =>
                    setForm({ ...form, bankCode: e.target.value })
                  }
                  placeholder="e.g. 058"
                  className={`w-full ${
                    darkMode
                      ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                  } border rounded-xl px-4 py-3 outline-none focus:border-amber-400 transition-colors text-sm sm:text-base`}
                />
              </div>

              <div>
                <label
                  className={`text-sm font-medium ${
                    darkMode ? "text-zinc-300" : "text-gray-700"
                  } block mb-1.5`}
                >
                  Bank Name <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.bankName}
                  onChange={(e) =>
                    setForm({ ...form, bankName: e.target.value })
                  }
                  placeholder="e.g. GTBank"
                  className={`w-full ${
                    darkMode
                      ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                  } border rounded-xl px-4 py-3 outline-none focus:border-amber-400 transition-colors text-sm sm:text-base`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 sm:py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2 text-sm sm:text-base"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <ArrowUpRight className="w-4 h-4" /> Submit Request
                </>
              )}
            </button>
          </form>
        </div>

        {/* Withdrawal History */}
        <div
          className={`lg:col-span-2 ${
            darkMode
              ? "bg-zinc-900/50 border-zinc-800"
              : "bg-white border-gray-200"
          } border rounded-2xl p-4 sm:p-6`}
        >
          <h3
            className={`text-base sm:text-lg font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            } mb-3 sm:mb-4`}
          >
            My Withdrawals
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            </div>
          ) : withdrawals.length > 0 ? (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {withdrawals.map((w) => {
                const isApproved =
                  w.status === "completed" || w.status === "approved";
                const isPending = w.status === "pending";

                return (
                  <div
                    key={w.withdrawalId || w.id}
                    className={`p-3 sm:p-4 ${
                      darkMode ? "bg-zinc-800/50" : "bg-gray-50"
                    } rounded-xl border ${
                      darkMode ? "border-zinc-800" : "border-gray-100"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span
                        className={`font-bold ${
                          darkMode ? "text-white" : "text-gray-900"
                        } text-sm sm:text-base`}
                      >
                        ₦{(w.amount || 0).toLocaleString()}
                      </span>
                      <span
                        className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold capitalize flex items-center gap-1 ${
                          isApproved
                            ? darkMode
                              ? "bg-green-500/10 text-green-400"
                              : "bg-green-50 text-green-600"
                            : isPending
                              ? darkMode
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-amber-50 text-amber-600"
                              : darkMode
                                ? "bg-red-500/10 text-red-400"
                                : "bg-red-50 text-red-600"
                        }`}
                      >
                        {isApproved ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : isPending ? (
                          <Clock className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {w.status}
                      </span>
                    </div>

                    <p
                      className={`text-xs ${
                        darkMode ? "text-zinc-400" : "text-gray-500"
                      }`}
                    >
                      {w.bankName || w.bankCode} · {w.accountNumber || "N/A"}
                    </p>

                    <p
                      className={`text-[10px] sm:text-[11px] ${
                        darkMode ? "text-zinc-500" : "text-gray-400"
                      } mt-1`}
                    >
                      {w.createdAt
                        ? new Date(w.createdAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Wallet
                className={`w-10 h-10 ${
                  darkMode ? "text-zinc-700" : "text-gray-300"
                } mx-auto mb-3`}
              />
              <p
                className={`text-sm ${
                  darkMode ? "text-zinc-400" : "text-gray-500"
                }`}
              >
                No withdrawals requested yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Admin Panel (Visible Only to Admins) */}
      {isAdmin && (
        <div
          className={`mt-4 sm:mt-6 ${
            darkMode
              ? "bg-zinc-900/50 border-zinc-800"
              : "bg-white border-gray-200"
          } border rounded-2xl p-4 sm:p-6`}
        >
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <h3
              className={`text-base sm:text-lg font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Pending Approvals (Admin)
            </h3>
          </div>

          {pending.length === 0 ? (
            <p
              className={`text-sm ${
                darkMode ? "text-zinc-500" : "text-gray-400"
              }`}
            >
              No pending withdrawal requests.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {pending.map((w) => {
                const itemReqId = w.withdrawalId || w.id;
                const isProcessing = processingId === itemReqId;

                return (
                  <div
                    key={itemReqId}
                    className={`p-3 sm:p-4 border ${
                      darkMode
                        ? "bg-zinc-800/40 border-zinc-800"
                        : "bg-gray-50 border-gray-200"
                    } rounded-xl flex flex-col justify-between gap-3`}
                  >
                    <div>
                      <div className="flex flex-wrap justify-between items-start gap-1">
                        <p
                          className={`text-base sm:text-lg font-bold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          ₦{(w.amount || 0).toLocaleString()}
                        </p>
                        <span className="text-[10px] sm:text-xs text-amber-500 font-medium bg-amber-500/10 px-2 py-0.5 rounded">
                          Pending
                        </span>
                      </div>
                      <p
                        className={`text-sm mt-1 ${
                          darkMode ? "text-zinc-300" : "text-gray-700"
                        }`}
                      >
                        {w.accountName}
                      </p>
                      <p
                        className={`text-xs ${
                          darkMode ? "text-zinc-400" : "text-gray-500"
                        }`}
                      >
                        {w.accountNumber} · {w.bankName || w.bankCode}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-zinc-700/20">
                      <button
                        onClick={() => handleProcess(itemReqId, "approve")}
                        disabled={isProcessing}
                        className="flex-1 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          "Approve"
                        )}
                      </button>
                      <button
                        onClick={() => handleProcess(itemReqId, "reject")}
                        disabled={isProcessing}
                        className="flex-1 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          "Reject"
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
