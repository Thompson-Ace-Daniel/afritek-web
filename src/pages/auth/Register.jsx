import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { registerSchema } from '../../utils/validation';
import { ROUTES } from '../../utils/constants';
import Input from '../../components/Input';
import PasswordInput from '../../components/PasswordInput';
import Button from '../../components/Button';
import ErrorAlert from '../../components/ErrorAlert';

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setServerError(null);
    setSubmitting(true);
    try {
      await registerUser({
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || undefined,
        password: data.password,
        role: 'user',
      });
      toast.success('Account created! Please sign in.');
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (err) {
      setServerError({
        message: err.message || 'Registration failed. Please try again.',
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
          Create account
        </h1>
        <p className="text-sm text-slate-400">
          Get started with your free account
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
          label="Full name"
          autoComplete="name"
          required
          leftIcon={<User className="h-4 w-4" />}
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Phone"
          type="tel"
          autoComplete="tel"
          leftIcon={<Phone className="h-4 w-4" />}
          hint="Optional. Use E.164 format, e.g. +12345678901"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <PasswordInput
          label="Password"
          autoComplete="new-password"
          required
          hint="Min 8 chars, upper, lower, number & special character"
          error={errors.password?.message}
          {...register('password')}
        />

        <PasswordInput
          label="Confirm password"
          autoComplete="new-password"
          required
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" fullWidth loading={submitting} size="lg">
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-brand-400 hover:text-brand-300 focus:outline-none focus-visible:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
