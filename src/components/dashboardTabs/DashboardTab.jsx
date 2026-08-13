// ==================== DASHBOARD TAB ====================

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


export const DashboardTab = ({ darkMode, user, onBuyShares }) => {
  useEffect(() => {
    const load = async () => {
      try {
        const [sharesRes, walletRes, refRes] = await Promise.all([
          shareAPI.getInfo(),
          walletAPI.get(),
          referralAPI.getMyStats(),
        ]);
        setShareInfo(sharesRes.data.data);
        setWallet(walletRes.data.data);
        setReferral(refRes.data.data);
        await refreshUser();
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const userData = {
    name: user?.fullName || "Guest",
    tier: user?.role === "admin" ? "Gold Investor" : "Investor",
  };

  const stats = [
    {
      label: "Active Investments",
      value: "8",
      change: "+2",
      icon: TrendingUp,
      color: "amber",
    },
    {
      label: "Total Invested",
      value: "$12,800",
      change: "-$2,400",
      icon: DollarSign,
      color: "green",
    },
    {
      label: "Current Earnings",
      value: "$23,450",
      change: "+$5,200",
      icon: Wallet,
      color: "amber",
    },
    {
      label: "Available Balance",
      value: "$2,150",
      change: "+$150",
      icon: Briefcase,
      color: "purple",
    },
  ];

  const marketIndices = [
    { name: "MOX All Shares", value: "102,345.67", change: "+1.2%" },
    { name: "MOX 30", value: "3,890.12", change: "+0.5%" },
    { name: "Banking Index", value: "876.45", change: "+2.7%" },
    { name: "Insurance Index", value: "345.90", change: "+0.8%" },
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
    emerald: darkMode
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : "bg-emerald-50 text-emerald-600 border-emerald-200",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
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
              className={`text-sm font-semibold ${darkMode ? "text-amber-400" : "text-amber-600"}`}
            >
              {userData.tier}
            </span>
          </div>
          <button
            onClick={onBuyShares}
            className="px-4 py-2 bg-amber-500 text-white font-semibold rounded-xl text-sm hover:bg-amber-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Buy Shares
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change.startsWith("+");
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
                    className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mt-1`}
                  >
                    {stat.value}
                  </p>
                  <p
                    className={`text-xs font-medium mt-1 ${isPositive ? "text-green-500" : "text-red-500"}`}
                  >
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

      <div
        className={`${darkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200"} border rounded-2xl p-6`}
      >
        <h3 className={darkMode ? "text-white" : "text-gray-900"}>
          Market Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {marketIndices.map((index, i) => (
            <div
              key={i}
              className={`p-4 ${darkMode ? "bg-zinc-800/50" : "bg-gray-50"} rounded-xl`}
            >
              <p
                className={`text-xs font-medium ${darkMode ? "text-zinc-400" : "text-gray-500"}`}
              >
                {index.name}
              </p>
              <p
                className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"} mt-1`}
              >
                {index.value}
              </p>
              <p
                className={`text-xs font-semibold ${index.change.startsWith("+") ? "text-green-500" : "text-amber-500"}`}
              >
                {index.change}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`${darkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200"} border rounded-2xl p-6`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className={darkMode ? "text-white" : "text-gray-900"}>
              Investor Tier Progress
            </h3>
            <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
              You're at {userData.tier} level
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Crown className="w-4 h-4 text-amber-500" />
            <span className={darkMode ? "text-zinc-300" : "text-gray-700"}>
              Next: Platinum Investor
            </span>
            <span className="text-amber-500 font-bold">$500,000</span>
          </div>
        </div>
        <div className="relative">
          <div
            className={`h-3 ${darkMode ? "bg-zinc-800" : "bg-gray-200"} rounded-full overflow-hidden`}
          >
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-1000"
              style={{ width: "65%" }}
            />
          </div>
          <div
            className={`flex justify-between mt-2 text-xs ${darkMode ? "text-zinc-500" : "text-gray-400"}`}
          >
            <span>Starter</span>
            <span>Silver</span>
            <span>Gold</span>
            <span>Platinum</span>
            <span>Diamond</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
          {["Starter", "Silver", "Gold", "Platinum", "Diamond"].map(
            (tier, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-xl text-center text-xs font-medium ${
                  i <= 2
                    ? darkMode
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/20"
                      : "bg-amber-50 text-amber-600 border border-amber-200"
                    : darkMode
                      ? "bg-zinc-800/50 text-zinc-500"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {tier}
                {i <= 2 && (
                  <CheckCircle
                    className={`w-3 h-3 inline ml-1 ${darkMode ? "text-amber-400" : "text-amber-600"}`}
                  />
                )}
              </div>
            ),
          )}
        </div>
      </div>

      <div
        className={`${darkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200"} border rounded-2xl p-6`}
      >
        <h3 className={darkMode ? "text-white" : "text-gray-900"}>
          Equity Partner Advantages
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {[
            {
              icon: Shield,
              title: "Fractional Equity",
              desc: "Own fractional equity in sovereign Web3 hardware built on steel & silicon",
            },
            {
              icon: Smartphone,
              title: "Early Access",
              desc: "Early access to AfriTek Phone Pro fleet allocations",
            },
            {
              icon: Crown,
              title: "Priority Allocation",
              desc: "Priority allocation on AfriTek Phone Pro units",
            },
            {
              icon: BarChart3,
              title: "On-Chain Earnings",
              desc: "Web3-integrated earnings tracked on-chain",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-4 ${
                darkMode
                  ? "bg-zinc-800/50 hover:bg-zinc-800"
                  : "bg-gray-50 hover:bg-amber-50"
              } rounded-xl transition-colors`}
            >
              <div
                className={`p-2 rounded-lg ${
                  darkMode
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-amber-100 text-amber-600"
                } flex-shrink-0`}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h4
                  className={`font-medium text-sm ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  {item.title}
                </h4>
                <p
                  className={`text-xs mt-0.5 ${darkMode ? "text-zinc-400" : "text-gray-500"}`}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
