// ==================== SUPPORT TAB ====================

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

export const SupportTab = ({ darkMode, user }) => {
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportCategory, setSupportCategory] = useState("general");

  const supportTickets = [
    {
      id: 1,
      subject: "Withdrawal Issue",
      status: "open",
      date: "Mar 14, 2025",
      category: "Finance",
    },
    {
      id: 2,
      subject: "Account Verification",
      status: "in-progress",
      date: "Mar 12, 2025",
      category: "Account",
    },
    {
      id: 3,
      subject: "Investment Inquiry",
      status: "resolved",
      date: "Mar 10, 2025",
      category: "Investment",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1
          className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
        >
          Support Center
        </h1>
        <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
          Get help with your account and investments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={`${
            darkMode
              ? "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
              : "bg-white border-gray-200 hover:shadow-lg"
          } border rounded-2xl p-6 text-center transition-all`}
        >
          <div
            className={`inline-flex p-4 rounded-xl ${darkMode ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-600"} mb-4`}
          >
            <Phone className="w-6 h-6" />
          </div>
          <h4 className={darkMode ? "text-white" : "text-gray-900"}>
            Phone Support
          </h4>
          <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
            Available 24/7
          </p>
          <p className="text-amber-500 font-semibold mt-2">+1 (800) 555-0199</p>
        </div>
        <div
          className={`${
            darkMode
              ? "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
              : "bg-white border-gray-200 hover:shadow-lg"
          } border rounded-2xl p-6 text-center transition-all`}
        >
          <div
            className={`inline-flex p-4 rounded-xl ${darkMode ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-600"} mb-4`}
          >
            <Mail className="w-6 h-6" />
          </div>
          <h4 className={darkMode ? "text-white" : "text-gray-900"}>
            Email Support
          </h4>
          <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
            Response within 24hrs
          </p>
          <p className="text-amber-500 font-semibold mt-2">
            support@afritek.com
          </p>
        </div>
      </div>

      <div
        className={`${darkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200"} border rounded-2xl p-6`}
      >
        <h3 className={darkMode ? "text-white" : "text-gray-900"}>
          Support Tickets
        </h3>
        {supportTickets.map((ticket) => (
          <div
            key={ticket.id}
            className={`flex items-center justify-between p-3 ${darkMode ? "bg-zinc-800/50" : "bg-gray-50"} rounded-xl mb-2`}
          >
            <div>
              <p className={darkMode ? "text-white" : "text-gray-900"}>
                {ticket.subject}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className={darkMode ? "text-zinc-400" : "text-gray-500"}>
                  {ticket.date}
                </span>
                <span className={darkMode ? "text-zinc-500" : "text-gray-400"}>
                  •
                </span>
                <span className={darkMode ? "text-zinc-400" : "text-gray-500"}>
                  {ticket.category}
                </span>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                ticket.status === "open"
                  ? darkMode
                    ? "bg-red-500/20 text-red-400 border-red-500/20"
                    : "bg-red-50 text-red-600 border-red-200"
                  : ticket.status === "in-progress"
                    ? darkMode
                      ? "bg-amber-500/20 text-amber-400 border-amber-500/20"
                      : "bg-amber-50 text-amber-600 border-amber-200"
                    : darkMode
                      ? "bg-green-500/20 text-green-400 border-green-500/20"
                      : "bg-green-50 text-green-600 border-green-200"
              }`}
            >
              {ticket.status}
            </span>
          </div>
        ))}
      </div>

      <div
        className={`${darkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200"} border rounded-2xl p-6`}
      >
        <h3 className={darkMode ? "text-white" : "text-gray-900"}>
          Submit a Ticket
        </h3>
        <form className="space-y-4 mt-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className={darkMode ? "text-zinc-400" : "text-gray-600"}>
              Subject
            </label>
            <input
              type="text"
              value={supportSubject}
              onChange={(e) => setSupportSubject(e.target.value)}
              placeholder="Brief description of your issue"
              className={`w-full ${
                darkMode
                  ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
              } border rounded-xl px-4 py-3 outline-none focus:border-amber-400 transition-colors`}
            />
          </div>
          <div>
            <label className={darkMode ? "text-zinc-400" : "text-gray-600"}>
              Category
            </label>
            <select
              value={supportCategory}
              onChange={(e) => setSupportCategory(e.target.value)}
              className={`w-full ${
                darkMode
                  ? "bg-zinc-800 border-zinc-700 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              } border rounded-xl px-4 py-3 outline-none focus:border-amber-400 transition-colors`}
            >
              <option value="general">General Inquiry</option>
              <option value="investment">Investment</option>
              <option value="account">Account</option>
              <option value="finance">Finance</option>
              <option value="technical">Technical</option>
            </select>
          </div>
          <div>
            <label className={darkMode ? "text-zinc-400" : "text-gray-600"}>
              Message
            </label>
            <textarea
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              placeholder="Describe your issue in detail..."
              rows={4}
              className={`w-full ${
                darkMode
                  ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
              } border rounded-xl px-4 py-3 outline-none focus:border-amber-400 transition-colors resize-none`}
            />
          </div>
          <button className="w-full px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /> Submit Ticket
          </button>
        </form>
      </div>
    </div>
  );
};
