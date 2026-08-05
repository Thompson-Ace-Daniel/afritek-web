import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { resetPasswordSchema } from '../../utils/validation';
import { ROUTES } from '../../utils/constants';
import PasswordInput from '../../components/PasswordInput';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ErrorAlert from '../../components/ErrorAlert';

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      oobCode: oobFromUrl,
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (oobFromUrl) {
      setValue('oobCode', oobFromUrl);
    }
  }, [oobFromUrl, setValue]);

  const onSubmit = async (data) => {
    setServerError(null);
    setSubmitting(true);
    try {
      await resetPassword({
        oobCode: data.oobCode.trim(),
        newPassword: data.newPassword,
      });
      toast.success('Password reset successfully. Please sign in.');
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (err) {
      setServerError({
        message: err.message || 'Reset failed. The link may be invalid or expired.',
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
          Set new password
        </h1>
        <p className="text-sm text-slate-400">
          Enter the code from your email and choose a new password
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
          label="Reset code"
          required
          hint="Paste the oobCode from your reset email if not auto-filled"
          error={errors.oobCode?.message}
          {...register('oobCode')}
        />

        <PasswordInput
          label="New password"
          autoComplete="new-password"
          required
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />

        <PasswordInput
          label="Confirm new password"
          autoComplete="new-password"
          required
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" fullWidth loading={submitting} size="lg">
          Reset password
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
