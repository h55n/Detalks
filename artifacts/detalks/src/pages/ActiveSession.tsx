import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mic, ArrowUp, X } from "lucide-react";

export default function ActiveSession() {
  const [, setLocation] = useLocation();
  const [showExit, setShowExit] = useState(false);
  const [showKavach, setShowKavach] = useState(false); // Can be triggered for demo
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const chat = [
    { sender: "Companion", text: "I'm glad you're here. What's been on your mind lately?" },
    { sender: "User", text: "Just a lot of pressure from exams and I haven't been sleeping well" },
    { sender: "Companion", text: "That sounds exhausting — carrying both the pressure and the sleep deprivation together. How long has this been going on?" },
    { sender: "User", text: "Maybe 3 weeks now. I keep waking up at 3am thinking about everything" },
    { sender: "Companion", text: "3am thoughts are their own kind of heavy. When you wake up, what's usually the first thing your mind goes to?" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeWarning(true);
    }, 8000); // Demo delay for 5-min warning

    return () => clearTimeout(timer);
  }, []);

  const triggerClose = () => {
    setShowExit(true);
  };

  return (
    <AnimatedPage className="flex flex-col h-full bg-background relative overflow-hidden">
      {/* Header */}
      <div className="h-[56px] flex items-center px-5 justify-between relative z-10 border-b border-border/50">
        <button onClick={triggerClose} className="p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground/70" strokeWidth={1.5} />
        </button>
        <div className="font-sans text-[13px] font-medium text-[#8C7B6A]">Session in progress</div>
        <div className="font-sans text-[13px] text-[#8C7B6A] font-mono">32:14</div>
        <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-foreground/[0.04]">
          <div className="h-full bg-primary/60 w-[70%]" />
        </div>
      </div>

      <div className="text-right px-4 pt-2 font-sans text-[12px] text-muted-foreground">
        198 / 200 messages
      </div>

      {/* Time Warning Toast */}
      <AnimatePresence>
        {showTimeWarning && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="absolute top-[80px] left-4 right-4 z-20"
          >
            <div className="bg-card border border-[#E0D8CC] rounded-full p-3 px-4 shadow-sm flex items-center justify-between">
              <span className="font-sans text-[13px] text-secondary-foreground">
                You've been talking for a while. Take a breath — this session will close in 5 minutes.
              </span>
              <button onClick={() => setShowTimeWarning(false)} className="ml-2 text-muted-foreground p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-2 space-y-4">
        {chat.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.sender === "User" ? "items-end" : "items-start"}`}>
            {msg.sender === "Companion" && i === 0 && (
              <span className="font-sans text-[11px] text-[#8C7B6A] mb-1 ml-1">Companion</span>
            )}
            <div 
              className={`max-w-[75%] p-4 font-sans text-[16px] leading-[1.60] ${
                msg.sender === "User" 
                  ? "bg-primary text-primary-foreground rounded-[18px_18px_4px_18px]" 
                  : "bg-card border border-border text-foreground rounded-[18px_18px_18px_4px]"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        
        <div className="flex items-center space-x-2 text-[#8C7B6A] pt-2">
          <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-current" />
          <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, delay: 0.2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-current" />
          <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, delay: 0.4, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-current" />
          <span className="font-sans text-[12px] italic ml-1">Listening...</span>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-card/90 backdrop-blur-md border-t border-border/50 p-4 pb-8 z-10 flex items-end gap-3">
        <button className="p-2 text-foreground/30 mb-0.5 min-w-[44px] min-h-[44px] flex items-center justify-center">
          <Mic className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <div className="flex-1 bg-background/80 border border-border/60 rounded-[14px] px-4 py-2.5">
          <textarea
            placeholder="Share what's on your mind…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-transparent border-none outline-none font-sans text-[15px] text-foreground placeholder:text-[#8C7B6A] resize-none max-h-[100px]"
            rows={1}
          />
        </div>
        <button className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform">
          <ArrowUp className="w-4 h-4 text-background" strokeWidth={2} />
        </button>
      </div>

      {/* Kavach Alert Panel (Hidden by default, shown for demo) */}
      <AnimatePresence>
        {showKavach && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="absolute bottom-0 left-0 right-0 bg-card border-t-[3px] border-[#E8A020] rounded-t-[20px] p-6 z-30 shadow-[0px_-10px_40px_rgba(100,70,30,0.18)]"
          >
            <h3 className="font-sans text-[18px] font-semibold text-foreground mb-2">A gentle reminder</h3>
            <p className="font-sans text-[15px] text-secondary-foreground mb-6">
              The conversation seems to be shifting. Check in with how your seeker is doing.
            </p>
            <div className="flex flex-col space-y-3">
              <button className="w-full bg-primary text-primary-foreground font-sans text-[14px] font-medium py-3 rounded-[12px] min-h-[44px]">
                Get supervisor support
              </button>
              <button onClick={() => setShowKavach(false)} className="w-full bg-transparent text-secondary-foreground font-sans text-[14px] font-medium py-3 rounded-[12px] min-h-[44px]">
                I've got this
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Close Overlay */}
      <AnimatePresence>
        {showExit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-background/95 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-6"
          >
            <h2 className="font-serif text-[24px] text-foreground text-center mb-4">
              This conversation has been saved to your journey.
            </h2>
            <p className="font-sans text-[16px] text-secondary-foreground mb-8 text-center">
              Take what you need from it.
            </p>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
              onClick={() => setLocation("/session/reflection")}
              className="w-full max-w-[300px] bg-primary text-primary-foreground font-sans text-[14px] font-medium py-4 rounded-[12px] min-h-[44px]"
            >
              Return Home
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
