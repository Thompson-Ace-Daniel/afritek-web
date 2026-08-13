// ==================== REFERRAL TAB ====================

import React, { useState, useEffect } from "react";
import {
  Award,
  TrendingUp,
  DollarSign,
  Shield,
  Plus,
  Filter,
  Download,
  CheckCircle,
  Crown,
  Clock,
  Percent,
  Briefcase,
  Wallet,
  Activity,
  Phone,
  Mail,
  Send,
  Edit,
  Save,
  BarChart3,
  Smartphone,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  X,
  Minus,
  Zap,
  User,
  Key,
  AlertTriangle,
  Copy,
  Users,
  Gift,
  Calendar,
  ChevronRight,
  Eye,
  EyeOff,
  Upload,
  Download as DownloadIcon,
  RefreshCw,
  Settings,
  CreditCard,
  Banknote,
  PiggyBank,
  TrendingUp as TrendingUpIcon,
  TrendingDown,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { useForm } from "react-hook-form";
import { shareAPI, walletAPI, referralAPI } from "../../api/utils.api.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { updateProfileSchema } from "../../utils/validation.js";
import SuccessAlert from "../SuccessAlert.jsx";
import ErrorAlert from "../ErrorAlert.jsx";


export const ReferralTab = ({ darkMode, user }) => {
  const [copied, setCopied] = useState(false);
  const referralLink = "http://localhost:3000/signup?ref=AFRITEK2025";
  const referralCode = "AFRITEK2025";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referralStats = [
    {
      label: "Direct Referrals",
      value: "0",
      icon: Users,
      color: "blue",
    },
    {
      label: "2nd Level",
      value: "0",
      icon: Users,
      color: "purple",
    },
    {
      label: "Total Earnings",
      value: "₦0.00",
      icon: Gift,
      color: "amber",
    },
    {
      label: "Wallet Balance",
      value: "₦0.00",
      icon: Wallet,
      color: "green",
    },
  ];

  const referralHistory = [
    {
      id: 1,
      name: "John Doe",
      level: 1,
      amount: 1500,
      date: "Mar 15, 2025",
      status: "completed",
    },
    {
      id: 2,
      name: "Jane Smith",
      level: 1,
      amount: 2300,
      date: "Mar 12, 2025",
      status: "pending",
    },
    {
      id: 3,
      name: "Mike Johnson",
      level: 2,
      amount: 800,
      date: "Mar 10, 2025",
      status: "completed",
    },
  ];

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            My Referrals
          </h1>
          <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
            Invite friends and earn rewards
          </p>
        </div>
        <div
          className={`flex items-center gap-2 px-4 py-2 border rounded-xl ${
            darkMode
              ? "bg-amber-500/10 border-amber-500/20"
              : "bg-amber-50 border-amber-200"
          }`}
        >
          <Award className={darkMode ? "text-amber-400" : "text-amber-600"} />
          <span
            className={`text-sm font-semibold ${darkMode ? "text-amber-400" : "text-amber-600"}`}
          >
            Level 1: 15% · Level 2: 5%
          </span>
        </div>
      </div>

      <div
        className={`${darkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200"} border rounded-2xl p-6`}
      >
        <h3
          className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-4`}
        >
          Your Referral Link
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div
            className={`flex-1 flex items-center gap-3 px-4 py-3 ${darkMode ? "bg-zinc-800 border-zinc-700" : "bg-gray-50 border-gray-200"} border rounded-xl`}
          >
            <span className={darkMode ? "text-zinc-400" : "text-gray-500"}>
              {referralLink}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className={`px-6 py-3 ${
              darkMode
                ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                : "bg-amber-100 text-amber-600 hover:bg-amber-200"
            } rounded-xl transition-colors flex items-center gap-2`}
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
        <div className="mt-3">
          <p
            className={`text-sm ${darkMode ? "text-zinc-400" : "text-gray-500"}`}
          >
            Code:{" "}
            <span
              className={`font-mono font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              {referralCode}
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {referralStats.map((stat, index) => {
          const Icon = stat.icon;
          const bgMap = darkMode
            ? "bg-zinc-900/50 border-zinc-800"
            : "bg-white border-gray-200";
          return (
            <div
              key={index}
              className={`${bgMap} border rounded-2xl p-6 hover:${darkMode ? "border-zinc-700" : "shadow-lg"} transition-all`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
                    {stat.label}
                  </p>
                  <p
                    className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mt-1`}
                  >
                    {stat.value}
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

      <div
        className={`${darkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200"} border rounded-2xl p-6`}
      >
        <h3
          className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-4`}
        >
          Commission Rates
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`p-4 ${darkMode ? "bg-zinc-800/50" : "bg-gray-50"} rounded-xl text-center`}
          >
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg">
              1
            </div>
            <p
              className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mt-2`}
            >
              15%
            </p>
            <p
              className={`text-sm ${darkMode ? "text-zinc-400" : "text-gray-500"}`}
            >
              Level 1 Commission
            </p>
          </div>
          <div
            className={`p-4 ${darkMode ? "bg-zinc-800/50" : "bg-gray-50"} rounded-xl text-center`}
          >
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
              2
            </div>
            <p
              className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mt-2`}
            >
              5%
            </p>
            <p
              className={`text-sm ${darkMode ? "text-zinc-400" : "text-gray-500"}`}
            >
              Level 2 Commission
            </p>
          </div>
        </div>
      </div>

      <div
        className={`${darkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200"} border rounded-2xl p-6`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Referral History
          </h3>
          <button
            className={`text-sm ${darkMode ? "text-zinc-400 hover:text-white" : "text-gray-500 hover:text-gray-700"} transition-colors`}
          >
            View All
          </button>
        </div>
        {referralHistory.length > 0 ? (
          <div className="space-y-3">
            {referralHistory.map((ref) => (
              <div
                key={ref.id}
                className={`flex items-center justify-between p-3 ${darkMode ? "bg-zinc-800/50" : "bg-gray-50"} rounded-xl`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${darkMode ? "bg-zinc-700" : "bg-gray-200"} flex items-center justify-center font-bold ${darkMode ? "text-white" : "text-gray-700"}`}
                  >
                    {ref.name.charAt(0)}
                  </div>
                  <div>
                    <p className={darkMode ? "text-white" : "text-gray-900"}>
                      {ref.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          darkMode
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        Level {ref.level}
                      </span>
                      <span
                        className={darkMode ? "text-zinc-400" : "text-gray-500"}
                      >
                        {ref.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${darkMode ? "text-green-400" : "text-green-500"}`}
                  >
                    +₦{ref.amount.toLocaleString()}
                  </p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      ref.status === "completed"
                        ? darkMode
                          ? "bg-green-500/20 text-green-400"
                          : "bg-green-50 text-green-600"
                        : darkMode
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {ref.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users
              className={`w-12 h-12 ${darkMode ? "text-zinc-700" : "text-gray-300"} mx-auto mb-3`}
            />
            <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
              No referrals yet
            </p>
            <p
              className={`text-sm ${darkMode ? "text-zinc-500" : "text-gray-400"} mt-1`}
            >
              Share your referral link to start earning
            </p>
          </div>
        )}
      </div>

      <div
        className={`${darkMode ? "bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20" : "bg-gradient-to-br from-amber-50 to-transparent border-amber-200"} border rounded-2xl p-6`}
      >
        <h3
          className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-4`}
        >
          Referral Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Gift,
              title: "Earn Commissions",
              desc: "Earn up to 15% commission on every referral's investment",
            },
            {
              icon: Users,
              title: "Build Your Network",
              desc: "Grow your network and unlock exclusive rewards",
            },
            {
              icon: TrendingUpIcon,
              title: "Passive Income",
              desc: "Earn recurring commissions from your referrals' activity",
            },
          ].map((benefit, i) => (
            <div
              key={i}
              className={`p-4 ${darkMode ? "bg-zinc-800/50" : "bg-white"} rounded-xl`}
            >
              <benefit.icon
                className={`w-8 h-8 ${darkMode ? "text-amber-400" : "text-amber-600"} mb-2`}
              />
              <h4
                className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                {benefit.title}
              </h4>
              <p
                className={`text-sm ${darkMode ? "text-zinc-400" : "text-gray-500"} mt-1`}
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
