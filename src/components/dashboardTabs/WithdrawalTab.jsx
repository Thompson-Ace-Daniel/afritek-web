// ==================== WITHDRAWALS TAB ====================

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


export const WithdrawalsTab = ({ darkMode, user }) => {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [bankName, setBankName] = useState("GTBank");

  const withdrawals = [
    {
      id: 1,
      amount: 10000,
      status: "pending",
      date: "Mar 12, 2025",
      account: "GTBank - ****5678",
    },
    {
      id: 2,
      amount: 25000,
      status: "completed",
      date: "Mar 5, 2025",
      account: "GTBank - ****5678",
    },
    {
      id: 3,
      amount: 5000,
      status: "failed",
      date: "Feb 28, 2025",
      account: "GTBank - ****5678",
    },
  ];

  const handleSubmit = () => {
    if (withdrawAmount && accountName && accountNumber && bankCode) {
      alert(`Withdrawal of ₦${withdrawAmount} submitted successfully!`);
      setWithdrawAmount("");
      setAccountName("");
      setAccountNumber("");
      setBankCode("");
    } else {
      alert("Please fill in all required fields");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Withdrawals
          </h1>
          <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
            Request and track your withdrawals
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div
          className={`lg:col-span-3 ${darkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200"} border rounded-2xl p-6`}
        >
          <h3
            className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-4`}
          >
            Request Withdrawal
          </h3>
          <form className="space-y-4">
            <div>
              <label
                className={`text-sm font-medium ${darkMode ? "text-zinc-300" : "text-gray-700"} block mb-1.5`}
              >
                Amount (₦) <span className="text-amber-500">*</span>
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
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
                Account Name <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Enter account name"
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
                Account Number <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter account number"
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
                Bank Code <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
                placeholder="e.g. 058"
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
                Bank Name (optional)
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Enter bank name"
                className={`w-full ${
                  darkMode
                    ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                } border rounded-xl px-4 py-3 outline-none focus:border-amber-400 transition-colors`}
              />
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4" /> Submit Request
            </button>
          </form>
        </div>

        <div
          className={`lg:col-span-2 ${darkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200"} border rounded-2xl p-6`}
        >
          <h3
            className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-4`}
          >
            My Withdrawals
          </h3>
          {withdrawals.length > 0 ? (
            <div className="space-y-3">
              {withdrawals.map((w) => (
                <div
                  key={w.id}
                  className={`p-4 ${darkMode ? "bg-zinc-800/50" : "bg-gray-50"} rounded-xl`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      ₦{w.amount.toLocaleString()}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        w.status === "completed"
                          ? darkMode
                            ? "bg-green-500/20 text-green-400"
                            : "bg-green-50 text-green-600"
                          : w.status === "pending"
                            ? darkMode
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-amber-50 text-amber-600"
                            : darkMode
                              ? "bg-red-500/20 text-red-400"
                              : "bg-red-50 text-red-600"
                      }`}
                    >
                      {w.status}
                    </span>
                  </div>
                  <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
                    {w.account}
                  </p>
                  <p
                    className={`text-xs ${darkMode ? "text-zinc-500" : "text-gray-400"} mt-1`}
                  >
                    {w.date}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Wallet
                className={`w-12 h-12 ${darkMode ? "text-zinc-700" : "text-gray-300"} mx-auto mb-3`}
              />
              <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
                No withdrawals yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
