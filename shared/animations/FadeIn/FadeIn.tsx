import { type PropsWithChildren, type ReactElement } from "react";
import { motion } from "framer-motion";

export interface FadeInPropsType {
  duration?: number;
  className?: string;
  delay?: number;
}

export function FadeIn({
  duration = 0.6,
  children,
  className = "",
  delay = 0,
}: PropsWithChildren<FadeInPropsType>): ReactElement {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}
