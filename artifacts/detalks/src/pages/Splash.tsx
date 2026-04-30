import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { motion } from "framer-motion";

export default function Splash() {
  const [, setLocation] = useLocation();
  const [showTagline, setShowTagline] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowTagline(true), 200);
    const timer2 = setTimeout(() => setPulse(true), 800);
    const timer3 = setTimeout(() => setShowButton(true), 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <AnimatedPage className="bg-background flex flex-col items-center justify-center p-6">
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="font-serif text-[48px] text-foreground tracking-tight">DeTalks'</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showTagline ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="mt-2 text-center"
        >
          <p className="font-sans text-[16px] text-secondary-foreground font-normal tracking-[0.5px]">
            A Journey Towards Finding You
          </p>
        </motion.div>

        <div className="mt-8 h-[20px] flex items-center justify-center relative">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2L10 18M2 10L18 10M4.34315 4.34315L15.6569 15.6569M4.34315 15.6569L15.6569 4.34315" stroke="currentColor" className="text-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {pulse && (
            <motion.div
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-accent pointer-events-none"
            />
          )}
        </div>
      </div>

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: showButton ? 0 : 40, opacity: showButton ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full pb-8 flex flex-col items-center space-y-4"
      >
        <button
          onClick={() => setLocation("/onboarding/1")}
          className="w-full bg-primary text-primary-foreground font-sans text-[14px] font-medium py-4 rounded-[12px] shadow-md min-h-[44px]"
          style={{ boxShadow: "rgba(45, 106, 45, 0.28) 0px 4px 16px" }}
        >
          Get Started
        </button>
        <button
          onClick={() => setLocation("/auth")}
          className="font-sans text-[14px] text-[#8C7B6A] min-h-[44px] px-4"
        >
          I already have an account
        </button>
      </motion.div>
    </AnimatedPage>
  );
}
