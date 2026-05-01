import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
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

  return (
    <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto pb-8">
      <header className="px-6 pt-10 pb-6">
        <button
          onClick={() => setLocation("/progress")}
          className="p-2 -ml-2 mb-6 min-h-[44px] min-w-[44px] flex items-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground/70" strokeWidth={1.5} />
        </button>
        <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-2">
          After the session
        </p>
        <h1 className="font-serif text-[28px] text-foreground font-normal leading-[1.25]">
          Take what you need from it.
        </h1>
      </header>

      <div className="px-6 space-y-8 flex-1">
        {/* Key themes */}
        <section>
          <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-4">
            Key themes
          </p>
          <div className="flex flex-wrap gap-2">
            {themes.map((t) => (
              <span key={t} className="bg-foreground/[0.05] border border-border/60 text-foreground/70 font-sans text-[13px] px-4 py-2 rounded-full">
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* Memory prompt */}
        <section>
          <p className="font-sans text-[14px] font-medium text-foreground mb-3">
            What's one thing you want to remember?
          </p>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="A thought, a feeling, a reminder…"
            className="w-full bg-card border border-border/60 rounded-[14px] px-4 py-4 font-sans text-[15px] text-foreground placeholder:text-[#8C7B6A] outline-none min-h-[56px]"
          />
        </section>

        {/* Post-session mood */}
        <section>
          <p className="font-sans text-[14px] font-medium text-foreground mb-4">How are you feeling now?</p>
          <div className="flex justify-between">
            {moods.map((m) => (
              <div key={m.id} className="flex flex-col items-center">
                <button
                  onClick={() => setCurrentMood(m.id)}
                  className={`w-[52px] h-[52px] rounded-full flex items-center justify-center mb-2 transition-all duration-300 text-[24px] leading-none active:scale-95 ${
                    currentMood === m.id
                      ? "bg-foreground/[0.06] ring-1 ring-foreground/30 scale-105"
                      : "bg-foreground/[0.025]"
                  }`}
                  aria-label={m.label}
                >
                  <span aria-hidden="true">{m.emoji}</span>
                </button>
                <span className={`font-sans text-[11px] ${currentMood === m.id ? "text-foreground" : "text-[#8C7B6A]"}`}>
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="px-6 pt-8 flex flex-col gap-3">
        <button
          onClick={() => setLocation("/progress")}
          className="w-full bg-foreground text-background font-sans text-[14px] font-medium py-4 rounded-[14px] min-h-[52px]"
        >
          Save to my journey
        </button>
        <button
          onClick={() => setLocation("/progress")}
          className="w-full text-[#8C7B6A] font-sans text-[14px] py-3 min-h-[44px]"
        >
          Skip
        </button>
      </div>
    </AnimatedPage>
  );
}
