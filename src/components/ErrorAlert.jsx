import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

export default function ErrorAlert({ message, errors, onClose }) {
  if (!message && (!errors || errors.length === 0)) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        role="alert"
        aria-live="assertive"
        className="relative flex gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
      >
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
        <div className="min-w-0 flex-1 space-y-1">
          {message && <p className="font-medium">{message}</p>}
          {errors && errors.length > 0 && (
            <ul className="list-inside list-disc space-y-0.5 text-red-300/90">
              {errors.map((err, i) => (
                <li key={i}>
                  {typeof err === 'string'
                    ? err
                    : err.message || `${err.field}: invalid`}
                </li>
              ))}
            </ul>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1 text-red-300/70 transition-colors hover:bg-red-500/20 hover:text-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
