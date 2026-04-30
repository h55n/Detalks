import { motion } from "framer-motion";
import { ReactNode } from "react";

export function AnimatedPage({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={`h-full w-full overflow-y-auto ${className}`}
    >
      {children}
    </motion.div>
  );
}
