import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

export function AnimatedPage({ children, className = "" }: { children: ReactNode, className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={`h-full w-full overflow-y-auto ${className}`}
    >
      {children}
    </motion.div>
  );
}
