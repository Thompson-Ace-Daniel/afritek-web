import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Wallet,
  User,
  LogOut,
  Menu,
  Sun,
  Moon,
  HelpCircle,
} from "lucide-react";
import afriTech from "../../assets/afritek-logo.jpg";
import {
  OverviewTab,
  PortfolioTab,
  DividendsTab,
  SupportTab,
  ProfileTab,
} from "./DashboardTabs";
import { useAuth } from "../../hooks/useAuth";

export default function Dashboard() {
  const [currentTab, setCurrentTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "portfolio", label: "Portfolio", icon: Briefcase },
    { id: "dividends", label: "Dividends", icon: Wallet },
    { id: "support", label: "Support", icon: HelpCircle },
    { id: "profile", label: "Profile", icon: User },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#030009]" : "bg-gray-50"}`}>
      {/* ====== SIDEBAR ====== */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 ${
          darkMode
            ? "bg-zinc-950 border-r border-zinc-800"
            : "bg-white border-r border-gray-200"
        } z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div
            className={`flex items-center gap-3 p-6 ${darkMode ? "border-b border-zinc-800" : "border-b border-gray-200"}`}
          >
            <div className=" text-black rounded-lg border-3 w-fit h-fit border-amber-400">
              <img src={afriTech} alt="" className="w-12 h-10 rounded-md" />
            </div>
            <div>
              <span
                className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                AfriTek
              </span>
              <span className="block text-[10px] text-amber-500 uppercase tracking-wider">
                Investor Portal
              </span>
            </div>
          </div>

          {/* User Info */}
          <div
            className={`p-4 ${darkMode ? "border-b border-zinc-800" : "border-b border-gray-200"}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold">
                {user?.fullName?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold truncate ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  {user?.fullName || "User"}
                </p>
                <p className="text-xs text-zinc-500 truncate">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setCurrentTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? darkMode
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-amber-50 text-amber-600 border border-amber-200"
                      : darkMode
                        ? "text-zinc-400 hover:bg-zinc-800/50"
                        : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{tab.label}</span>
                  {isActive && (
                    <div
                      className={`ml-auto w-1.5 h-8 rounded-full ${darkMode ? "bg-amber-400" : "bg-amber-500"}`}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom */}
          <div
            className={`p-4 ${darkMode ? "border-t border-zinc-800" : "border-t border-gray-200"} space-y-3`}
          >
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                darkMode
                  ? "hover:bg-zinc-800 text-zinc-400"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
              <span className="text-sm">
                {darkMode ? "Light Mode" : "Dark Mode"}
              </span>
            </button>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                darkMode
                  ? "hover:bg-zinc-800 text-red-400"
                  : "hover:bg-gray-100 text-red-500"
              }`}
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ====== MOBILE HEADER ====== */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 ${
          darkMode
            ? "bg-zinc-950/90 border-b border-zinc-800"
            : "bg-white/90 border-b border-gray-200"
        } backdrop-blur-xl lg:hidden`}
      >
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className={`p-2 rounded-xl ${darkMode ? "hover:bg-zinc-800" : "hover:bg-gray-100"} transition-colors`}
          >
            <Menu className={darkMode ? "text-white" : "text-gray-900"} />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-1.5 rounded-lg">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span
              className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              AfriTek
            </span>
          </div>
          <button
            onClick={handleLogout}
            className={`p-2 rounded-xl ${darkMode ? "hover:bg-zinc-800" : "hover:bg-gray-100"} transition-colors`}
          >
            <LogOut className={darkMode ? "text-red-400" : "text-red-500"} />
          </button>
        </div>
      </header>

      {/* ====== MAIN CONTENT ====== */}
      <main className={`lg:ml-64 pt-16 lg:pt-0 min-h-screen pb-24 lg:pb-0`}>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {currentTab === "overview" && (
            <OverviewTab darkMode={darkMode} user={user} />
          )}
          {currentTab === "portfolio" && (
            <PortfolioTab darkMode={darkMode} user={user} />
          )}
          {currentTab === "dividends" && (
            <DividendsTab darkMode={darkMode} user={user} />
          )}
          {currentTab === "support" && (
            <SupportTab darkMode={darkMode} user={user} />
          )}
          {currentTab === "profile" && (
            <ProfileTab
              darkMode={darkMode}
              user={user}
              onProfileUpdate={() => {}}
            />
          )}
        </div>
      </main>

      {/* ====== MOBILE BOTTOM NAV ====== */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 ${
          darkMode
            ? "bg-zinc-950 border-t border-zinc-800"
            : "bg-white border-t border-gray-200"
        } lg:hidden`}
      >
        <div className="flex items-center justify-around p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all ${
                  isActive
                    ? "text-amber-500"
                    : darkMode
                      ? "text-zinc-500"
                      : "text-gray-500"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
