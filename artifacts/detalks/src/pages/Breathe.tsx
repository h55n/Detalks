import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Breathe() {
  const [, setLocation] = useLocation();
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "done">("inhale");
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (cycles >= 3) {
      setPhase("done");
      return;
    }

    let timer: NodeJS.Timeout;
    if (phase === "inhale") {
      timer = setTimeout(() => setPhase("hold"), 4000);
    } else if (phase === "hold") {
      timer = setTimeout(() => setPhase("exhale"), 2000);
    } else if (phase === "exhale") {
      timer = setTimeout(() => {
        setCycles(c => c + 1);
        if (cycles < 2) setPhase("inhale");
      }, 6000);
    }

    return () => clearTimeout(timer);
  }, [phase, cycles]);

  const getSize = () => {
    if (phase === "inhale" || phase === "hold") return 240;
    return 80;
  };

  const getDuration = () => {
    if (phase === "inhale") return 4;
    if (phase === "hold") return 0;
    return 6;
  };

  return (
    <AnimatedPage className="flex flex-col h-full bg-background relative overflow-hidden items-center justify-center">
      <button 
        onClick={() => setLocation("/home")}
        className="absolute top-safe right-4 p-4 z-20"
      >
        <X className="w-6 h-6 text-secondary-foreground opacity-50" />
      </button>

      <div className="relative flex items-center justify-center w-[300px] h-[300px]">
        {phase !== "done" && (
          <motion.div
            initial={{ width: 80, height: 80 }}
            animate={{ width: getSize(), height: getSize() }}
            transition={{ duration: getDuration(), ease: "linear" }}
            className="absolute rounded-full bg-primary/20 flex items-center justify-center"
          >
            <div className="w-[80px] h-[80px] rounded-full bg-primary/80 shadow-[0_0_40px_rgba(45,106,45,0.4)]" />
          </motion.div>
        )}
      </div>

      <div className="absolute bottom-32 left-0 right-0 text-center h-[40px]">
        <AnimatePresence mode="wait">
          {phase === "inhale" && (
            <motion.div key="inhale" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-serif text-[28px] text-foreground">Inhale</motion.div>
          )}
          {phase === "hold" && (
            <motion.div key="hold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-serif text-[28px] text-foreground">Hold</motion.div>
          )}
          {phase === "exhale" && (
            <motion.div key="exhale" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-serif text-[28px] text-foreground">Exhale</motion.div>
          )}
          {phase === "done" && (
            <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
              <div className="font-serif text-[28px] text-foreground mb-2">Well done.</div>
              <div className="font-sans text-[16px] text-secondary-foreground">Take a moment.</div>
              <button 
                onClick={() => setLocation("/home")}
                className="mt-8 bg-transparent text-secondary-foreground border border-border px-6 py-2 rounded-full font-sans text-[14px]"
              >
                Return
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
}
