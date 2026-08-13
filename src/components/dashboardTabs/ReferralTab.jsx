// ==================== REFERRAL TAB ====================

import React, { useState, useEffect, useCallback } from "react";
import {
  Award,
  Wallet,
  Check,
  Copy,
  Users,
  Gift,
  TrendingUp,
  Loader2,
  RefreshCw,
  UserCheck,
} from "lucide-react";
import { referralAPI } from "../../api/auth.api.js";
import { toast } from "react-hot-toast";

export const ReferralTab = ({ darkMode }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Fetch Referral Data from API
  const fetchReferralStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await referralAPI.getMyStats();
      setStats(res.data?.data || null);
      console.log("Referral Stats:", res.data?.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load referral statistics",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReferralStats();
  }, [fetchReferralStats]);

  const handleCopy = () => {
    if (stats?.referralLink) {
      navigator.clipboard.writeText(
        `http://${window.location.host}/register?ref=${stats?.referralCode || "No link generated"}`,
      );
      setCopied(true);
      toast.success("Referral link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const colorMap = {
    blue: darkMode
      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
      : "bg-blue-50 text-blue-600 border-blue-200",
    purple: darkMode
      ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
      : "bg-purple-50 text-purple-600 border-purple-200",
    amber: darkMode
      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
      : "bg-amber-50 text-amber-600 border-amber-200",
    green: darkMode
      ? "bg-green-500/10 text-green-400 border-green-500/20"
      : "bg-green-50 text-green-600 border-green-200",
  };

  const statCards = [
    {
      label: "Direct Referrals",
      value: stats?.directReferrals ?? 0,
      icon: Users,
      color: "blue",
    },
    {
      label: "2nd Level",
      value: stats?.secondLevelReferrals ?? 0,
      icon: Users,
      color: "purple",
    },
    {
      label: "Total Earnings",
      value: `₦${(stats?.totalReferralEarnings ?? 0).toLocaleString()}`,
      icon: Gift,
      color: "amber",
    },
    {
      label: "Wallet Balance",
      value: `₦${(stats?.balance ?? 0).toLocaleString()}`,
      icon: Wallet,
      color: "green",
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            My Referrals
          </h1>
          <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
            Invite friends and earn recurring rewards
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchReferralStats}
            disabled={loading}
            className={`p-2.5 ${
              darkMode
                ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            } rounded-xl text-sm transition-colors flex items-center gap-2 disabled:opacity-50`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <div
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl ${
              darkMode
                ? "bg-amber-500/10 border-amber-500/20"
                : "bg-amber-50 border-amber-200"
            }`}
          >
            <Award
              className={`w-4 h-4 ${
                darkMode ? "text-amber-400" : "text-amber-600"
              }`}
            />
            <span
              className={`text-sm font-semibold ${
                darkMode ? "text-amber-400" : "text-amber-600"
              }`}
            >
              Level 1: {stats?.rates?.level1 || "15%"} · Level 2:{" "}
              {stats?.rates?.level2 || "5%"}
            </span>
          </div>
        </div>
      </div>

      {/* Referral Link & Code Section */}
      <div
        className={`${
          darkMode
            ? "bg-zinc-900/50 border-zinc-800"
            : "bg-white border-gray-200"
        } border rounded-2xl p-6`}
      >
        <h3
          className={`text-lg font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          } mb-4`}
        >
          Your Referral Link
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <div
            className={`flex-1 flex items-center gap-3 px-4 py-3 ${
              darkMode
                ? "bg-zinc-800 border-zinc-700 text-zinc-300"
                : "bg-gray-50 border-gray-200 text-gray-700"
            } border rounded-xl font-mono text-sm overflow-x-auto`}
          >
            {loading ? (
              <div className="flex items-center gap-2 text-xs">
                <Loader2 className="w-4 h-4 animate-spin" /> Generating link...
              </div>
            ) : (
              `http://${window.location.host}/register?ref=${stats?.referralCode || "No link generated"}`
            )}
          </div>

          <button
            onClick={handleCopy}
            disabled={!stats?.referralLink || loading}
            className={`px-6 py-3 ${
              darkMode
                ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                : "bg-amber-100 text-amber-600 hover:bg-amber-200"
            } rounded-xl transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50`}
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <p
            className={`text-sm ${
              darkMode ? "text-zinc-400" : "text-gray-500"
            }`}
          >
            Referral Code:{" "}
            <span
              className={`font-mono font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              } bg-zinc-500/10 px-2 py-0.5 rounded border ${
                darkMode ? "border-zinc-700" : "border-gray-200"
              }`}
            >
              {stats?.referralCode || "—"}
            </span>
          </p>
        </div>
      </div>

      {/* Referral Statistics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${
                darkMode
                  ? "bg-zinc-900/50 border-zinc-800"
                  : "bg-white border-gray-200"
              } border rounded-2xl p-6 transition-all`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-zinc-400" : "text-gray-500"
                    }`}
                  >
                    {stat.label}
                  </p>
                  <p
                    className={`text-xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    } mt-1`}
                  >
                    {loading ? "..." : stat.value}
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

      {/* Commission Rates Breakdown */}
      <div
        className={`${
          darkMode
            ? "bg-zinc-900/50 border-zinc-800"
            : "bg-white border-gray-200"
        } border rounded-2xl p-6`}
      >
        <h3
          className={`text-lg font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          } mb-4`}
        >
          Commission Rates
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className={`p-4 ${
              darkMode ? "bg-zinc-800/50" : "bg-gray-50"
            } rounded-xl text-center`}
          >
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg">
              1
            </div>
            <p
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              } mt-2`}
            >
              {stats?.rates?.level1 || "15%"}
            </p>
            <p
              className={`text-sm ${
                darkMode ? "text-zinc-400" : "text-gray-500"
              }`}
            >
              Level 1 Direct Commission
            </p>
          </div>

          <div
            className={`p-4 ${
              darkMode ? "bg-zinc-800/50" : "bg-gray-50"
            } rounded-xl text-center`}
          >
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
              2
            </div>
            <p
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              } mt-2`}
            >
              {stats?.rates?.level2 || "5%"}
            </p>
            <p
              className={`text-sm ${
                darkMode ? "text-zinc-400" : "text-gray-500"
              }`}
            >
              Level 2 Secondary Commission
            </p>
          </div>
        </div>
      </div>

      {/* Direct Referrals List */}
      <div
        className={`${
          darkMode
            ? "bg-zinc-900/50 border-zinc-800"
            : "bg-white border-gray-200"
        } border rounded-2xl p-6`}
      >
        <h3
          className={`text-lg font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          } mb-4`}
        >
          Direct Referred Users
        </h3>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
          </div>
        ) : stats?.level1Users?.length > 0 ? (
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {stats.level1Users.map((refUser, idx) => (
              <div
                key={refUser.uid || refUser._id || idx}
                className={`flex items-center justify-between p-3.5 ${
                  darkMode ? "bg-zinc-800/50" : "bg-gray-50"
                } rounded-xl border ${
                  darkMode ? "border-zinc-800" : "border-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${
                      darkMode ? "bg-zinc-700" : "bg-amber-100"
                    } flex items-center justify-center font-bold ${
                      darkMode ? "text-white" : "text-amber-700"
                    }`}
                  >
                    {refUser.fullName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p
                      className={`font-semibold text-sm ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {refUser.fullName || "Anonymous User"}
                    </p>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-zinc-400" : "text-gray-500"
                      }`}
                    >
                      {refUser.email || "No email provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full font-medium">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Level 1</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users
              className={`w-10 h-10 ${
                darkMode ? "text-zinc-700" : "text-gray-300"
              } mx-auto mb-2`}
            />
            <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
              No direct referrals registered yet.
            </p>
            <p
              className={`text-xs ${
                darkMode ? "text-zinc-500" : "text-gray-400"
              } mt-1`}
            >
              Share your referral link to begin earning bonuses.
            </p>
          </div>
        )}
      </div>

      {/* Benefits Overview Card */}
      <div
        className={`${
          darkMode
            ? "bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20"
            : "bg-gradient-to-br from-amber-50 to-transparent border-amber-200"
        } border rounded-2xl p-6`}
      >
        <h3
          className={`text-lg font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          } mb-4`}
        >
          Referral Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Gift,
              title: "Instant Commissions",
              desc: "Earn up to 15% instant commission whenever your referrals invest.",
            },
            {
              icon: Users,
              title: "2-Tier Referral Tree",
              desc: "Earn secondary bonuses when your referrals invite others to join.",
            },
            {
              icon: TrendingUp,
              title: "Passive Growth",
              desc: "Automatically credit commissions straight into your active wallet.",
            },
          ].map((benefit, i) => (
            <div
              key={i}
              className={`p-4 ${
                darkMode ? "bg-zinc-800/50" : "bg-white"
              } rounded-xl`}
            >
              <benefit.icon
                className={`w-7 h-7 ${
                  darkMode ? "text-amber-400" : "text-amber-600"
                } mb-2`}
              />
              <h4
                className={`font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {benefit.title}
              </h4>
              <p
                className={`text-sm ${
                  darkMode ? "text-zinc-400" : "text-gray-500"
                } mt-1`}
              >
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReferralTab;
