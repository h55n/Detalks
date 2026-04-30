import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { MainLayout } from "@/components/MainLayout";
import { ArrowLeft } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function MoodTracker() {
  const [, setLocation] = useLocation();
  const { currentMood, setCurrentMood } = useAppContext();
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const moods = [
    { label: "Rough", id: 1, emoji: "😣" },
    { label: "Low", id: 2, emoji: "😔" },
    { label: "Okay", id: 3, emoji: "😐" },
    { label: "Good", id: 4, emoji: "🙂" },
    { label: "Great", id: 5, emoji: "😄" },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const chartData = [
    3, 3, 4, 2, 3, 4, 4, 3, 3, 2, 4, 4, 5, 4, 3, 3, 2, 3, 4, 4, 4, 3, 2, 3, 4, 5, 4, 4, 3, 4
  ];

  const recentEntries = [
    { date: "Today", mood: "🙂", note: "Felt steady today. Got some sun." },
    { date: "Yesterday", mood: "😐", note: "Just an ordinary day." },
    { date: "12 April", mood: "😔", note: "Woke up tired, couldn't shake it." },
    { date: "11 April", mood: "🙂", note: "Good chat with a friend." },
    { date: "10 April", mood: "😣", note: "Too much pressure." },
  ];

  return (
    <MainLayout>
      <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto pb-6">
        <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-md px-4 py-4 border-b border-border">
          <div className="flex items-center">
            <button onClick={() => setLocation("/home")} className="p-2 -ml-2 mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </button>
            <div>
              <h1 className="font-serif text-[28px] text-foreground leading-tight">Mood Tracker</h1>
              <p className="font-sans text-[14px] text-secondary-foreground">Your private emotional arc.</p>
            </div>
          </div>
        </header>

        <div className="p-4 space-y-6">
          <div className="bg-card border border-border rounded-[16px] p-5 shadow-sm">
            <h2 className="font-sans text-[15px] font-semibold text-foreground mb-4">Today's check-in</h2>
            <div className="flex justify-between mb-4">
              {moods.map((m) => (
                <div key={m.id} className="flex flex-col items-center">
                  <button
                    onClick={() => setCurrentMood(m.id)}
                    className={`w-[48px] h-[48px] rounded-full flex items-center justify-center mb-1 transition-all duration-300 text-[24px] leading-none active:scale-95 ${
                      currentMood === m.id ? "bg-primary/15 ring-2 ring-primary scale-105" : "bg-muted border border-[#D4C9B8] hover:bg-muted/70"
                    }`}
                    aria-label={m.label}
                  >
                    <span aria-hidden="true">{m.emoji}</span>
                  </button>
                </div>
              ))}
            </div>
            <textarea
              placeholder="Add a note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-background border border-border rounded-[12px] p-3 font-sans text-[14px] text-foreground mb-4 resize-none h-[80px]"
            />
            <div className="flex items-center justify-between">
              {saved ? (
                <span className="font-sans text-[14px] text-secondary-foreground">Logged. Take a breath.</span>
              ) : (
                <span />
              )}
              <button
                onClick={handleSave}
                className="bg-primary text-primary-foreground font-sans text-[14px] font-medium px-6 py-2 rounded-full min-h-[44px]"
              >
                Save check-in
              </button>
            </div>
          </div>

          <section>
            <h3 className="font-sans text-[13px] font-medium text-[#8C7B6A] uppercase tracking-[0.5px] mb-3">Last 30 days</h3>
            <div className="bg-card border border-border rounded-[16px] p-5 shadow-sm mb-2">
              <div className="h-[120px] w-full flex items-end justify-between relative pt-2 pb-2">
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <polyline
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="1.5"
                    strokeOpacity="0.3"
                    points={chartData.map((v, i) => `${(i / (chartData.length - 1)) * 100},${100 - ((v - 1) / 4) * 100}`).join(" ")}
                  />
                </svg>
                {chartData.map((val, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-primary relative z-10"
                    style={{ bottom: `${((val - 1) / 4) * 100}%` }}
                  />
                ))}
              </div>
            </div>
            <p className="font-sans text-[14px] text-secondary-foreground">Your mood has been generally stable this month.</p>
          </section>

          <section>
            <h3 className="font-sans text-[13px] font-medium text-[#8C7B6A] uppercase tracking-[0.5px] mb-3">Recent entries</h3>
            <div className="space-y-3">
              {recentEntries.map((entry, i) => (
                <div key={i} className="bg-card border border-border rounded-[16px] p-4 shadow-sm flex items-start">
                  <div className="text-[24px] leading-none mr-3">{entry.mood}</div>
                  <div>
                    <div className="font-sans text-[13px] text-secondary-foreground mb-1">{entry.date}</div>
                    <div className="font-sans text-[14px] text-foreground italic">"{entry.note}"</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </AnimatedPage>
    </MainLayout>
  );
}
