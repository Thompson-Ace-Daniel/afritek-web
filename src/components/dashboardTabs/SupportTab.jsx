// ==================== SUPPORT TAB ====================

import React, { useState } from "react";
import {
  Phone,
  Mail,
  Send,
  Loader2,
  LifeBuoy,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import SuccessAlert from "../SuccessAlert.jsx";

export const SupportTab = ({ darkMode, user }) => {
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportCategory, setSupportCategory] = useState("general");

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Initialized empty for production / live data fetching
  const [supportTickets, setSupportTickets] = useState([]);

  const handleSubmitTicket = async (e) => {
    e.preventDefault();

    if (!supportSubject.trim() || !supportMessage.trim()) {
      toast.error("Please fill in both subject and message");
      return;
    }

    setSubmitting(true);
    setSuccessMessage("");

    try {
      // TODO: Connect to backend when support endpoint is ready
      // await supportAPI.createTicket({ subject: supportSubject, message: supportMessage, category: supportCategory });

      // Simulated delayed API response
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newTicket = {
        id: Date.now(),
        subject: supportSubject,
        status: "open",
        date: "Just now",
        category:
          supportCategory.charAt(0).toUpperCase() + supportCategory.slice(1),
      };

      setSupportTickets((prev) => [newTicket, ...prev]);
      setSuccessMessage(
        "Your support ticket has been submitted successfully! Our team will respond shortly.",
      );
      toast.success("Support ticket submitted!");

      // Reset form
      setSupportSubject("");
      setSupportMessage("");
      setSupportCategory("general");
    } catch (err) {
      toast.error("Failed to submit ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "open":
        return {
          icon: AlertCircle,
          label: "Open",
          className: darkMode
            ? "bg-red-500/20 text-red-400 border-red-500/20"
            : "bg-red-50 text-red-600 border-red-200",
        };
      case "in-progress":
        return {
          icon: Clock,
          label: "In Progress",
          className: darkMode
            ? "bg-amber-500/20 text-amber-400 border-amber-500/20"
            : "bg-amber-50 text-amber-600 border-amber-200",
        };
      case "resolved":
      default:
        return {
          icon: CheckCircle2,
          label: "Resolved",
          className: darkMode
            ? "bg-green-500/20 text-green-400 border-green-500/20"
            : "bg-green-50 text-green-600 border-green-200",
        };
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Support Center
        </h1>
        <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
          Get help with your account and investments
        </p>
      </div>

      {/* Support Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={`${
            darkMode
              ? "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
              : "bg-white border-gray-200 hover:shadow-lg"
          } border rounded-2xl p-6 text-center transition-all`}
        >
          <div
            className={`inline-flex p-4 rounded-xl ${
              darkMode
                ? "bg-amber-500/10 text-amber-400"
                : "bg-amber-50 text-amber-600"
            } mb-4`}
          >
            <Phone className="w-6 h-6" />
          </div>
          <h4
            className={`font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Phone Support
          </h4>
          <p
            className={`text-sm ${
              darkMode ? "text-zinc-400" : "text-gray-500"
            } mt-1`}
          >
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
            className={`inline-flex p-4 rounded-xl ${
              darkMode
                ? "bg-amber-500/10 text-amber-400"
                : "bg-amber-50 text-amber-600"
            } mb-4`}
          >
            <Mail className="w-6 h-6" />
          </div>
          <h4
            className={`font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Email Support
          </h4>
          <p
            className={`text-sm ${
              darkMode ? "text-zinc-400" : "text-gray-500"
            } mt-1`}
          >
            Response within 24hrs
          </p>
          <p className="text-amber-500 font-semibold mt-2">
            support@afritek.com
          </p>
        </div>
      </div>

      {/* Support Tickets List */}
      <div
        className={`${
          darkMode
            ? "bg-zinc-900/50 border-zinc-800"
            : "bg-white border-gray-200"
        } border rounded-2xl p-6`}
      >
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-amber-500" />
          <h3
            className={`text-lg font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Recent Support Tickets
          </h3>
        </div>

        {supportTickets.length > 0 ? (
          <div className="space-y-3">
            {supportTickets.map((ticket) => {
              const badge = getStatusBadge(ticket.status);
              const BadgeIcon = badge.icon;

              return (
                <div
                  key={ticket.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 ${
                    darkMode ? "bg-zinc-800/50" : "bg-gray-50"
                  } rounded-xl gap-2 border ${
                    darkMode ? "border-zinc-800" : "border-gray-100"
                  }`}
                >
                  <div>
                    <p
                      className={`font-medium text-sm ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {ticket.subject}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <span
                        className={darkMode ? "text-zinc-400" : "text-gray-500"}
                      >
                        {ticket.date}
                      </span>
                      <span
                        className={darkMode ? "text-zinc-600" : "text-gray-300"}
                      >
                        •
                      </span>
                      <span
                        className={darkMode ? "text-zinc-400" : "text-gray-500"}
                      >
                        {ticket.category}
                      </span>
                    </div>
                  </div>

                  <div className="self-start sm:self-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${badge.className}`}
                    >
                      <BadgeIcon className="w-3.5 h-3.5" />
                      {badge.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <LifeBuoy
              className={`w-10 h-10 ${
                darkMode ? "text-zinc-700" : "text-gray-300"
              } mx-auto mb-2`}
            />
            <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
              No support tickets submitted yet.
            </p>
            <p
              className={`text-xs ${
                darkMode ? "text-zinc-500" : "text-gray-400"
              } mt-1`}
            >
              Submitted tickets will appear here automatically.
            </p>
          </div>
        )}
      </div>

      {/* Submit Ticket Form */}
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
          Submit a Ticket
        </h3>

        {successMessage && (
          <div className="mb-4">
            <SuccessAlert
              message={successMessage}
              onClose={() => setSuccessMessage("")}
            />
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmitTicket}>
          <div>
            <label
              className={`block text-xs font-semibold mb-1.5 ${
                darkMode ? "text-zinc-400" : "text-gray-600"
              }`}
            >
              Subject
            </label>
            <input
              type="text"
              value={supportSubject}
              onChange={(e) => setSupportSubject(e.target.value)}
              placeholder="Brief description of your issue"
              required
              className={`w-full ${
                darkMode
                  ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
              } border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors`}
            />
          </div>

          <div>
            <label
              className={`block text-xs font-semibold mb-1.5 ${
                darkMode ? "text-zinc-400" : "text-gray-600"
              }`}
            >
              Category
            </label>
            <select
              value={supportCategory}
              onChange={(e) => setSupportCategory(e.target.value)}
              className={`w-full ${
                darkMode
                  ? "bg-zinc-800 border-zinc-700 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              } border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors`}
            >
              <option value="general">General Inquiry</option>
              <option value="investment">Investment</option>
              <option value="account">Account</option>
              <option value="finance">Finance</option>
              <option value="technical">Technical</option>
            </select>
          </div>

          <div>
            <label
              className={`block text-xs font-semibold mb-1.5 ${
                darkMode ? "text-zinc-400" : "text-gray-600"
              }`}
            >
              Message
            </label>
            <textarea
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              placeholder="Describe your issue in detail..."
              rows={4}
              required
              className={`w-full ${
                darkMode
                  ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
              } border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Submit Ticket
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupportTab;
