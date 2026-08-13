// ==================== PORTFOLIO TAB ====================

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
import { shareAPI, walletAPI, referralAPI } from "../../api/auth.api.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { updateProfileSchema } from "../../utils/validation.js";
import SuccessAlert from "../SuccessAlert.jsx";
import ErrorAlert from "../ErrorAlert.jsx";


export const PortfolioTab = ({ darkMode, user }) => {
  const investments = [
    {
      id: 1,
      name: "AfriTek Seed Fund",
      amount: 50000,
      returns: 12400,
      status: "active",
      date: "Jan 15, 2025",
      yield: 24.8,
      icon: TrendingUp,
    },
    {
      id: 2,
      name: "Tech Infrastructure",
      amount: 35000,
      returns: 8200,
      status: "active",
      date: "Feb 1, 2025",
      yield: 23.4,
      icon: Shield,
    },
    {
      id: 3,
      name: "DeFi Protocol",
      amount: 25000,
      returns: 4200,
      status: "pending",
      date: "Mar 10, 2025",
      yield: 16.8,
      icon: Activity,
    },
    {
      id: 4,
      name: "AI Research Lab",
      amount: 15000,
      returns: 1800,
      status: "completed",
      date: "Dec 5, 2024",
      yield: 12.0,
      icon: Activity,
    },
  ];

  const commissions = [
    {
      id: 1,
      amount: 1500,
      source: "Referral - John Doe",
      date: "Mar 14, 2025",
      status: "pending",
    },
    {
      id: 2,
      amount: 2300,
      source: "Referral - Jane Smith",
      date: "Mar 10, 2025",
      status: "paid",
    },
    {
      id: 3,
      amount: 800,
      source: "Referral - Mike Johnson",
      date: "Mar 5, 2025",
      status: "paid",
    },
  ];

  const statusColors = {
    active: darkMode
      ? "bg-green-500/20 text-green-400 border-green-500/20"
      : "bg-green-50 text-green-600 border-green-200",
    pending: darkMode
      ? "bg-amber-500/20 text-amber-400 border-amber-500/20"
      : "bg-amber-50 text-amber-600 border-amber-200",
    completed: darkMode
      ? "bg-blue-500/20 text-blue-400 border-blue-500/20"
      : "bg-blue-50 text-blue-600 border-blue-200",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Portfolio
          </h1>
          <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
            Your investments and commission earnings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className={`px-4 py-2 ${
              darkMode
                ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            } rounded-xl text-sm transition-colors flex items-center gap-2`}
          >
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="px-4 py-2 bg-amber-500 text-white font-semibold rounded-xl text-sm hover:bg-amber-600 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {investments.map((inv) => {
          const Icon = inv.icon;
          return (
            <div
              key={inv.id}
              className={`${
                darkMode
                  ? "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                  : "bg-white border-gray-200 hover:shadow-lg"
              } border rounded-2xl p-6 transition-all`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${darkMode ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-600"}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={darkMode ? "text-white" : "text-gray-900"}>
                      {inv.name}
                    </h4>
                    <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
                      {inv.date}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[inv.status]}`}
                >
                  {inv.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
                    Amount
                  </p>
                  <p className={darkMode ? "text-white" : "text-gray-900"}>
                    ${inv.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
                    Returns
                  </p>
                  <p className="text-green-500 font-semibold">
                    ${inv.returns.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
                    Yield
                  </p>
                  <p className="text-amber-500 font-semibold">{inv.yield}%</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={`${darkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200"} border rounded-2xl p-6`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className={darkMode ? "text-white" : "text-gray-900"}>
            Commission Earnings
          </h3>
          <span className="text-amber-500 font-bold">$4,600 Total</span>
        </div>
        <div className="space-y-3">
          {commissions.map((comm) => (
            <div
              key={comm.id}
              className={`flex items-center justify-between p-3 ${darkMode ? "bg-zinc-800/50" : "bg-gray-50"} rounded-xl`}
            >
              <div>
                <p className={darkMode ? "text-white" : "text-gray-900"}>
                  {comm.source}
                </p>
                <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
                  {comm.date}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-500 font-semibold">
                  +${comm.amount.toLocaleString()}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    comm.status === "paid"
                      ? darkMode
                        ? "bg-green-500/20 text-green-400"
                        : "bg-green-50 text-green-600"
                      : darkMode
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {comm.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
