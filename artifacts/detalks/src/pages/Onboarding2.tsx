import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { motion } from "framer-motion";
import { Leaf, MessageCircle, Shield } from "lucide-react";

export default function Onboarding2() {
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
          <div className="relative w-[240px] h-[200px] flex items-center justify-center">
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: -30, opacity: 1, rotate: -6 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="absolute w-[140px] h-[160px] bg-card rounded-2xl shadow-md border border-border flex items-center justify-center -z-10"
            >
              <Leaf className="w-10 h-10 text-primary opacity-50" strokeWidth={1.5} />
            </motion.div>
            
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 30, opacity: 1, rotate: 6 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute w-[140px] h-[160px] bg-card rounded-2xl shadow-md border border-border flex items-center justify-center -z-10"
            >
              <Shield className="w-10 h-10 text-primary opacity-50" strokeWidth={1.5} />
            </motion.div>
            
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute w-[150px] h-[170px] bg-card rounded-2xl shadow-lg border border-[#C9BFB0] flex items-center justify-center z-10"
            >
              <MessageCircle className="w-12 h-12 text-primary" strokeWidth={1.5} />
            </motion.div>
          </div>
        </div>

        <div className="flex-1 px-6 flex flex-col justify-end pb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <h2 className="font-serif text-[32px] text-foreground leading-[1.20] mb-4 px-2">
              Three ways to find support — start wherever feels right.
            </h2>
            <p className="font-sans text-[16px] text-secondary-foreground font-normal leading-[1.65] mb-12">
              From quiet self-guided tools, to a conversation with a trained companion, to a licensed professional — DeTalks meets you where you are.
            </p>
          </motion.div>

          <div className="flex justify-center space-x-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-muted" />
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-muted" />
          </div>

          <button
            onClick={() => setLocation("/onboarding/3")}
            className="w-full bg-primary text-primary-foreground font-sans text-[14px] font-medium py-4 rounded-[12px] min-h-[44px]"
          >
            Next
          </button>
        </div>
      </div>
    </AnimatedPage>
  );
}
