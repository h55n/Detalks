import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function Auth() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isStudent, setIsStudent] = useState(false);

  return (
    <AnimatedPage className="bg-background flex flex-col h-full">
      <div className="p-6 pb-2">
        <button onClick={() => setLocation("/splash")} className="p-2 -ml-2 mb-6">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        
        <h1 className="font-serif text-[32px] text-foreground mb-2">Let's set up your space</h1>
        <p className="font-sans text-[15px] text-secondary-foreground">No pressure. Takes 30 seconds.</p>
      </div>

      <div className="flex-1 px-6 pt-6 pb-8 flex flex-col space-y-6">
        <div className="space-y-4">
          <div className="bg-card border border-[#C9BFB0] rounded-[10px] p-1 px-4">
            <label className="block text-[12px] font-sans text-secondary-foreground pt-1">What should we call you?</label>
            <input 
              type="text" 
              placeholder="Your name or a nickname" 
              className="w-full bg-transparent border-none outline-none font-sans text-[16px] text-foreground pb-2 pt-1 placeholder:text-muted-foreground"
            />
          </div>

          <div className="bg-card border border-[#C9BFB0] rounded-[10px] p-1 px-4">
            <label className="block text-[12px] font-sans text-secondary-foreground pt-1">Your email</label>
            <input 
              type="email" 
              placeholder="we keep this private" 
              className="w-full bg-transparent border-none outline-none font-sans text-[16px] text-foreground pb-2 pt-1 placeholder:text-muted-foreground"
            />
          </div>

          <div className="bg-card border border-[#C9BFB0] rounded-[10px] p-1 px-4 flex items-center">
            <div className="flex-1">
              <label className="block text-[12px] font-sans text-secondary-foreground pt-1">A safe password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="w-full bg-transparent border-none outline-none font-sans text-[16px] text-foreground pb-2 pt-1 placeholder:text-muted-foreground"
              />
            </div>
            <button onClick={() => setShowPassword(!showPassword)} className="p-2 text-muted-foreground">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="py-2">
          <div className="flex items-center justify-between mb-4">
            <span className="font-sans text-[15px] text-foreground">Are you a psychology student?</span>
            <Switch 
              checked={isStudent} 
              onCheckedChange={setIsStudent}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <AnimatePresence>
            {isStudent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 overflow-hidden"
              >
                <div className="bg-card border border-[#C9BFB0] rounded-[10px] p-1 px-4">
                  <label className="block text-[12px] font-sans text-secondary-foreground pt-1">Your college email</label>
                  <input 
                    type="email" 
                    placeholder="student@university.edu" 
                    className="w-full bg-transparent border-none outline-none font-sans text-[16px] text-foreground pb-2 pt-1 placeholder:text-muted-foreground"
                  />
                  <div className="pb-2 text-[13px] font-sans text-primary">Unlock student pricing (₹99/month)</div>
                </div>

                <div className="bg-[#F0E8C8] rounded-[16px] p-4 border border-[#D4C9B8]">
                  <p className="font-sans text-[14px] text-foreground">
                    Student benefits unlocked: ₹99/month · 30% off professional sessions
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-auto pt-6 flex flex-col items-center">
          <button
            onClick={() => setLocation("/pulse-check")}
            className="w-full bg-primary text-primary-foreground font-sans text-[14px] font-medium py-4 rounded-[12px] min-h-[44px]"
          >
            Start My Journey
          </button>
          <p className="mt-6 font-sans text-[11px] text-[#8C7B6A] text-center px-4">
            By continuing, you agree to our terms. Your data is encrypted and never sold.
          </p>
        </div>
      </div>
    </AnimatedPage>
  );
}
