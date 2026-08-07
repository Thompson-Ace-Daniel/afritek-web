import { forwardRef } from "react";
import clsx from "clsx";

const Input = forwardRef(function Input(
  {
    label,
    name,
    type = "text",
    error,
    hint,
    leftIcon,
    rightElement,
    className,
    containerClassName,
    disabled,
    required,
    id,
    ...props
  },
  ref,
) {
  const inputId = id || name;

  return (
    <div className={clsx("w-full space-y-1.5", containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-300"
        >
          {label}
          {required && (
            <span className="ml-0.5 text-red-400" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          className={clsx(
            "w-full rounded-xl border bg-surface-900/80 px-3.5 py-2.5 text-sm text-slate-100",
            "placeholder:text-slate-500",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-red-500/60 focus:ring-red-500/30 focus:border-red-500"
              : "border-slate-700 hover:border-slate-600",
            leftIcon && "pl-10",
            rightElement && "pr-10",
            className,
          )}
          {...props}
        />

        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p
          id={`${inputId}-error`}
          className="text-xs text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}

      {!error && hint && (
        <p id={`${inputId}-hint`} className="text-xs text-slate-500">
          {hint}
        </p>
      )}
    </div>
  );
});

export default Input;
