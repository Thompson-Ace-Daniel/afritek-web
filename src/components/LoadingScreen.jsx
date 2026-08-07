import { motion } from 'framer-motion';
import Loader from './Loader';
import { APP_NAME } from '../utils/constants';

export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface-950"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-4"
      >
        <Loader size="lg" />
        <p className="text-sm text-slate-400">{message}</p>
      </motion.div>
    </div>
  );
}
