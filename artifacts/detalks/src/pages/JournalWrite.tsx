import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { ArrowLeft, Check } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function JournalWrite() {
  const [, setLocation] = useLocation();
  const { currentMood, setCurrentMood } = useAppContext();
  const [content, setContent] = useState("");

  const moods = [
    { id: 1, emoji: "😣", label: "Rough" },
    { id: 2, emoji: "😔", label: "Low" },
    { id: 3, emoji: "😐", label: "Okay" },
    { id: 4, emoji: "🙂", label: "Good" },
    { id: 5, emoji: "😄", label: "Great" },
  ];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <AnimatedPage className="flex flex-col h-full bg-background">
      {/* Minimal top bar */}
      <div className="flex items-center justify-between px-5 py-4">
        <button
          onClick={() => setLocation("/journal")}
          className="p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground/70" strokeWidth={1.5} />
        </button>

        {/* Mood row */}
        <div className="flex gap-2">
          {moods.map((m) => (
            <button
              key={m.id}
              onClick={() => setCurrentMood(m.id)}
              aria-label={m.label}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-[18px] leading-none transition-all duration-200 active:scale-95 ${
                currentMood === m.id
                  ? "bg-foreground/[0.07] ring-1 ring-foreground/30 scale-110"
                  : "bg-foreground/[0.025]"
              }`}
            >
              <span aria-hidden="true">{m.emoji}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setLocation("/journal")}
          className="p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-end"
        >
          <Check className="w-5 h-5 text-primary" strokeWidth={2} />
        </button>
      </div>

      <div className="flex-1 px-6 pt-2 pb-8 flex flex-col">
        <p className="font-sans text-[12px] text-[#8C7B6A] mb-6">{today}</p>

        {/* Prompt */}
        <div
          className="rounded-[18px] p-5 mb-6"
          style={{ background: "linear-gradient(160deg, #F2E9CE 0%, #ECE0BD 100%)" }}
        >
          <p className="font-serif text-[18px] text-foreground leading-[1.40] italic">
            "What's one small thing that didn't go wrong today?"
          </p>
        </div>

        {/* Writing area */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing…"
          className="flex-1 w-full bg-transparent border-none outline-none font-sans text-[16px] text-foreground leading-[1.85] placeholder:text-[#8C7B6A]/60 resize-none"
          autoFocus
        />
      </div>
    </AnimatedPage>
  );
}
