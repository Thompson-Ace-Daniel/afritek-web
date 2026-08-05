import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Phone, Mail, Shield, BadgeCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { updateProfileSchema } from '../../utils/validation';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ErrorAlert from '../../components/ErrorAlert';
import SuccessAlert from '../../components/SuccessAlert';

export default function Profile() {
  const { user, updateProfile, deleteAccount, sendEmailVerification } = useAuth();
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [sendingVerify, setSendingVerify] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data) => {
    setServerError(null);
    setSuccessMessage(null);
    setSubmitting(true);
    try {
      await updateProfile({
        fullName: data.fullName.trim(),
        phone: data.phone?.trim() || null,
      });
      setSuccessMessage('Profile updated successfully.');
      toast.success('Profile updated');
    } catch (err) {
      setServerError({
        message: err.message || 'Failed to update profile.',
        errors: err.errors,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (!confirmed) return;

    setDeleting(true);
    setServerError(null);
    try {
      await deleteAccount();
      toast.success('Account deleted');
      window.location.href = '/login';
    } catch (err) {
      setServerError({
        message: err.message || 'Failed to delete account.',
        errors: err.errors,
      });
      setDeleting(false);
    }
  };

  const handleSendVerification = async () => {
    setSendingVerify(true);
    setServerError(null);
    try {
      const response = await sendEmailVerification();
      setSuccessMessage(
        response?.message || 'Verification email sent. Check your inbox.'
      );
      toast.success('Verification email sent');
    } catch (err) {
      setServerError({
        message: err.message || 'Could not send verification email.',
        errors: err.errors,
      });
    } finally {
      setSendingVerify(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your account information
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-surface-900/60 p-5 sm:p-6">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600/20 text-lg font-bold text-brand-400">
            {(user?.fullName || user?.email || '?').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-white">
              {user?.fullName || 'User'}
            </p>
            <p className="truncate text-sm text-slate-400">{user?.email}</p>
          </div>
          <div className="ml-auto flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300">
              <Shield className="h-3 w-3" aria-hidden="true" />
              {user?.role || 'user'}
            </span>
            {user?.isVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-400">
                <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-400">
                Unverified
              </span>
            )}
          </div>
        </div>

        {serverError && (
          <div className="mb-4">
            <ErrorAlert
              message={serverError.message}
              errors={serverError.errors}
              onClose={() => setServerError(null)}
            />
          </div>
        )}

        {successMessage && (
          <div className="mb-4">
            <SuccessAlert
              message={successMessage}
              onClose={() => setSuccessMessage(null)}
            />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            label="Email"
            type="email"
            value={user?.email || ''}
            disabled
            leftIcon={<Mail className="h-4 w-4" />}
            hint="Email cannot be changed"
          />

          <Input
            label="Full name"
            required
            leftIcon={<User className="h-4 w-4" />}
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          <Input
            label="Phone"
            type="tel"
            leftIcon={<Phone className="h-4 w-4" />}
            error={errors.phone?.message}
            {...register('phone')}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              type="submit"
              loading={submitting}
              disabled={!isDirty}
            >
              Save changes
            </Button>

            {!user?.isVerified && (
              <Button
                type="button"
                variant="outline"
                loading={sendingVerify}
                onClick={handleSendVerification}
              >
                Send verification email
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-red-300">Danger zone</h2>
        <p className="mt-1 text-sm text-slate-400">
          Permanently delete your account and all associated data. This cannot
          be undone.
        </p>
        <Button
          variant="danger"
          className="mt-4"
          loading={deleting}
          onClick={handleDelete}
        >
          Delete account
        </Button>
      </div>
    </div>
  );
}
