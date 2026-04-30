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
    "I just need to be heard"
  ];

  const handleSelect = () => {
    setTransitioning(true);
    setTimeout(() => {
      setLocation("/session/active");
    }, 3000);
  };

  if (transitioning) {
    return (
      <AnimatedPage className="bg-background flex flex-col h-full items-center justify-center">
        <motion.div
          animate={{ scale: [1, 3, 1], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 10, times: [0, 0.4, 1], repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[80px] h-[80px] rounded-full bg-primary"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="z-10 font-sans text-[15px] text-secondary-foreground"
        >
          Finding the right space for you...
        </motion.div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="flex flex-col h-full bg-background relative overflow-hidden p-4">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(237, 231, 220, 0.4) 0%, rgba(245, 239, 230, 0) 60%)'
      }} />

      <header className="flex items-center mb-8 relative z-10 pt-safe">
        <button onClick={() => setLocation("/talk")} className="p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <div className="flex-1 flex justify-center mr-8">
          <div className="flex items-center space-x-1.5 bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#C9BFB0]">
            <div className="w-2 h-2 rounded-full bg-[#4A6B4A]" />
            <span className="font-sans text-[12px] font-medium text-secondary-foreground">Disha</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-center max-w-[320px] mx-auto w-full z-10 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-[#C9BFB0] rounded-[18px] p-5 text-[18px] font-sans text-[#2E4A2E] leading-[1.60] mb-8"
        >
          Quick check-in before we begin — how are you arriving today?
        </motion.div>

        <div className="flex flex-col space-y-3">
          {chips.map((chip, i) => (
            <motion.button
              key={chip}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              onClick={handleSelect}
              className="bg-card border border-[#C9BFB0] rounded-[16px] p-4 text-left font-sans text-[16px] text-foreground hover:bg-muted active:scale-[0.98] transition-all min-h-[56px]"
            >
              {chip}
            </motion.button>
          ))}
        </div>
      </div>
    </AnimatedPage>
  );
}
