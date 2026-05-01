import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function PreCheck() {
  const [, setLocation] = useLocation();
  const [transitioning, setTransitioning] = useState(false);

  const chips = [
    "Feeling steady",
    "A little wobbly",
    "Carrying something heavy",
    "I just need to be heard",
  ];

  const handleSelect = () => {
    setTransitioning(true);
    setTimeout(() => {
      setLocation("/session/active");
    }, 2800);
  };

  if (transitioning) {
    return (
      <AnimatedPage className="bg-background flex flex-col h-full items-center justify-center px-8">
        {/* Calm breathing orb — on-brand, no jarring green blob */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-14 h-14 rounded-full border border-primary/30 bg-primary/10 mb-10"
        />
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-serif text-[26px] text-foreground text-center leading-[1.30] mb-3"
        >
          Connecting you now.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-sans text-[14px] text-[#8C7B6A] text-center"
        >
          Take a slow breath.
        </motion.p>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="flex flex-col h-full bg-background relative">
      {/* Back button */}
      <header className="px-5 pt-8 pb-4 flex items-center justify-between">
        <button
          onClick={() => setLocation("/talk")}
          className="p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground/70" strokeWidth={1.5} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary/60" />
          <span className="font-serif text-[15px] text-foreground">Disha</span>
        </div>
        <div className="w-9" />
      </header>

      <div className="flex-1 flex flex-col justify-center px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/60 rounded-[20px] p-5 font-sans text-[17px] text-foreground leading-[1.65] mb-8"
          style={{ boxShadow: "rgba(100,70,30,0.05) 0px 4px 16px" }}
        >
          Quick check-in before we begin — how are you arriving today?
        </motion.div>

        <div className="flex flex-col gap-3">
          {chips.map((chip, i) => (
            <motion.button
              key={chip}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.08 }}
              onClick={handleSelect}
              className="bg-card border border-border/60 rounded-[16px] p-4 text-left font-sans text-[15px] text-foreground hover:border-primary/40 active:scale-[0.99] transition-all min-h-[56px]"
              style={{ boxShadow: "rgba(100,70,30,0.04) 0px 4px 12px" }}
            >
              {chip}
            </motion.button>
          ))}
        </div>
      </div>
    </AnimatedPage>
  );
}
