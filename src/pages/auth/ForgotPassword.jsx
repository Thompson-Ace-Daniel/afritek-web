import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { forgotPasswordSchema } from '../../utils/validation';
import { ROUTES } from '../../utils/constants';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ErrorAlert from '../../components/ErrorAlert';
import SuccessAlert from '../../components/SuccessAlert';

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    setServerError(null);
    setSuccessMessage(null);
    setSubmitting(true);
    try {
      const response = await forgotPassword(data.email.trim().toLowerCase());
      setSuccessMessage(
        response?.message ||
          'If an account exists with that email, a reset link has been sent.'
      );
    } catch (err) {
      setServerError({
        message: err.message || 'Request failed. Please try again.',
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
          Reset password
        </h1>
        <p className="text-sm text-slate-400">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      {serverError && (
        <ErrorAlert
          message={serverError.message}
          errors={serverError.errors}
          onClose={() => setServerError(null)}
        />
      )}

      {successMessage && (
        <SuccessAlert
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
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
          {...register('email')}
        />

        <Button type="submit" fullWidth loading={submitting} size="lg">
          Send reset link
        </Button>
      </form>

      <Link
        to={ROUTES.LOGIN}
        className="flex items-center justify-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-200 focus:outline-none focus-visible:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to sign in
      </Link>
    </div>
  );
}
