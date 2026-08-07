import React, { useState } from "react";
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
  XCircle,
  AlertTriangle,
  User,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { updateProfileSchema } from "../../utils/validation";
import Input from "../../components/Input";
import Button from "../../components/Button";
import ErrorAlert from "../../components/ErrorAlert";
import SuccessAlert from "../../components/SuccessAlert";
import DeleteAccountModal from "../../components/DeleteAccountModal";

// ==================== OVERVIEW TAB ====================
export const OverviewTab = ({ darkMode, user }) => {
  const userData = {
    name: user?.fullName || "John AfriTek",
    tier: user?.role === "admin" ? "Gold Investor" : "Investor",
  };

  const stats = [
    {
      label: "Total Invested",
      value: "$245,000",
      change: "+12.5%",
      icon: TrendingUp,
      color: "amber",
    },
    {
      label: "Total Returns",
      value: "$68,400",
      change: "+8.2%",
      icon: DollarSign,
      color: "green",
    },
    {
      label: "ROI",
      value: "27.9%",
      change: "+3.1%",
      icon: Percent,
      color: "amber",
    },
    {
      label: "Active Investments",
      value: "8",
      change: "+2",
      icon: Briefcase,
      color: "purple",
    },
    {
      label: "Pending Returns",
      value: "$12,800",
      change: "-$2,400",
      icon: Clock,
      color: "orange",
    },
    {
      label: "Account Balance",
      value: "$23,450",
      change: "+$5,200",
      icon: Wallet,
      color: "emerald",
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
    emerald: darkMode
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : "bg-emerald-50 text-emerald-600 border-emerald-200",
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Good morning, {userData.name}
          </h1>
          <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
            Here's your investment overview
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
          <button className="px-4 py-2 bg-amber-500 text-white font-semibold rounded-xl text-sm hover:bg-amber-600 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Invest Now
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Investor Tier Progress */}
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

      {/* Partner Advantages */}
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

// ==================== PORTFOLIO TAB ====================
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
      ? "bg-amber-500/20 text-amber-400 border-amber-500/20"
      : "bg-amber-50 text-amber-600 border-amber-200",
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
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="px-4 py-2 bg-amber-500 text-white font-semibold rounded-xl text-sm hover:bg-amber-600 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Investment Cards */}
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

      {/* Commissions */}
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

// ==================== DIVIDENDS TAB ====================
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

      {/* Balance Card */}
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
              <Clock className="w-4 h-4" />
              History
            </button>
          </div>
        </div>
      </div>

      {/* Transaction History */}
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
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-amber-50 text-amber-600"
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
                        : "text-amber-500"
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
            <p className={darkMode ? "text-zinc-500" : "text-gray-400"}>
              Your dividend transactions will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== SUPPORT TAB ====================
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

      {/* Contact Cards */}
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

      {/* Support Tickets */}
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

      {/* Ticket Form */}
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
            <Send className="w-4 h-4" />
            Submit Ticket
          </button>
        </form>
      </div>
    </div>
  );
};

// ==================== PROFILE TAB ====================
export const ProfileTab = () => {
  const { user, updateProfile, deleteAccount, sendEmailVerification } =
    useAuth();
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [sendingVerify, setSendingVerify] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      phone: user?.phone || "",
    },
  });

  const onSubmit = async (data) => {
    setServerError(null);
    setSuccessMessage(null);
    setSubmitting(true);
    try {
      await updateProfile({
        fullName: data.fullName.trim(),
        phone: data.phone?.trim() || null,
      });
      setSuccessMessage("Profile updated successfully.");
      toast.success("Profile updated");
    } catch (err) {
      setServerError({
        message: err.message || "Failed to update profile.",
        errors: err.errors,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );
    if (!confirmed) return;

    setDeleting(true);
    setServerError(null);
    try {
      await deleteAccount();
      toast.success("Account deleted");
      window.location.href = "/login";
    } catch (err) {
      setServerError({
        message: err.message || "Failed to delete account.",
        errors: err.errors,
      });
      setDeleting(false);
    }
  };

  const handleSendVerification = async () => {
    setSendingVerify(true);
    setServerError(null);
    try {
      const response = await sendEmailVerification();
      setSuccessMessage(
        response?.message || "Verification email sent. Check your inbox.",
      );
      toast.success("Verification email sent");
    } catch (err) {
      setServerError({
        message: err.message || "Could not send verification email.",
        errors: err.errors,
      });
    } finally {
      setSendingVerify(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your account information
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-surface-900/60 p-5 sm:p-6">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-600/20 text-lg font-bold text-amber-400">
            {(user?.fullName || user?.email || "?").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-white">
              {user?.fullName || "User"}
            </p>
            <p className="truncate text-sm text-slate-400">{user?.email}</p>
          </div>
          <div className="ml-auto flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300">
              <Shield className="h-3 w-3" aria-hidden="true" />
              {user?.role || "user"}
            </span>
            {user?.isVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-400">
                <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-400">
                Unverified
              </span>
            )}
          </div>
        </div>

        {serverError && (
          <div className="mb-4">
            <ErrorAlert
              message={serverError.message}
              errors={serverError.errors}
              onClose={() => setServerError(null)}
            />
          </div>
        )}

        {successMessage && (
          <div className="mb-4">
            <SuccessAlert
              message={successMessage}
              onClose={() => setSuccessMessage(null)}
            />
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <Input
            label="Email"
            type="email"
            value={user?.email || ""}
            disabled
            leftIcon={<Mail className="h-4 w-4" />}
            hint="Email cannot be changed"
          />

          <Input
            label="Full name"
            required
            leftIcon={<User className="h-4 w-4" />}
            error={errors.fullName?.message}
            {...register("fullName")}
          />

          <Input
            label="Phone"
            type="tel"
            leftIcon={<Phone className="h-4 w-4" />}
            error={errors.phone?.message}
            {...register("phone")}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit" loading={submitting} disabled={!isDirty}>
              Save changes
            </Button>

            {!user?.isVerified && (
              <Button
                type="button"
                variant="outline"
                loading={sendingVerify}
                onClick={handleSendVerification}
              >
                Send verification email
              </Button>
            )}
            <Button
              variant="primary"
              onClick={() => (window.location.href = "/change-password")}
            >
              Change Password
            </Button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-red-300">Danger zone</h2>
        <p className="mt-1 text-sm text-slate-400">
          Permanently delete your account and all associated data. This cannot
          be undone.
        </p>
        <Button
          variant="danger"
          className="mt-4"
          loading={deleting}
          onClick={handleDelete}
        >
          Delete account
        </Button>
      </div>
    </div>
  );
};
