import { type PropsWithChildren, type ReactElement } from 'react';
import { motion } from 'framer-motion';

export interface FadeInWithScalePropsType {
  duration?: number;
  className?: string;
}

export function FadeInWithScale({
  duration = 0.6,
  children,
  className = '',
}: PropsWithChildren<FadeInWithScalePropsType>): ReactElement {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration }}>
      {children}
    </motion.div>
  );
}
