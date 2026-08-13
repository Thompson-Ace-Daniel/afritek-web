// ==================== PROFILE TAB ====================

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


export const ProfileTab = ({ darkMode }) => {
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
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <h1
          className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
        >
          Profile
        </h1>
        <p className={darkMode ? "text-zinc-400" : "text-gray-500"}>
          Manage your account information
        </p>
      </div>

      <div
        className={`${
          darkMode
            ? "bg-zinc-900/50 border-zinc-800"
            : "bg-white border-gray-200"
        } border rounded-2xl p-6`}
      >
        <div
          className={`flex items-center gap-4 mb-6 pb-6 border-b ${
            darkMode ? "border-zinc-800" : "border-gray-200"
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xl font-bold text-white">
            {(user?.fullName || user?.email || "?").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h2
              className={`text-xl font-bold truncate ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              {user?.fullName || "User"}
            </h2>
            <p
              className={`truncate ${darkMode ? "text-zinc-400" : "text-gray-500"}`}
            >
              {user?.email}
            </p>
          </div>
          <div className="ml-auto flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                darkMode
                  ? "bg-zinc-800 text-zinc-300"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <Shield className="h-3 w-3" aria-hidden="true" />
              {user?.role || "user"}
            </span>
            {user?.isVerified ? (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border ${
                  darkMode
                    ? "bg-green-500/20 text-green-400 border-green-500/20"
                    : "bg-green-50 text-green-600 border-green-200"
                }`}
              >
                <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                Verified
              </span>
            ) : (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border ${
                  darkMode
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/20"
                    : "bg-amber-50 text-amber-600 border-amber-200"
                }`}
              >
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
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <label
              className={`text-sm font-medium ${darkMode ? "text-zinc-300" : "text-gray-700"} block mb-1.5`}
            >
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className={`w-full ${
                  darkMode
                    ? "bg-zinc-800 border-zinc-700 text-zinc-400"
                    : "bg-gray-100 border-gray-200 text-gray-500"
                } border rounded-xl px-4 py-3 pr-40 outline-none cursor-not-allowed`}
              />
              <span
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${
                  darkMode ? "text-zinc-500" : "text-gray-400"
                }`}
              >
                Email cannot be changed
              </span>
            </div>
          </div>

          <div>
            <label
              className={`text-sm font-medium ${darkMode ? "text-zinc-300" : "text-gray-700"} block mb-1.5`}
            >
              Full name <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full ${
                darkMode
                  ? "bg-zinc-800 border-zinc-700 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              } border rounded-xl px-4 py-3 outline-none focus:border-amber-400 transition-colors`}
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label
              className={`text-sm font-medium ${darkMode ? "text-zinc-300" : "text-gray-700"} block mb-1.5`}
            >
              Phone
            </label>
            <input
              type="tel"
              className={`w-full ${
                darkMode
                  ? "bg-zinc-800 border-zinc-700 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              } border rounded-xl px-4 py-3 outline-none focus:border-amber-400 transition-colors`}
              {...register("phone")}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={!isDirty || submitting}
              className="px-6 py-2.5 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "Saving..." : "Save changes"}
            </button>

            {!user?.isVerified && (
              <button
                type="button"
                onClick={handleSendVerification}
                disabled={sendingVerify}
                className={`px-6 py-2.5 ${
                  darkMode
                    ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                } rounded-xl transition-colors disabled:opacity-50`}
              >
                {sendingVerify ? "Sending..." : "Send verification email"}
              </button>
            )}

            <button
              type="button"
              onClick={() => (window.location.href = "/change-password")}
              className={`px-6 py-2.5 ${
                darkMode
                  ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              } rounded-xl transition-colors flex items-center gap-2`}
            >
              <Key className="w-4 h-4" />
              Change Password
            </button>
          </div>
        </form>
      </div>

      <div
        className={`${
          darkMode
            ? "bg-red-500/5 border-red-500/20"
            : "bg-red-50 border-red-200"
        } border rounded-2xl p-6`}
      >
        <h2
          className={`text-sm font-semibold ${darkMode ? "text-red-400" : "text-red-600"}`}
        >
          Danger zone
        </h2>
        <p
          className={`text-sm mt-1 ${darkMode ? "text-zinc-400" : "text-gray-500"}`}
        >
          Permanently delete your account and all associated data. This cannot
          be undone.
        </p>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className={`mt-4 px-6 py-2.5 ${
            darkMode
              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
              : "bg-red-100 text-red-600 hover:bg-red-200"
          } rounded-xl transition-colors disabled:opacity-50`}
        >
          {deleting ? "Deleting..." : "Delete account"}
        </button>
      </div>
    </div>
  );
};
