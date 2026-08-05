import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { changePasswordSchema } from '../../utils/validation';
import { ROUTES } from '../../utils/constants';
import PasswordInput from '../../components/PasswordInput';
import Button from '../../components/Button';
import ErrorAlert from '../../components/ErrorAlert';

export default function ChangePassword() {
  const { changePassword } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setServerError(null);
    setSubmitting(true);
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed. Please sign in again.');
      reset();
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (err) {
      setServerError({
        message: err.message || 'Failed to change password.',
        errors: err.errors,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Change password</h1>
        <p className="mt-1 text-sm text-slate-400">
          Update your password. You will be signed out after a successful change.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-surface-900/60 p-5 sm:p-6">
        {serverError && (
          <div className="mb-4">
            <ErrorAlert
              message={serverError.message}
              errors={serverError.errors}
              onClose={() => setServerError(null)}
            />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <PasswordInput
            label="Current password"
            autoComplete="current-password"
            required
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />

          <PasswordInput
            label="New password"
            autoComplete="new-password"
            required
            hint="Min 8 chars, upper, lower, number & special character"
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

          <Button type="submit" loading={submitting}>
            Update password
          </Button>
        </form>
      </div>
    </div>
  );
}
