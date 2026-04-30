import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { motion } from "framer-motion";

export default function Onboarding3() {
  const [, setLocation] = useLocation();

  return (
    <AnimatedPage className="bg-background flex flex-col h-full relative">
      <div className="flex-1 flex flex-col pt-12">
        <div className="h-[45%] w-full flex items-center justify-center relative">
          <div className="relative w-[200px] h-[120px] flex items-center justify-center">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="absolute left-6 w-[100px] h-[100px] rounded-full bg-primary/20 backdrop-blur-sm mix-blend-multiply"
            />
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute right-6 w-[100px] h-[100px] rounded-full bg-card border-2 border-primary/40 backdrop-blur-sm mix-blend-multiply"
            />
          </div>
        </div>

        <div className="flex-1 px-6 flex flex-col justify-end pb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <h2 className="font-serif text-[32px] text-foreground leading-[1.20] mb-4 px-2">
              Every conversation is safe, supervised, and yours alone.
            </h2>
            <p className="font-sans text-[16px] text-secondary-foreground font-normal leading-[1.65] mb-12">
              Your sessions are private, monitored by our AI guardian Kavach, and never stored for advertising. You're in control.
            </p>
          </motion.div>

          <div className="flex justify-center space-x-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-muted" />
            <div className="w-2 h-2 rounded-full bg-muted" />
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>

          <div className="flex flex-col space-y-4">
            <button
              onClick={() => setLocation("/auth")}
              className="w-full bg-primary text-primary-foreground font-sans text-[14px] font-medium py-4 rounded-[12px] min-h-[44px]"
            >
              Create My Account
            </button>
            <button
              onClick={() => setLocation("/auth")}
              className="font-sans text-[14px] text-[#8C7B6A] min-h-[44px] px-4"
            >
              Sign in instead
            </button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
