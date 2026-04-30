import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { MainLayout } from "@/components/MainLayout";
import { ArrowLeft } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function SessionReflection() {
  const [, setLocation] = useLocation();
  const [note, setNote] = useState("");
  const { currentMood, setCurrentMood } = useAppContext();

  const themes = ["Academic pressure", "Sleep", "Self-compassion"];

  const moods = [
    { label: "Rough", id: 1, emoji: "😣" },
    { label: "Low", id: 2, emoji: "😔" },
    { label: "Okay", id: 3, emoji: "😐" },
    { label: "Good", id: 4, emoji: "🙂" },
    { label: "Great", id: 5, emoji: "😄" },
  ];

  const handleSave = () => {
    // Show toast here if we had access to toaster directly, or rely on AppContext/UI
    setLocation("/progress");
  };

  return (
    <MainLayout>
      <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto pb-6 relative">
        <header className="px-4 py-6 pt-safe flex flex-col">
          <button onClick={() => setLocation("/progress")} className="p-2 -ml-2 mb-4 w-min">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="font-serif text-[24px] text-foreground leading-tight">Take what you need from it.</h1>
        </header>

        <div className="px-4 space-y-8 flex-1">
          <section>
            <h3 className="font-sans text-[13px] font-medium text-[#8C7B6A] uppercase tracking-[0.5px] mb-3">Key themes</h3>
            <div className="flex flex-wrap gap-2">
              {themes.map(t => (
                <span key={t} className="bg-primary/10 text-primary font-sans text-[14px] font-medium px-4 py-2 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-sans text-[15px] font-medium text-foreground mb-3">What's one thing you want to remember?</h3>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="A thought, a feeling, a reminder..."
              className="w-full bg-card border border-border rounded-[12px] p-4 font-sans text-[15px] text-foreground min-h-[56px]"
            />
          </section>

          <section>
            <h3 className="font-sans text-[15px] font-medium text-foreground mb-3">How are you feeling now?</h3>
            <div className="flex justify-between bg-card p-4 rounded-[16px] border border-border">
              {moods.map((m) => (
                <div key={m.id} className="flex flex-col items-center">
                  <button
                    onClick={() => setCurrentMood(m.id)}
                    className={`w-[48px] h-[48px] rounded-full flex items-center justify-center transition-all duration-300 text-[24px] leading-none active:scale-95 ${
                      currentMood === m.id ? "bg-primary/15 ring-2 ring-primary scale-105" : "bg-muted border border-[#D4C9B8]"
                    }`}
                    aria-label={m.label}
                  >
                    <span aria-hidden="true">{m.emoji}</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="px-4 pb-safe pt-6 flex flex-col gap-3">
          <button
            onClick={handleSave}
            className="w-full bg-primary text-primary-foreground font-sans text-[15px] font-medium py-3 rounded-[12px] min-h-[44px]"
          >
            Save to my journey
          </button>
          <button
            onClick={() => setLocation("/progress")}
            className="w-full bg-transparent text-secondary-foreground font-sans text-[15px] font-medium py-3 rounded-[12px] min-h-[44px]"
          >
            Skip
          </button>
        </div>
      </AnimatedPage>
    </MainLayout>
  );
}
