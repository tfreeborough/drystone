import { PropsWithChildren } from "react";
import { motion } from "framer-motion";

interface DrawSlideFromBottomProps {
  duration?: number;
  className?: string;
}

export const DrawSlideFromBottom = ({
  duration = 0.6,
  children,
  className = "",
}: PropsWithChildren<DrawSlideFromBottomProps>) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  );
};
