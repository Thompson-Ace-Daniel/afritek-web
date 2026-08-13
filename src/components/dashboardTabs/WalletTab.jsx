// ==================== WALLET TAB ====================

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


export const WalletTab = ({ darkMode, user }) => {
  const [depositAmount, setDepositAmount] = useState("");
  const [depositDescription, setDepositDescription] = useState("Test deposit");

  const walletStats = [
    {
      label: "Available Balance",
      value: "₦245,000.00",
      icon: Wallet,
      color: "amber",
    },
    {
      label: "Total Referral Earnings",
      value: "₦12,800.00",
      icon: Gift,
      color: "green",
    },
    {
      label: "Total Invested",
      value: "₦680,000.00",
      icon: TrendingUpIcon,
      color: "purple",
    },
    {
      label: "Total Returns",
      value: "₦89,400.00",
      icon: DollarSign,
      color: "emerald",
    },
  ];

  const recentTransactions = [
    {
      id: 1,
      type: "deposit",
      amount: 50000,
      status: "completed",
      date: "Mar 15, 2025",
      description: "Manual Deposit",
    },
    {
      id: 2,
      type: "referral_bonus",
      amount: 2400,
      status: "completed",
      date: "Mar 14, 2025",
      description: "Referral Bonus - John Doe",
    },
    {
      id: 3,
      type: "withdrawal",
      amount: 10000,
      status: "pending",
      date: "Mar 12, 2025",
      description: "Withdrawal to Bank",
    },
    {
      id: 4,
      type: "investment",
      amount: 25000,
      status: "completed",
      date: "Mar 10, 2025",
      description: "AfriTek Seed Fund Investment",
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

  const typeColors = {
    deposit: darkMode
      ? "bg-green-500/20 text-green-400"
      : "bg-green-50 text-green-600",
    withdrawal: darkMode
      ? "bg-red-500/20 text-red-400"
      : "bg-red-50 text-red-600",
    referral_bonus: darkMode
      ? "bg-amber-500/20 text-amber-400"
      : "bg-amber-50 text-amber-600",
    investment: darkMode
      ? "bg-blue-500/20 text-blue-400"
      : "bg-blue-50 text-blue-600",
  };

  const typeIcons = {
    deposit: <ArrowDownRight className="w-4 h-4" />,
    withdrawal: <ArrowUpRight className="w-4 h-4" />,
    referral_bonus: <Gift className="w-4 h-4" />,
    investment: <TrendingUp className="w-4 h-4" />,
  };

  const handleDeposit = () => {
    if (depositAmount) {
      alert(`Deposit of ₦${depositAmount} initiated successfully!`);
      setDepositAmount("");
    } else {
      alert("Please enter an amount");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Wallet
          </h1>
          <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
            Manage your funds and transactions
          </p>
        </div>
        <button
          className={`px-4 py-2 ${
            darkMode
              ? "bg-zinc-800 hover:bg-zinc-700 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          } rounded-xl text-sm transition-colors flex items-center gap-2`}
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {walletStats.map((stat, index) => {
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className={`lg:col-span-1 ${darkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200"} border rounded-2xl p-6`}
        >
          <h3
            className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-4`}
          >
            Manual Deposit (Testing)
          </h3>
          <div className="space-y-4">
            <div>
              <label
                className={`text-sm font-medium ${darkMode ? "text-zinc-300" : "text-gray-700"} block mb-1.5`}
              >
                Amount (₦)
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Enter amount"
                className={`w-full ${
                  darkMode
                    ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                } border rounded-xl px-4 py-3 outline-none focus:border-amber-400 transition-colors`}
              />
            </div>
            <div>
              <label
                className={`text-sm font-medium ${darkMode ? "text-zinc-300" : "text-gray-700"} block mb-1.5`}
              >
                Description
              </label>
              <input
                type="text"
                value={depositDescription}
                onChange={(e) => setDepositDescription(e.target.value)}
                placeholder="Enter description"
                className={`w-full ${
                  darkMode
                    ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                } border rounded-xl px-4 py-3 outline-none focus:border-amber-400 transition-colors`}
              />
            </div>
            <button
              onClick={handleDeposit}
              className="w-full py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" /> Deposit
            </button>
          </div>
        </div>

        <div
          className={`lg:col-span-2 ${darkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200"} border rounded-2xl p-6`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Recent Transactions
            </h3>
            <button
              className={`text-sm ${darkMode ? "text-zinc-400 hover:text-white" : "text-gray-500 hover:text-gray-700"} transition-colors`}
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className={`flex items-center justify-between p-3 ${darkMode ? "bg-zinc-800/50" : "bg-gray-50"} rounded-xl`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${typeColors[tx.type]}`}>
                    {typeIcons[tx.type]}
                  </div>
                  <div>
                    <p className={darkMode ? "text-white" : "text-gray-900"}>
                      {tx.description}
                    </p>
                    <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
                      {tx.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${tx.type === "withdrawal" ? "text-red-500" : "text-green-500"}`}
                  >
                    {tx.type === "withdrawal" ? "-" : "+"}₦
                    {tx.amount.toLocaleString()}
                  </p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      tx.status === "completed"
                        ? darkMode
                          ? "bg-green-500/20 text-green-400"
                          : "bg-green-50 text-green-600"
                        : tx.status === "pending"
                          ? darkMode
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-amber-50 text-amber-600"
                          : darkMode
                            ? "bg-red-500/20 text-red-400"
                            : "bg-red-50 text-red-600"
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`${darkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200"} border rounded-2xl p-6`}
      >
        <h3
          className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-4`}
        >
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Upload, label: "Deposit", color: "green" },
            { icon: DownloadIcon, label: "Withdraw", color: "red" },
            { icon: Gift, label: "Referral Bonus", color: "amber" },
            { icon: Settings, label: "Settings", color: "blue" },
          ].map((action, i) => (
            <button
              key={i}
              className={`p-4 ${darkMode ? "bg-zinc-800/50 hover:bg-zinc-800" : "bg-gray-50 hover:bg-gray-100"} rounded-xl transition-colors text-center`}
            >
              <action.icon
                className={`w-6 h-6 mx-auto mb-2 text-${action.color}-500`}
              />
              <span
                className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
