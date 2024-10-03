import {PropsWithChildren} from "react";
import { motion } from "framer-motion";

interface FadeInProps {
  delay?: number,
  duration?: number,
  onComplete?: () => void,
  className?: string,
}
function FadeIn({ children, delay = 0, duration = 1, onComplete, className = '' }: PropsWithChildren<FadeInProps>){
  function handleCompleteAnimation(){
    if(onComplete){
      onComplete();
    }
  }
  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        delay: delay,
        duration: duration,
      }}
      onAnimationComplete={handleCompleteAnimation}
    >
      { children }
    </motion.div>
  )
}

export default FadeIn;
