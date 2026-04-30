import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { useAppContext } from "@/context/AppContext";
import { ArrowRight, Activity, BookOpen, CircleDot, ChevronRight, User as UserIcon } from "lucide-react";
import { MainLayout } from "@/components/MainLayout";

export default function Home() {
  const [, setLocation] = useLocation();
  const { user, currentMood, setCurrentMood } = useAppContext();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const moods = [
    { label: "Rough", id: 1, icon: <path d="M4 12L8 4L12 20L16 8L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> },
    { label: "Low", id: 2, icon: <path d="M4 8C8 16 16 16 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> },
    { label: "Okay", id: 3, icon: <path d="M4 12C9.33333 12 14.6667 12 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> },
    { label: "Good", id: 4, icon: <path d="M4 16C8 8 16 8 20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> },
    { label: "Great", id: 5, icon: <path d="M4 20L8 4L12 16L16 8L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> },
  ];

  return (
    <MainLayout>
      <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto pb-6">
        <header className="sticky top-0 z-20 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <h1 className="font-sans text-[16px] font-medium text-foreground">
            {getGreeting()}, {user.name}
          </h1>
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-sans text-[14px] font-semibold">
            {user.name.charAt(0)}
          </div>
        </header>

        <div className="p-4 space-y-6">
          <div className="bg-[#F0E8C8] rounded-[20px] p-5 shadow-sm relative overflow-hidden" style={{ boxShadow: "rgba(100,70,30,0.10) 0px 6px 28px" }}>
            <div className="font-sans text-[10px] font-medium text-[#8C7B6A] tracking-[0.8px] uppercase mb-2">TODAY'S PROMPT</div>
            <h2 className="font-serif text-[22px] text-foreground leading-[1.35] mb-2">What's one small thing that didn't go wrong today?</h2>
            <p className="font-sans text-[14px] text-secondary-foreground mb-4">Take 5 minutes. Write anything.</p>
            <button 
              onClick={() => setLocation("/journal/write")}
              className="font-sans text-[14px] font-medium text-primary flex items-center float-right"
            >
              Open Journal <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <div className="clear-both" />
          </div>

          <section>
            <h3 className="font-sans text-[13px] font-medium text-[#8C7B6A] uppercase tracking-[0.5px] mb-3">Quick check-in</h3>
            <div className="flex justify-between">
              {moods.map((m) => (
                <div key={m.id} className="flex flex-col items-center">
                  <button
                    onClick={() => setCurrentMood(m.id)}
                    className={`w-[56px] h-[56px] rounded-full flex items-center justify-center mb-1 transition-colors ${
                      currentMood === m.id ? "bg-primary text-primary-foreground" : "bg-muted text-secondary-foreground border border-[#D4C9B8]"
                    }`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {m.icon}
                    </svg>
                  </button>
                  <span className="font-sans text-[11px] text-foreground">{m.label}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-card border border-border rounded-[16px] p-4 flex shadow-sm">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
              <span className="font-sans text-[16px] font-semibold text-primary">D</span>
            </div>
            <div className="flex-1">
              <div className="font-sans text-[15px] font-semibold text-foreground mb-1">Disha</div>
              <div className="font-sans text-[14px] text-secondary-foreground mb-2">Ready for a conversation when you are.</div>
              <button 
                onClick={() => setLocation("/pulse-check")}
                className="font-sans text-[14px] font-medium text-primary"
              >
                Start a conversation
              </button>
            </div>
          </div>

          <section>
            <h3 className="font-sans text-[13px] font-medium text-[#8C7B6A] uppercase tracking-[0.5px] mb-3">Your tools</h3>
            <div className="flex overflow-x-auto space-x-3 pb-2 no-scrollbar -mx-4 px-4">
              <div className="w-[160px] flex-shrink-0 bg-background border border-[#D4C9B8] border-l-[4px] border-l-primary rounded-[16px] p-3">
                <Activity className="w-5 h-5 text-primary mb-2" />
                <div className="font-sans text-[15px] font-semibold text-foreground">Mood Tracker</div>
                <div className="font-sans text-[13px] text-secondary-foreground">7 days tracked</div>
              </div>
              <div className="w-[160px] flex-shrink-0 bg-background border border-[#D4C9B8] border-l-[4px] border-l-primary rounded-[16px] p-3">
                <BookOpen className="w-5 h-5 text-primary mb-2" />
                <div className="font-sans text-[15px] font-semibold text-foreground">Guided Journal</div>
                <div className="font-sans text-[13px] text-secondary-foreground">3 entries this week</div>
              </div>
              <div onClick={() => setLocation("/practice/breathe")} className="w-[160px] flex-shrink-0 bg-background border border-[#D4C9B8] border-l-[4px] border-l-primary rounded-[16px] p-3 cursor-pointer">
                <CircleDot className="w-5 h-5 text-primary mb-2" />
                <div className="font-sans text-[15px] font-semibold text-foreground">Breathe</div>
                <div className="font-sans text-[13px] text-secondary-foreground">2 min · anytime</div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-sans text-[13px] font-medium text-[#8C7B6A] uppercase tracking-[0.5px] mb-3">Your circles</h3>
            <div className="bg-card border border-border rounded-[16px] p-4 shadow-sm">
              <h4 className="font-serif text-[18px] text-foreground mb-1">Academic Pressure</h4>
              <div className="flex items-center text-[#8C7B6A] font-sans text-[13px] mb-3">
                <span>142 voices</span>
                <span className="mx-2">·</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#2D6A2D] mr-1.5" />
                <span className="text-[#4A6B4A]">Active now</span>
              </div>
              <button 
                onClick={() => setLocation("/community/circle/academic")}
                className="font-sans text-[14px] font-medium text-primary flex items-center"
              >
                Visit Circle
              </button>
            </div>
          </section>
        </div>
      </AnimatedPage>
    </MainLayout>
  );
}
