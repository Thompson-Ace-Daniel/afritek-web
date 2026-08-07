import { forwardRef } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import Loader from "./Loader";

const variants = {
  primary:
    "bg-amber-600 text-white hover:bg-amber-500 focus-visible:ring-amber-500 shadow-lg shadow-amber-600/20",
  secondary:
    "bg-surface-800 text-slate-100 hover:bg-surface-800/80 border border-slate-700 focus-visible:ring-slate-500",
  outline:
    "bg-transparent text-slate-200 border border-slate-600 hover:bg-slate-800/50 focus-visible:ring-slate-500",
  danger:
    "bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-500 shadow-lg shadow-red-600/20",
  ghost:
    "bg-transparent text-slate-300 hover:bg-slate-800/60 hover:text-white focus-visible:ring-slate-500",
};

const sizes = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    type = "button",
    loading = false,
    disabled = false,
    fullWidth = false,
    className,
    leftIcon,
    rightIcon,
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={isDisabled}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      className={clsx(
        "inline-flex items-center justify-center rounded-xl font-medium transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader size="sm" className="border-white border-t-transparent" />
          <span>Please wait...</span>
        </>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </motion.button>
  );
});

export default Button;
