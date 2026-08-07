import { Outlet, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { APP_NAME, ROUTES } from "../utils/constants";

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-surface-950">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
      >
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-600/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-6 py-5 sm:px-10">
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg"
          >
            <img
              src={"/afritek-logo-transparent.png"}
              alt="Afritek's Logo"
              className="flex h-9 w-9 items-center justify-center rounded-xl"
            />

            <span className="text-lg font-semibold tracking-tight text-white">
              {APP_NAME}
            </span>
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <div className="rounded-2xl border border-slate-800/80 bg-surface-900/70 p-6 shadow-soft backdrop-blur-xl sm:p-8">
              <Outlet />
            </div>
          </motion.div>
        </main>

        <footer className="px-6 py-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
