import { type PropsWithChildren, type ReactElement } from "react";
import { motion } from "framer-motion";

export interface FadeInPropsType {
  duration?: number;
  className?: string;
  delay?: number;
  onAnimationComplete?: () => void;
  hasExitAnimation?: boolean;
}

export function FadeIn({
  duration = 0.6,
  children,
  className = "",
  delay = 0,
  onAnimationComplete,
  hasExitAnimation = false,
}: PropsWithChildren<FadeInPropsType>): ReactElement {
  function handleAnimationComplete() {
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={hasExitAnimation ? { opacity: 0 } : undefined}
      transition={{ duration, delay }}
      onAnimationComplete={handleAnimationComplete}
    >
      {children}
    </motion.div>
  );
}
