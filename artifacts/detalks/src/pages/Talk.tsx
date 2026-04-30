import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { MainLayout } from "@/components/MainLayout";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Talk() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<"companions" | "community">("companions");
  const [finding, setFinding] = useState(false);

  const startSession = () => {
    if (sessionStorage.getItem('detalks-consent')) {
      setLocation("/session/precheck");
    } else {
      setLocation("/consent");
    }
  };

  const circles = [
    { id: "academic", name: "Academic Pressure", voices: 142, tag: "Studies", post: "'Sometimes just knowing others feel this way...' — TidePebble" },
    { id: "loneliness", name: "Loneliness", voices: 89, tag: "Connection", post: "'Is it normal to feel lonely even in a crowded dorm?' — QuietBranch" },
    { id: "grief", name: "Grief", voices: 64, tag: "Loss", post: "'It comes in waves, unexpectedly.' — AutumnMist" },
    { id: "relationship", name: "Relationship Transitions", voices: 76, tag: "Life Changes", post: "'Moving on is harder than I thought.' — FallenLeaf" },
    { id: "work", name: "Work Stress", voices: 211, tag: "Career", post: "'The emails never stop coming...' — RushedRiver" },
    { id: "identity", name: "Identity", voices: 92, tag: "Self", post: "'Who am I when nobody is watching?' — DeepRoot" },
  ];

  return (
    <MainLayout>
      <AnimatedPage className="flex flex-col h-full bg-background overflow-hidden">
        {finding && (
          <div className="absolute inset-0 bg-card z-50 rounded-t-[24px] mt-4 flex flex-col items-center justify-center p-6 shadow-[0px_-10px_40px_rgba(100,70,30,0.1)]">
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[100px] h-[100px] rounded-full bg-primary/20"
            />
            <motion.h2 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
              className="font-serif text-[24px] text-foreground z-10 mb-4"
            >
              Finding your companion...
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="font-sans text-[14px] text-secondary-foreground text-center max-w-[280px] z-10"
            >
              Randomly assigning from available companions. This keeps every conversation fresh.
            </motion.p>
          </div>
        )}

        <div className="px-4 pt-4 pb-2">
          <div className="flex justify-between items-center mb-4">
            <div />
            <button onClick={() => setLocation("/professional")} className="font-sans text-[12px] font-medium text-primary flex items-center bg-primary/10 px-3 py-1.5 rounded-full">
              Looking for a licensed professional? <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
          <div className="flex bg-muted p-1 rounded-full w-max mx-auto">
            <button
              onClick={() => setTab("companions")}
              className={`px-4 py-1.5 rounded-full font-sans text-[14px] font-medium transition-colors ${
                tab === "companions" ? "bg-primary text-primary-foreground" : "text-secondary-foreground"
              }`}
            >
              Companions
            </button>
            <button
              onClick={() => setTab("community")}
              className={`px-4 py-1.5 rounded-full font-sans text-[14px] font-medium transition-colors ${
                tab === "community" ? "bg-primary text-primary-foreground" : "text-secondary-foreground"
              }`}
            >
              Community
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pt-2">
          {tab === "companions" ? (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="bg-card border border-border rounded-[16px] p-5 shadow-sm">
                <h2 className="font-serif text-[22px] text-foreground mb-2">Talk to a trained companion</h2>
                <p className="font-sans text-[14px] text-secondary-foreground leading-[1.60] mb-5">
                  Every session is with a randomly assigned psychology student, supervised in real time.
                </p>
                <button
                  onClick={startSession}
                  className="w-full bg-primary text-primary-foreground font-sans text-[14px] font-medium py-3 rounded-[12px] min-h-[44px]"
                >
                  Let's talk
                </button>
              </div>

              <div className="flex flex-wrap gap-2 justify-center pb-2">
                {["45 min max", "Text-based", "Always supervised"].map(txt => (
                  <span key={txt} className="bg-muted text-secondary-foreground font-sans text-[12px] font-medium px-3 py-1.5 rounded-full">
                    {txt}
                  </span>
                ))}
              </div>
              
              <div className="text-center px-4">
                <p className="font-sans text-[12px] text-[#8C7B6A] italic">
                  You'll be matched with a different companion each time — a fresh space, every conversation.
                </p>
              </div>

              <div>
                <h3 className="font-sans text-[13px] font-medium text-[#8C7B6A] uppercase tracking-[0.5px] mb-3">Your recent sessions</h3>
                <div className="bg-card border border-border rounded-[16px] p-4 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-[13px] text-[#8C7B6A]">Session 3</span>
                    <span className="font-sans text-[13px] text-[#8C7B6A]">12 April</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-primary/10 text-primary font-sans text-[12px] font-medium px-3 py-1 rounded-full">Academic pressure</span>
                    <span className="bg-primary/10 text-primary font-sans text-[12px] font-medium px-3 py-1 rounded-full">Stress</span>
                  </div>
                  <div className="font-sans text-[12px] text-muted-foreground text-right">
                    45 min · 198 messages
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 pb-6">
              <h2 className="font-serif text-[22px] text-foreground mb-4 px-2">Anonymous spaces to feel less alone</h2>
              {circles.map(circle => (
                <div key={circle.id} className="bg-card border border-border rounded-[16px] p-5 shadow-sm space-y-3">
                  <h3 className="font-serif text-[20px] text-foreground">{circle.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="bg-primary/10 text-primary font-sans text-[12px] font-medium px-3 py-1 rounded-full">
                      {circle.tag}
                    </span>
                    <span className="font-sans text-[13px] text-[#8C7B6A]">{circle.voices} voices</span>
                  </div>
                  <p className="font-sans text-[14px] text-secondary-foreground italic leading-[1.60] line-clamp-2">
                    {circle.post}
                  </p>
                  <button 
                    onClick={() => setLocation(`/community/circle/${circle.id}`)}
                    className="font-sans text-[14px] font-medium text-primary mt-2 min-h-[44px] flex items-center"
                  >
                    Visit Circle
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </AnimatedPage>
    </MainLayout>
  );
}
