import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function Loader({ size = 'md', className }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  return (
    <motion.div
      className={clsx(
        'inline-block rounded-full border-amber-500 border-t-transparent animate-spin',
        sizes[size] || sizes.md,
        className
      )}
      role="status"
      aria-label="Loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    />
  );
}
