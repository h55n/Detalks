import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Breathe() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const technique = searchParams.get("t") || "belly"; // belly, box, 478

  const [phase, setPhase] = useState<"inhale" | "hold1" | "exhale" | "hold2" | "done">("inhale");
  const [cycles, setCycles] = useState(0);

  const getTimings = () => {
    if (technique === "box") return { inhale: 4000, hold1: 4000, exhale: 4000, hold2: 4000, totalCycles: 4 };
    if (technique === "478") return { inhale: 4000, hold1: 7000, exhale: 8000, hold2: 0, totalCycles: 4 };
    return { inhale: 4000, hold1: 2000, exhale: 6000, hold2: 0, totalCycles: 4 }; // belly
  };

  const getLabel = () => {
    if (technique === "box") return "Box Breathing";
    if (technique === "478") return "4-7-8 Technique";
    return "Belly Breathing";
  };

  useEffect(() => {
    const timings = getTimings();

    if (cycles >= timings.totalCycles) {
      setPhase("done");
      return;
    }

    let timer: NodeJS.Timeout;
    if (phase === "inhale") {
      timer = setTimeout(() => setPhase(timings.hold1 > 0 ? "hold1" : "exhale"), timings.inhale);
    } else if (phase === "hold1") {
      timer = setTimeout(() => setPhase("exhale"), timings.hold1);
    } else if (phase === "exhale") {
      timer = setTimeout(() => {
        if (timings.hold2 > 0) {
          setPhase("hold2");
        } else {
          setCycles(c => c + 1);
          if (cycles < timings.totalCycles - 1) setPhase("inhale");
        }
      }, timings.exhale);
    } else if (phase === "hold2") {
      timer = setTimeout(() => {
        setCycles(c => c + 1);
        if (cycles < timings.totalCycles - 1) setPhase("inhale");
      }, timings.hold2);
    }

    return () => clearTimeout(timer);
  }, [phase, cycles, technique]);

  const getSize = () => {
    if (phase === "inhale" || phase === "hold1") return 240;
    return 80;
  };

  const getDuration = () => {
    const timings = getTimings();
    if (phase === "inhale") return timings.inhale / 1000;
    if (phase === "hold1") return 0;
    if (phase === "exhale") return timings.exhale / 1000;
    if (phase === "hold2") return 0;
    return 0;
  };

  return (
    <AnimatedPage className="flex flex-col h-full bg-background relative overflow-hidden items-center justify-center">
      <button 
        onClick={() => setLocation("/practice")}
        className="absolute top-safe right-4 p-4 z-20 min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        <X className="w-6 h-6 text-secondary-foreground opacity-50" />
      </button>

      <div className="absolute top-24 left-0 right-0 text-center text-[#8C7B6A] font-sans text-[13px] font-medium tracking-[0.5px] uppercase">
        {getLabel()}
      </div>

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
          {(phase === "hold1" || phase === "hold2") && (
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
                onClick={() => setLocation("/practice")}
                className="mt-8 bg-transparent text-secondary-foreground border border-border px-6 py-2 rounded-full font-sans text-[14px] min-h-[44px]"
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
