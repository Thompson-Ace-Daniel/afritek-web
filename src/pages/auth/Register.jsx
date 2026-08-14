import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User, Phone, Tag } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { registerSchema } from "../../utils/validation";
import { ROUTES } from "../../utils/constants";
import { referralAPI } from "../../api/auth.api.js";
import Input from "../../components/Input";
import PasswordInput from "../../components/PasswordInput";
import Button from "../../components/Button";
import ErrorAlert from "../../components/ErrorAlert";

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref") || "";

  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [referrerName, setReferrerName] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      referralCode: refCode,
    },
  });

  // Watch the actual referral code field value
  const watchedRefCode = watch("referralCode");

  // Sync refCode from query params and resolve referrer
  useEffect(() => {
    const codeToResolve = refCode || watchedRefCode;

    if (refCode) {
      // Force set the value in react-hook-form state
      setValue("referralCode", refCode, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    if (codeToResolve) {
      referralAPI
        .resolve(codeToResolve)
        .then((res) => {
          // Fixed path matching second component: res.data.data.valid
          if (res.data?.data?.valid) {
            setReferrerName(res.data.data.referrer.fullName);
          } else {
            setReferrerName("");
          }
        })
        .catch(() => setReferrerName(""));
    } else {
      setReferrerName("");
    }
  }, [refCode, setValue]);

  const onSubmit = async (data) => {
    setServerError(null);
    setSubmitting(true);

    const payload = {
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      role: "user",
    };

    const trimmedPhone = data.phone?.trim();
    if (trimmedPhone) payload.phone = trimmedPhone;

    const trimmedRefCode = data.referralCode?.trim();
    if (trimmedRefCode) payload.referralCode = trimmedRefCode;

    try {
      await registerUser(payload);
      toast.success("Account created! Please sign in.");
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        err.message ||
        "Registration failed. Please try again.";

      setServerError({
        message,
        errors: err.response?.data?.errors || err.errors,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Create account
        </h1>
        <p className="text-sm text-slate-400">
          Get started with your free account
        </p>
      </div>

      {referrerName && (
        <div className="rounded-md bg-emerald-500/10 p-3 text-center text-sm text-emerald-400 border border-emerald-500/20">
          You were invited by <strong>{referrerName}</strong>
        </div>
      )}

      {serverError && (
        <ErrorAlert
          message={serverError.message}
          errors={serverError.errors}
          onClose={() => setServerError(null)}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Full name"
          autoComplete="name"
          required
          leftIcon={<User className="h-4 w-4" />}
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Phone"
          type="tel"
          autoComplete="tel"
          leftIcon={<Phone className="h-4 w-4" />}
          hint="Optional. Use E.164 format, e.g. +12345678901"
          error={errors.phone?.message}
          {...register("phone")}
        />

        <PasswordInput
          label="Password"
          autoComplete="new-password"
          required
          hint="Min 8 chars, upper, lower, number & special character"
          error={errors.password?.message}
          {...register("password")}
        />

        <PasswordInput
          label="Confirm password"
          autoComplete="new-password"
          required
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Input
          label="Referral code"
          type="text"
          leftIcon={<Tag className="h-4 w-4" />}
          hint="Optional"
          error={errors.referralCode?.message}
          {...register("referralCode")}
        />

        <p className="text-center my-2 text-sm text-neutral-300">
          By continuing you agree to our{" "}
          <a className="underline" href="#">
            Terms & Conditions
          </a>
        </p>

        <Button type="submit" fullWidth loading={submitting} size="lg">
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-amber-400 hover:text-amber-300 focus:outline-none focus-visible:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
