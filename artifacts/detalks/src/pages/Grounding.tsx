import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";

export default function Grounding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);

  const prompts = [
    { num: 5, text: "Look around you. Name 5 things you can see.", sub: "A pen, a shadow, a spot on the wall..." },
    { num: 4, text: "Focus on your body. Name 4 things you can feel.", sub: "Your feet on the floor, your clothes against your skin..." },
    { num: 3, text: "Listen closely. Name 3 things you can hear.", sub: "A fan, distant traffic, your own breath..." },
    { num: 2, text: "Take a gentle breath. Name 2 things you can smell.", sub: "Or name two smells you find comforting." },
    { num: 1, text: "Name 1 good thing about yourself.", sub: "Something small, something real." }
  ];

  const handleNext = () => {
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

      <div className="w-full max-w-[320px] text-center">
        <AnimatePresence mode="wait">
          {step < prompts.length ? (
            <motion.div 
              key={step} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-serif text-[32px] mb-8">
                {prompts[step].num}
              </div>
              <h2 className="font-serif text-[24px] text-foreground mb-4 leading-tight">
                {prompts[step].text}
              </h2>
              <p className="font-sans text-[16px] text-secondary-foreground mb-12">
                {prompts[step].sub}
              </p>
              <button 
                onClick={handleNext}
                className="bg-primary text-primary-foreground font-sans text-[15px] font-medium py-3 px-10 rounded-full min-h-[44px]"
              >
                Next
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="done" 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Check className="w-10 h-10" />
              </div>
              <h2 className="font-serif text-[28px] text-foreground mb-3">Done.</h2>
              <p className="font-sans text-[16px] text-secondary-foreground mb-10">
                Take a breath. You are here.
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

      {step < prompts.length && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
          {prompts.map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full transition-colors ${i === step ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>
      )}
    </AnimatedPage>
  );
}
