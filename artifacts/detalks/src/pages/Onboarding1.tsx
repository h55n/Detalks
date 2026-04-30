import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { motion } from "framer-motion";

export default function Onboarding1() {
  const [, setLocation] = useLocation();

  return (
    <AnimatedPage className="bg-background flex flex-col h-full relative">
      <div className="absolute top-0 right-0 p-6 z-10">
        <button 
          onClick={() => setLocation("/auth")}
          className="font-sans text-[14px] text-[#8C7B6A] min-h-[44px] px-2"
        >
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col pt-12">
        <div className="h-[45%] w-full flex items-center justify-center relative">
          {/* Breathing concentric rings */}
          <div className="relative w-[200px] h-[200px] flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full border border-primary bg-primary/5"
            />
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.3, 0.2] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute inset-4 rounded-full border border-primary bg-primary/10"
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.5, 0.4] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute inset-8 rounded-full border border-primary bg-primary/20"
            />
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.8, 0.6] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute inset-12 rounded-full border-2 border-primary bg-primary/30"
            />
          </div>
        </div>

        <div className="flex-1 px-6 flex flex-col justify-end pb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <h2 className="font-serif text-[32px] text-foreground leading-[1.20] mb-4 px-2">
              You don't have to figure it out alone.
            </h2>
            <p className="font-sans text-[16px] text-secondary-foreground font-normal leading-[1.65] px-2 mb-12">
              DeTalks is a calm space where you can process what's on your mind — at your pace, in your own way.
            </p>
          </motion.div>

          <div className="flex justify-center space-x-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-muted" />
            <div className="w-2 h-2 rounded-full bg-muted" />
          </div>

          <button
            onClick={() => setLocation("/onboarding/2")}
            className="w-full bg-primary text-primary-foreground font-sans text-[14px] font-medium py-4 rounded-[12px] min-h-[44px]"
          >
            Next
          </button>
        </div>
      </div>
    </AnimatedPage>
  );
}
