import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, X } from "lucide-react";

export default function PulseCheck() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => setStep(1), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [step]);

  const handleFirstRound = () => {
    setStep(2);
    setTimeout(() => setStep(3), 1000);
  };

  const handleSecondRound = () => {
    setStep(4);
    setTimeout(() => {
      setStep(5);
      setTimeout(() => {
        setLoading(true);
        setTimeout(() => {
          setLocation("/home");
        }, 3500);
      }, 1500);
    }, 1000);
  };

  if (loading) {
    return (
      <AnimatedPage className="bg-background flex flex-col h-full items-center justify-center px-8">
        {/* Calm pulsing orb — on-brand, no harsh green blob */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-full border border-primary/30 bg-primary/10 mb-10"
        />
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-serif text-[28px] text-foreground text-center leading-[1.30] mb-3"
        >
          Finding the right space for you.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-sans text-[14px] text-[#8C7B6A] text-center leading-relaxed"
        >
          Just a moment.
        </motion.p>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="bg-background flex flex-col h-full relative">
      {/* Back/close button */}
      <div className="flex items-center justify-between px-5 pt-8 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary/60" />
          <span className="font-serif text-[16px] text-foreground">Disha</span>
        </div>
        <button
          onClick={() => setLocation("/home")}
          className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground/40 hover:text-foreground/70 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col justify-end space-y-4">
        <div className="flex flex-col space-y-2 max-w-[86%]">
          <div
            className="bg-card border border-border/60 rounded-[18px] p-4 font-sans text-[15px] text-foreground leading-[1.65]"
            style={{ boxShadow: "rgba(100,70,30,0.05) 0px 4px 16px" }}
          >
            Hey. I'm Disha — I'm here to help you find the right space for you today.
          </div>
          {step >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border/60 rounded-[18px] p-4 font-sans text-[15px] text-foreground leading-[1.65]"
              style={{ boxShadow: "rgba(100,70,30,0.05) 0px 4px 16px" }}
            >
              How have you been feeling lately? Take your time — there's no right answer.
            </motion.div>
          )}
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 py-1"
          >
            {["Pretty rough lately", "Could be better", "I'm okay, just curious", "I need to talk to someone now"].map((txt, i) => (
              <button
                key={i}
                onClick={handleFirstRound}
                className="bg-card border border-border/60 rounded-full px-4 py-2.5 font-sans text-[13px] text-foreground/80 hover:border-primary/40 transition-colors min-h-[40px]"
              >
                {txt}
              </button>
            ))}
          </motion.div>
        )}

        {step === 2 && (
          <div className="flex items-center gap-1.5 text-[#8C7B6A] py-1">
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.8, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-current" />
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.8, delay: 0.2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-current" />
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.8, delay: 0.4, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-current" />
          </div>
        )}

        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col space-y-2 max-w-[86%]"
          >
            <div
              className="bg-card border border-border/60 rounded-[18px] p-4 font-sans text-[15px] text-foreground leading-[1.65]"
              style={{ boxShadow: "rgba(100,70,30,0.05) 0px 4px 16px" }}
            >
              Thank you for telling me. What's been taking up the most space in your mind?
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 py-1"
          >
            {["Work / studies", "Relationships", "Just feeling low", "Not sure, it's complex"].map((txt, i) => (
              <button
                key={i}
                onClick={handleSecondRound}
                className="bg-card border border-border/60 rounded-full px-4 py-2.5 font-sans text-[13px] text-foreground/80 hover:border-primary/40 transition-colors min-h-[40px]"
              >
                {txt}
              </button>
            ))}
          </motion.div>
        )}

        {step === 4 && (
          <div className="flex items-center gap-1.5 text-[#8C7B6A] py-1">
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.8, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-current" />
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.8, delay: 0.2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-current" />
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.8, delay: 0.4, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-current" />
          </div>
        )}

        {step >= 5 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col space-y-2 max-w-[86%]"
          >
            <div
              className="bg-card border border-border/60 rounded-[18px] p-4 font-sans text-[15px] text-foreground leading-[1.65]"
              style={{ boxShadow: "rgba(100,70,30,0.05) 0px 4px 16px" }}
            >
              Got it. I think I know just the right place for you. Give me a moment.
            </div>
          </motion.div>
        )}
      </div>

      {/* Compose bar */}
      <div className="bg-card/90 backdrop-blur-md border-t border-border/50 px-4 py-3 pb-8">
        <div className="flex items-center gap-3 bg-background/80 border border-border/60 rounded-[14px] px-4 py-2.5">
          <input
            type="text"
            placeholder="Share what's on your mind…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none font-sans text-[15px] text-foreground placeholder:text-[#8C7B6A]"
          />
          <button className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
            <ArrowUp className="w-3.5 h-3.5 text-background" strokeWidth={2} />
          </button>
        </div>
      </div>
    </AnimatedPage>
  );
}
