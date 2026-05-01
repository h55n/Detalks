import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";

export default function Reflection() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [value, setValue] = useState("");

  const prompts = [
    "What is one thing that felt heavy today?",
    "What is one small thing that went okay?",
    "What do you need right now to feel just 5% better?"
  ];

  const handleNext = () => {
    setValue("");
    if (step < prompts.length) {
      setStep(s => s + 1);
    }
  };

  return (
    <AnimatedPage className="flex flex-col h-full bg-background relative overflow-hidden items-center justify-center p-6">
      <button 
        onClick={() => setLocation("/practice")}
        className="absolute top-safe right-4 p-4 z-20 min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        <X className="w-6 h-6 text-secondary-foreground opacity-50" />
      </button>

      <div className="w-full max-w-[320px]">
        <AnimatePresence mode="wait">
          {step < prompts.length ? (
            <motion.div 
              key={step} 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col w-full"
            >
              <div className="font-sans text-[13px] font-medium text-[#8C7B6A] uppercase tracking-[0.5px] mb-4">
                Question {step + 1} of 3
              </div>
              <h2 className="font-serif text-[24px] text-foreground mb-8 leading-tight">
                {prompts[step]}
              </h2>
              
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Type your thoughts here…"
                className="w-full bg-card border border-border/60 rounded-[14px] p-4 font-sans text-[16px] text-foreground min-h-[120px] resize-none mb-8 placeholder:text-[#8C7B6A] outline-none transition-colors"
              />
              
              <div className="flex justify-end">
                <button 
                  onClick={handleNext}
                  className="bg-primary text-primary-foreground font-sans text-[15px] font-medium py-3 px-8 rounded-full min-h-[44px] active:scale-95 transition-transform"
                >
                  {step === prompts.length - 1 ? "Finish" : "Next"}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="done" 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Check className="w-10 h-10" />
              </div>
              <h2 className="font-serif text-[28px] text-foreground mb-3">Saved to your moment.</h2>
              <p className="font-sans text-[16px] text-secondary-foreground mb-10">
                You took the time to reflect. That matters.
              </p>
              <button 
                onClick={() => setLocation("/practice")}
                className="bg-transparent text-secondary-foreground border border-border px-8 py-3 rounded-full font-sans text-[15px] font-medium min-h-[44px]"
              >
                Return to Practices
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
}
