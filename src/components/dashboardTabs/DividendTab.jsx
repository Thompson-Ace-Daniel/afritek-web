// ==================== DIVIDENDS TAB ====================

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


export const DividendsTab = ({ darkMode, user }) => {
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const dividendTransactions = [
    {
      id: 1,
      amount: 2400,
      type: "dividend",
      status: "completed",
      date: "Mar 15, 2025",
      description: "Q1 2025 Dividend Distribution",
    },
    {
      id: 2,
      amount: 5000,
      type: "withdrawal",
      status: "pending",
      date: "Mar 12, 2025",
      description: "Withdrawal to USDC Wallet",
    },
    {
      id: 3,
      amount: 1200,
      type: "dividend",
      status: "completed",
      date: "Feb 15, 2025",
      description: "February Dividend Distribution",
    },
    {
      id: 4,
      amount: 3800,
      type: "dividend",
      status: "completed",
      date: "Jan 15, 2025",
      description: "January Dividend Distribution",
    },
    {
      id: 5,
      amount: 2000,
      type: "withdrawal",
      status: "failed",
      date: "Jan 10, 2025",
      description: "Withdrawal - Insufficient Balance",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Dividends
          </h1>
          <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
            Manage your dividend earnings
          </p>
        </div>
      </div>

      <div
        className={`bg-gradient-to-br ${
          darkMode
            ? "from-amber-500/10 via-amber-600/5 to-transparent border-amber-500/20"
            : "from-amber-50 via-amber-100/5 to-white border-amber-200"
        } border rounded-2xl p-8`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
              Available Balance
            </p>
            <p
              className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              $23,450
            </p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-green-500 text-sm">
                +$12,800 this quarter
              </span>
              <span className={darkMode ? "text-zinc-500" : "text-gray-400"}>
                Total Earned: $68,400
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div
              className={`flex items-center gap-2 ${
                darkMode
                  ? "bg-zinc-800/50 border-zinc-700"
                  : "bg-white border-gray-200"
              } rounded-xl px-4 py-2 border`}
            >
              <input
                type="text"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Amount"
                className={`bg-transparent ${
                  darkMode
                    ? "text-white placeholder:text-zinc-500"
                    : "text-gray-900 placeholder:text-gray-400"
                } w-24 outline-none text-sm`}
              />
              <button className="px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg text-sm hover:bg-amber-600 transition-colors">
                Withdraw
              </button>
            </div>
            <button
              className={`px-4 py-2 ${
                darkMode
                  ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              } rounded-xl text-sm transition-colors flex items-center gap-2`}
            >
              <Clock className="w-4 h-4" /> History
            </button>
          </div>
        </div>
      </div>

      <div
        className={`${darkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200"} border rounded-2xl p-6`}
      >
        <h3 className={darkMode ? "text-white" : "text-gray-900"}>
          Transaction History
        </h3>
        {dividendTransactions.length > 0 ? (
          <div className="space-y-3 mt-4">
            {dividendTransactions.map((tx) => (
              <div
                key={tx.id}
                className={`flex items-center justify-between p-3 ${darkMode ? "bg-zinc-800/50" : "bg-gray-50"} rounded-xl`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${
                      tx.type === "dividend"
                        ? darkMode
                          ? "bg-green-500/10 text-green-400"
                          : "bg-green-50 text-green-600"
                        : darkMode
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {tx.type === "dividend" ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
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
                <div className="flex items-center gap-3">
                  <span
                    className={`font-semibold ${
                      tx.type === "dividend"
                        ? "text-green-500"
                        : "text-blue-500"
                    }`}
                  >
                    {tx.type === "dividend" ? "+" : "-"}$
                    {tx.amount.toLocaleString()}
                  </span>
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
        ) : (
          <div className="text-center py-12">
            <Wallet
              className={`w-12 h-12 ${darkMode ? "text-zinc-700" : "text-gray-300"} mx-auto mb-4`}
            />
            <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
              No transactions yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
