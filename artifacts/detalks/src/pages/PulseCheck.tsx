import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

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
        }, 4000);
      }, 1500);
    }, 1000);
  };

  if (loading) {
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
    <AnimatedPage className="bg-background flex flex-col h-full relative">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(237, 231, 220, 0.4) 0%, rgba(245, 239, 230, 0) 60%)'
      }} />

      <div className="flex items-center justify-between p-4 border-b border-transparent z-10">
        <div className="font-serif text-[18px] text-foreground">DeTalks'</div>
        <div className="flex items-center space-x-1.5">
          <div className="w-2 h-2 rounded-full bg-[#4A6B4A]" />
          <span className="font-sans text-[13px] text-secondary-foreground">Disha</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col justify-end space-y-4 z-10">
        <div className="flex flex-col space-y-2 max-w-[85%]">
          <div className="bg-card border border-[#C9BFB0] rounded-[18px] p-4 text-[16px] font-sans text-[#2E4A2E] leading-[1.65]">
            Hey. I'm Disha — I'm here to help you find the right space for you today.
          </div>
          {step >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-[#C9BFB0] rounded-[18px] p-4 text-[16px] font-sans text-[#2E4A2E] leading-[1.65]"
            >
              How have you been feeling lately? Take your time — there's no right answer.
            </motion.div>
          )}
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex overflow-x-auto space-x-2 py-2 no-scrollbar"
          >
            {["Pretty rough lately", "Could be better", "I'm okay, just curious", "I need to talk to someone now"].map((txt, i) => (
              <button
                key={i}
                onClick={handleFirstRound}
                className="whitespace-nowrap bg-card border border-[#C9BFB0] rounded-full px-4 py-2.5 font-sans text-[14px] text-primary"
              >
                {txt}
              </button>
            ))}
          </motion.div>
        )}

        {step === 2 && (
          <div className="flex items-center space-x-2 text-[#8C7B6A]">
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-current" />
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, delay: 0.2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-current" />
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, delay: 0.4, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-current" />
            <span className="font-sans text-[12px] italic ml-1">Listening...</span>
          </div>
        )}

        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col space-y-2 max-w-[85%]"
          >
            <div className="bg-card border border-[#C9BFB0] rounded-[18px] p-4 text-[16px] font-sans text-[#2E4A2E] leading-[1.65]">
              Thank you for telling me. I want to understand a little more — what's been taking up the most space in your mind?
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex overflow-x-auto space-x-2 py-2 no-scrollbar"
          >
            {["Work / studies", "Relationships", "Just feeling low", "Not sure, it's complex"].map((txt, i) => (
              <button
                key={i}
                onClick={handleSecondRound}
                className="whitespace-nowrap bg-card border border-[#C9BFB0] rounded-full px-4 py-2.5 font-sans text-[14px] text-primary"
              >
                {txt}
              </button>
            ))}
          </motion.div>
        )}

        {step === 4 && (
          <div className="flex items-center space-x-2 text-[#8C7B6A]">
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-current" />
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, delay: 0.2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-current" />
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, delay: 0.4, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-current" />
            <span className="font-sans text-[12px] italic ml-1">Listening...</span>
          </div>
        )}

        {step >= 5 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col space-y-2 max-w-[85%]"
          >
            <div className="bg-card border border-[#C9BFB0] rounded-[18px] p-4 text-[16px] font-sans text-[#2E4A2E] leading-[1.65]">
              Got it. I think I know just the right place for you. Give me a moment.
            </div>
          </motion.div>
        )}
      </div>

      <div className="bg-card border-t border-[#C9BFB0] p-4 pb-6 z-10">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Share what's on your mind..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none font-sans text-[16px] text-foreground placeholder:text-muted-foreground"
          />
          <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <ArrowUp className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>
      </div>
    </AnimatedPage>
  );
}
