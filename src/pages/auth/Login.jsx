import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { loginSchema } from "../../utils/validation";
import { ROUTES } from "../../utils/constants";
import Input from "../../components/Input";
import PasswordInput from "../../components/PasswordInput";
import Button from "../../components/Button";
import ErrorAlert from "../../components/ErrorAlert";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  const onSubmit = async (data) => {
    setServerError(null);
    setSubmitting(true);
    try {
      await login({
        email: data.email.trim().toLowerCase(),
        password: data.password,
        remember: data.remember,
      });
      toast.success("Welcome back!");
      const redirectTo = location.state?.from || ROUTES.DASHBOARD;
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError({
        message: err.message || "Login failed. Please try again.",
        errors: err.errors,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Welcome back
        </h1>
        <p className="text-sm text-slate-400">
          Sign in to your account to continue
        </p>
      </div>

      {serverError && (
        <ErrorAlert
          message={serverError.message}
          errors={serverError.errors}
          onClose={() => setServerError(null)}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <PasswordInput
          label="Password"
          autoComplete="current-password"
          required
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-600 bg-surface-900 text-amber-600 focus:ring-amber-500 focus:ring-offset-surface-950"
              {...register("remember")}
            />
            Remember me
          </label>
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-sm font-medium text-amber-400 hover:text-amber-300 focus:outline-none focus-visible:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={submitting} size="lg">
          Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          to={ROUTES.REGISTER}
          className="font-medium text-amber-400 hover:text-amber-300 focus:outline-none focus-visible:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
