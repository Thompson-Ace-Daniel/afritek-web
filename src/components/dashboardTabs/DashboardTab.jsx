import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  TrendingUp,
  Shield,
  Plus,
  Crown,
  Wallet,
  Smartphone,
  BarChart3,
  CheckCircle,
  Share2,
  Users,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { shareAPI, walletAPI, referralAPI } from "../../api/auth.api.js";
import { formatMoney, LEDGER_CURRENCY } from "../../utils/money";

export const DashboardTab = ({ darkMode, user: propUser, onBuyShares }) => {
  const { user: authUser, refreshUser } = useAuth();
  const currentUser = propUser || authUser;

  const [shareInfo, setShareInfo] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [referral, setReferral] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [sharesRes, walletRes, refRes] = await Promise.all([
          shareAPI.getInfo(),
          walletAPI.get(),
          referralAPI.getMyStats(),
        ]);
        setShareInfo(sharesRes.data?.data || null);
        setWallet(walletRes.data?.data || null);
        setReferral(refRes.data?.data || null);
        if (refreshUser) {
          await refreshUser();
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }
    };
    load();
  }, [refreshUser]);

  const userData = {
    name: currentUser?.fullName || "Guest",
    tier: currentUser?.role === "admin" ? "Gold Investor" : "Investor",
  };

  // Every money figure here comes from an API that states its own currency, so
  // each is formatted with that rather than a shared hardcoded symbol. Share
  // prices follow GET /shares; balances and earnings follow the ledger.
  const shareCurrency = shareInfo?.currency ?? LEDGER_CURRENCY;
  const ledgerCurrency = wallet?.currency ?? referral?.currency ?? LEDGER_CURRENCY;

  // Dynamic statistics bound to API data
  const stats = [
    {
      label: "Shares Owned",
      value: (currentUser?.sharesOwned ?? 0).toLocaleString(),
      change: "Active Shares",
      icon: Share2,
      color: "amber",
    },
    {
      label: "Total Invested",
      value: formatMoney(currentUser?.totalInvested ?? 0, ledgerCurrency),
      change: "Lifetime Total",
      icon: TrendingUp,
      color: "green",
    },
    {
      label: "Wallet Balance",
      value: formatMoney(wallet?.balance ?? 0, ledgerCurrency),
      change: "Available Cash",
      icon: Wallet,
      color: "purple",
    },
    {
      label: "Referral Earnings",
      value: formatMoney(referral?.totalReferralEarnings ?? 0, ledgerCurrency),
      change: "Bonus Earned",
      icon: Users,
      color: "orange",
    },
  ];

  const colorMap = {
    green: darkMode
      ? "bg-green-500/10 text-green-400 border-green-500/20"
      : "bg-green-50 text-green-600 border-green-200",
    amber: darkMode
      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
      : "bg-amber-50 text-amber-600 border-amber-200",
    purple: darkMode
      ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
      : "bg-purple-50 text-purple-600 border-purple-200",
    orange: darkMode
      ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
      : "bg-orange-50 text-orange-600 border-orange-200",
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Welcome, {userData.name}
          </h1>
          <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
            Track and manage your investments in one place.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl ${
              darkMode
                ? "bg-amber-500/10 border-amber-500/20"
                : "bg-amber-50 border-amber-200"
            }`}
          >
            <Award className={darkMode ? "text-amber-400" : "text-amber-600"} />
            <span
              className={`text-sm font-semibold ${
                darkMode ? "text-amber-400" : "text-amber-600"
              }`}
            >
              {userData.tier}
            </span>
          </div>

          {onBuyShares ? (
            <button
              onClick={onBuyShares}
              className="px-4 py-2 bg-amber-500 text-white font-semibold rounded-xl text-sm hover:bg-amber-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Buy Shares
            </button>
          ) : (
            <Link
              to="/shares"
              className="px-4 py-2 bg-amber-500 text-white font-semibold rounded-xl text-sm hover:bg-amber-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Buy Shares
            </Link>
          )}
        </div>
      </div>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const bgMap = darkMode
            ? "bg-zinc-900/50 border-zinc-800"
            : "bg-white border-gray-200";
          return (
            <div
              key={index}
              className={`${bgMap} border rounded-2xl p-6 hover:${
                darkMode ? "border-zinc-700" : "shadow-lg"
              } transition-all`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
                    {stat.label}
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    } mt-1`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs font-medium mt-1 text-zinc-500">
                    {stat.change}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl border ${colorMap[stat.color]}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {shareInfo && (
        <div
          className={`${
            darkMode
              ? "bg-zinc-900/50 border-zinc-800"
              : "bg-white border-gray-200"
          } border rounded-2xl p-6`}
        >
          <h3
            className={`text-lg font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Share Market Overview
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <div
              className={`p-4 ${
                darkMode ? "bg-zinc-800/50" : "bg-gray-50"
              } rounded-xl`}
            >
              <p
                className={`text-xs font-medium ${
                  darkMode ? "text-zinc-400" : "text-gray-500"
                }`}
              >
                Price per Share
              </p>
              <p
                className={`text-lg font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                } mt-1`}
              >
                {formatMoney(shareInfo.pricePerShare ?? 0, shareCurrency)}
              </p>
            </div>
            <div
              className={`p-4 ${
                darkMode ? "bg-zinc-800/50" : "bg-gray-50"
              } rounded-xl`}
            >
              <p
                className={`text-xs font-medium ${
                  darkMode ? "text-zinc-400" : "text-gray-500"
                }`}
              >
                Remaining Shares
              </p>
              <p
                className={`text-lg font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                } mt-1`}
              >
                {(shareInfo.remainingShares ?? 0).toLocaleString()}
              </p>
            </div>
            <div
              className={`p-4 ${
                darkMode ? "bg-zinc-800/50" : "bg-gray-50"
              } rounded-xl`}
            >
              <p
                className={`text-xs font-medium ${
                  darkMode ? "text-zinc-400" : "text-gray-500"
                }`}
              >
                Sold Shares
              </p>
              <p
                className={`text-lg font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                } mt-1`}
              >
                {(shareInfo.soldShares ?? 0).toLocaleString()}
              </p>
            </div>
            <div
              className={`p-4 ${
                darkMode ? "bg-zinc-800/50" : "bg-gray-50"
              } rounded-xl`}
            >
              <p
                className={`text-xs font-medium ${
                  darkMode ? "text-zinc-400" : "text-gray-500"
                }`}
              >
                Total Market Value
              </p>
              <p
                className={`text-lg font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                } mt-1`}
              >
                {formatMoney(shareInfo.totalValue ?? 0, shareCurrency)}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Shares Sold Progress Bar */}
      {shareInfo &&
        (() => {
          const sold = shareInfo.soldShares ?? 0;
          const remaining = shareInfo.remainingShares ?? 0;
          const totalShares = sold + remaining;
          const percentage =
            totalShares > 0 ? ((sold / totalShares) * 100).toFixed(5) : 0;

          return (
            <div
              className={`${
                darkMode
                  ? "bg-zinc-900/50 border-zinc-800"
                  : "bg-white border-gray-200"
              } border rounded-2xl p-6`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h3
                    className={`font-semibold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Shares Sales Progress
                  </h3>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-zinc-400" : "text-gray-500"
                    }`}
                  >
                    {(totalShares - sold).toLocaleString()}{" "}
                    shares left
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={darkMode ? "text-zinc-300" : "text-gray-700"}
                  >
                    Progress:
                  </span>
                  <span className="text-amber-500 font-bold">
                    {percentage}%
                  </span>
                </div>
              </div>
              <div className="relative">
                <div
                  className={`h-3 ${
                    darkMode ? "bg-zinc-800" : "bg-gray-200"
                  } rounded-full overflow-hidden`}
                >
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(Number(percentage), 100)}%` }}
                  />
                </div>
                <div
                  className={`flex justify-between mt-2 text-xs ${
                    darkMode ? "text-zinc-500" : "text-gray-400"
                  }`}
                >
                  <span>
                    {sold.toLocaleString()} shares sold
                  </span>
                  <span>{totalShares.toLocaleString()} Total Shares</span>
                </div>
              </div>
            </div>
          );
        })()}{" "}
    </div>
  );
};
