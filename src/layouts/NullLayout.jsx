import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, KeyRound, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { APP_NAME, ROUTES } from "../utils/constants";
import Button from "../components/Button";
import toast from "react-hot-toast";

export default function NullLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate(ROUTES.LOGIN, { replace: true });
    } catch {
      toast.error("Logout failed");
    } finally {
      setLoggingOut(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      <Outlet />
    </div>
  );
}
