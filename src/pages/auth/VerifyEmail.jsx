import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, MailCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { verifyEmailSchema } from '../../utils/validation';
import { ROUTES } from '../../utils/constants';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ErrorAlert from '../../components/ErrorAlert';
import SuccessAlert from '../../components/SuccessAlert';

export default function VerifyEmail() {
  const { verifyEmail, sendEmailVerification, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sending, setSending] = useState(false);

  const oobFromUrl =
    searchParams.get('oobCode') ||
    searchParams.get('oob') ||
    searchParams.get('code') ||
    '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { oobCode: oobFromUrl },
  });

  useEffect(() => {
    if (oobFromUrl) {
      setValue('oobCode', oobFromUrl);
    }
  }, [oobFromUrl, setValue]);

  const onSubmit = async (data) => {
    setServerError(null);
    setSuccessMessage(null);
    setSubmitting(true);
    try {
      const response = await verifyEmail(data.oobCode.trim());
      setSuccessMessage(
        response?.message || 'Email verified successfully.'
      );
    } catch (err) {
      setServerError({
        message:
          err.message || 'Verification failed. The code may be invalid or expired.',
        errors: err.errors,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!isAuthenticated) {
      setServerError({
        message: 'Please sign in to request a new verification email.',
      });
      return;
    }
    setServerError(null);
    setSending(true);
    try {
      const response = await sendEmailVerification();
      setSuccessMessage(
        response?.message || 'Verification email sent. Check your inbox.'
      );
    } catch (err) {
      setServerError({
        message: err.message || 'Could not send verification email.',
        errors: err.errors,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <div className="mb-3 flex justify-center sm:justify-start">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600/20">
            <MailCheck className="h-6 w-6 text-brand-400" aria-hidden="true" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Verify email
        </h1>
        <p className="text-sm text-slate-400">
          Enter the verification code from your email
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
          label="Verification code"
          required
          hint="Paste the oobCode from your verification email"
          error={errors.oobCode?.message}
          {...register('oobCode')}
        />

        <Button type="submit" fullWidth loading={submitting} size="lg">
          Verify email
        </Button>
      </form>

      {isAuthenticated && (
        <Button
          variant="outline"
          fullWidth
          loading={sending}
          onClick={handleResend}
        >
          Resend verification email
        </Button>
      )}

      <Link
        to={isAuthenticated ? ROUTES.PROFILE : ROUTES.LOGIN}
        className="flex items-center justify-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-200 focus:outline-none focus-visible:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {isAuthenticated ? 'Back to profile' : 'Back to sign in'}
      </Link>
    </div>
  );
}
