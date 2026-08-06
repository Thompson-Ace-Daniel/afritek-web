import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from "../hooks/useAuth";

export default function DeleteAccountModal({ isOpen, onClose, darkMode }) {
  const [step, setStep] = useState('confirm'); // 'confirm' or 'verify'
  const [verificationText, setVerificationText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, deleteAccount, sendEmailVerification, logout } = useAuth();

  const handleDelete = async () => {
    if (verificationText !== 'DELETE') {
      setError('Please type "DELETE" to confirm');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      const response = await deleteAccount(token);
      
      if (response.success) {
        // Log out and clear everything
        await logout();
        // Redirect to home/login
        window.location.href = '/login';
      } else {
        setError(response.message || 'Failed to delete account');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className={`relative w-full max-w-md rounded-2xl ${
            darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-gray-200'
          } border shadow-2xl p-6`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-1 rounded-lg ${
              darkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'
            } transition-colors`}
          >
            <X className={`w-5 h-5 ${darkMode ? 'text-zinc-400' : 'text-gray-500'}`} />
          </button>

          {/* Icon */}
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>

          {/* Title */}
          <h2 className={`text-xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Delete Account
          </h2>
          <p className={`text-sm text-center ${darkMode ? 'text-zinc-400' : 'text-gray-500'} mt-2`}>
            This action is <span className="text-red-500 font-semibold">irreversible</span>. 
            All your data, investments, and account information will be permanently deleted.
          </p>

          {/* User Info */}
          <div className={`mt-4 p-3 rounded-xl ${
            darkMode ? 'bg-zinc-800/50 border-zinc-700' : 'bg-gray-50 border-gray-200'
          } border`}>
            <p className={`text-sm ${darkMode ? 'text-zinc-300' : 'text-gray-700'}`}>
              <span className="font-medium">Account:</span> {user?.email}
            </p>
            <p className={`text-sm ${darkMode ? 'text-zinc-300' : 'text-gray-700'} mt-1`}>
              <span className="font-medium">Name:</span> {user?.fullName}
            </p>
          </div>

          {step === 'confirm' ? (
            <>
              <div className={`mt-4 p-3 rounded-xl ${
                darkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'
              } border`}>
                <p className={`text-xs ${darkMode ? 'text-red-400' : 'text-red-600'} text-center`}>
                  ⚠️ This action cannot be undone. All your data will be permanently removed.
                </p>
              </div>

              <div className="mt-6">
                <p className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-gray-600'} mb-2`}>
                  Type <span className="text-red-500 font-bold">DELETE</span> to confirm
                </p>
                <input
                  type="text"
                  value={verificationText}
                  onChange={(e) => {
                    setVerificationText(e.target.value);
                    setError('');
                  }}
                  placeholder="Type DELETE here"
                  className={`w-full ${
                    darkMode
                      ? 'bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
                  } border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors`}
                  autoFocus
                />
                {error && (
                  <p className="text-red-500 text-xs mt-1">{error}</p>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={onClose}
                  className={`flex-1 py-3 rounded-xl ${
                    darkMode
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  } transition-colors font-medium`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep('verify')}
                  disabled={verificationText !== 'DELETE'}
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                    verificationText === 'DELETE'
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : darkMode
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={`mt-4 p-3 rounded-xl ${
                darkMode ? 'bg-red-500/20 border-red-500/20' : 'bg-red-50 border-red-200'
              } border`}>
                <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'} text-center font-medium`}>
                  Are you absolutely sure? This will delete everything.
                </p>
              </div>

              {error && (
                <div className={`mt-3 p-3 rounded-xl ${
                  darkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'
                } border`}>
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep('confirm')}
                  className={`flex-1 py-3 rounded-xl ${
                    darkMode
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  } transition-colors font-medium`}
                >
                  Go Back
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                    isLoading
                      ? 'bg-red-400 cursor-not-allowed'
                      : 'bg-red-500 hover:bg-red-600'
                  } text-white flex items-center justify-center gap-2`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Permanently'
                  )}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}