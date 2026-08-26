// ==================== WALLET TAB ====================

import React, { useState, useEffect, useCallback } from "react";
import {
  Wallet,
  Gift,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Loader2,
  ArrowDownRight,
} from "lucide-react";
import { walletAPI } from "../../api/auth.api.js";
import { toast } from "react-hot-toast";
import { formatMoney, LEDGER_CURRENCY } from "../../utils/money";

export const WalletTab = ({ darkMode }) => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Wallet Data from API
  const fetchWallet = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await walletAPI.get();
      setWallet(data.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to load wallet info",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  // There is deliberately no self-service deposit here. Balance is earned from
  // referral commissions on gateway-verified share purchases; the old
  // POST /wallet/deposit let any user credit themselves for free and is now an
  // admin-only endpoint (POST /wallet/credit).

  // The API states the currency its figures are in (GET /wallet), so the tab
  // renders that rather than a hardcoded symbol — these are USD since the
  // share reprice, and were silently mislabelled as Naira before.
  const currency = wallet?.currency ?? LEDGER_CURRENCY;
  const money = (value) => formatMoney(value, currency);

  const walletStats = [
    {
      label: "Available Balance",
      value: money(wallet?.balance ?? 0),
      icon: Wallet,
      color: "amber",
    },
    {
      label: "Total Referral Earnings",
      value: money(wallet?.totalReferralEarnings ?? 0),
      icon: Gift,
      color: "green",
    },
    {
      label: "Total Invested",
      value: money(wallet?.totalInvested ?? 0),
      icon: TrendingUp,
      color: "purple",
    },
    {
      label: "Total Returns",
      value: money(wallet?.totalReturns ?? 0),
      icon: DollarSign,
      color: "emerald",
    },
  ];

  const colorMap = {
    amber: darkMode
      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
      : "bg-amber-50 text-amber-600 border-amber-200",
    green: darkMode
      ? "bg-green-500/10 text-green-400 border-green-500/20"
      : "bg-green-50 text-green-600 border-green-200",
    purple: darkMode
      ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
      : "bg-purple-50 text-purple-600 border-purple-200",
    emerald: darkMode
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : "bg-emerald-50 text-emerald-600 border-emerald-200",
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
            Wallet
          </h1>
          <p
            className={`text-sm ${darkMode ? "text-zinc-400" : "text-gray-500"}`}
          >
            Manage your funds and transactions
          </p>
        </div>
        <button
          onClick={fetchWallet}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {walletStats.map((stat, index) => {
          const Icon = stat.icon;
          const bgMap = darkMode
            ? "bg-zinc-900/50 border-zinc-800"
            : "bg-white border-gray-200";

          return (
            <div
              key={index}
              className={`${bgMap} border rounded-2xl p-4 sm:p-6 transition-all`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className={`text-xs sm:text-sm ${
                      darkMode ? "text-zinc-400" : "text-gray-500"
                    }`}
                  >
                    {stat.label}
                  </p>
                  <p
                    className={`text-base sm:text-xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    } mt-1`}
                  >
                    {loading ? "..." : stat.value}
                  </p>
                </div>
                <div
                  className={`p-2 sm:p-3 rounded-xl border ${colorMap[stat.color]}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Recent Commissions & Activity Table */}
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
            Recent Commissions
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            </div>
          ) : wallet?.recentCommissions?.length > 0 ? (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-full inline-block align-middle px-4 sm:px-0">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr
                      className={`border-b ${
                        darkMode
                          ? "border-zinc-800 text-zinc-400"
                          : "border-gray-200 text-gray-500"
                      } text-left`}
                    >
                      <th className="py-2 sm:py-3 px-2">Level</th>
                      <th className="py-2 sm:py-3 px-2">Amount</th>
                      <th className="hidden sm:table-cell py-2 sm:py-3 px-2">
                        Base
                      </th>
                      <th className="hidden sm:table-cell py-2 sm:py-3 px-2">
                        Rate
                      </th>
                      <th className="py-2 sm:py-3 px-2">Date</th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      darkMode ? "divide-zinc-800" : "divide-gray-100"
                    }`}
                  >
                    {wallet.recentCommissions.map((c) => (
                      <tr key={c.id}>
                        <td
                          className={`py-2 sm:py-3 px-2 font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          L{c.level}
                        </td>
                        <td className="py-2 sm:py-3 px-2 text-green-500 font-semibold">
                          +{money(c.amount)}
                        </td>
                        <td
                          className={`hidden sm:table-cell py-2 sm:py-3 px-2 ${
                            darkMode ? "text-zinc-400" : "text-gray-600"
                          }`}
                        >
                          {money(c.baseAmount)}
                        </td>
                        <td
                          className={`hidden sm:table-cell py-2 sm:py-3 px-2 ${
                            darkMode ? "text-zinc-400" : "text-gray-600"
                          }`}
                        >
                          {c.rate}%
                        </td>
                        <td
                          className={`py-2 sm:py-3 px-2 ${
                            darkMode ? "text-zinc-400" : "text-gray-600"
                          }`}
                        >
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div
              className={`text-center py-12 ${
                darkMode ? "text-zinc-500" : "text-gray-400"
              }`}
            >
              <ArrowDownRight className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No recent commission activity recorded.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
