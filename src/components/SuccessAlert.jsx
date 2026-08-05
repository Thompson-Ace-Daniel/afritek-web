import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';

export default function SuccessAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        role="status"
        aria-live="polite"
        className="relative flex gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
      >
        <CheckCircle2
          className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
          aria-hidden="true"
        />
        <p className="min-w-0 flex-1 font-medium">{message}</p>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1 text-emerald-300/70 transition-colors hover:bg-emerald-500/20 hover:text-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            aria-label="Dismiss message"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
