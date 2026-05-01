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

  const chartData = [3, 3, 4, 2, 3, 4, 4, 3, 3, 2, 4, 4, 5, 4, 3, 3, 2, 3, 4, 4, 4, 3, 2, 3, 4, 5, 4, 4, 3, 4];

  const recentEntries = [
    { date: "Today", mood: "🙂", note: "Felt steady today. Got some sun." },
    { date: "Yesterday", mood: "😐", note: "Just an ordinary day." },
    { date: "12 April", mood: "😔", note: "Woke up tired, couldn't shake it." },
    { date: "11 April", mood: "🙂", note: "Good chat with a friend." },
    { date: "10 April", mood: "😣", note: "Too much pressure." },
  ];

  return (
    <MainLayout>
      <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto">
        <header className="px-6 pt-10 pb-4">
          <button
            onClick={() => setLocation("/home")}
            className="p-2 -ml-2 mb-4 min-h-[44px] min-w-[44px] flex items-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground/70" strokeWidth={1.5} />
          </button>
          <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-2">
            Daily check-in
          </p>
          <h1 className="font-serif text-[30px] text-foreground font-normal leading-[1.15]">
            Mood Tracker
          </h1>
          <p className="font-sans text-[14px] text-[#8C7B6A] mt-2">Your private emotional arc.</p>
        </header>

        <div className="px-6 space-y-8 pb-8">
          {/* Today's check-in */}
          <div
            className="bg-card rounded-[24px] p-6 border border-border/60"
            style={{ boxShadow: "rgba(100,70,30,0.06) 0px 4px 24px" }}
          >
            <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-5">
              How are you feeling right now?
            </p>
            <div className="flex justify-between mb-6">
              {moods.map((m) => (
                <div key={m.id} className="flex flex-col items-center">
                  <button
                    onClick={() => setCurrentMood(m.id)}
                    className={`w-[52px] h-[52px] rounded-full flex items-center justify-center mb-2 transition-all duration-300 text-[24px] leading-none active:scale-95 ${
                      currentMood === m.id
                        ? "bg-foreground/[0.06] ring-1 ring-foreground/30 scale-105"
                        : "bg-foreground/[0.025] hover:bg-foreground/[0.05]"
                    }`}
                    aria-label={m.label}
                  >
                    <span aria-hidden="true">{m.emoji}</span>
                  </button>
                  <span className={`font-sans text-[11px] transition-colors ${currentMood === m.id ? "text-foreground" : "text-[#8C7B6A]"}`}>
                    {m.label}
                  </span>
                </div>
              ))}
            </div>

            <textarea
              placeholder="Add a note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-background/80 border border-border/60 rounded-[14px] p-4 font-sans text-[14px] text-foreground placeholder:text-[#8C7B6A] mb-5 resize-none h-[80px] outline-none"
            />

            <div className="flex items-center justify-between">
              {saved ? (
                <span className="font-sans text-[13px] text-[#8C7B6A] italic">Logged. Take a breath.</span>
              ) : (
                <span />
              )}
              <button
                onClick={handleSave}
                className="bg-foreground text-background font-sans text-[13px] font-medium px-6 py-2.5 rounded-full min-h-[44px]"
              >
                Save check-in
              </button>
            </div>
          </div>

          {/* Chart */}
          <div>
            <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-4">
              Last 30 days
            </p>
            <div
              className="bg-card rounded-[20px] p-5 border border-border/60"
              style={{ boxShadow: "rgba(100,70,30,0.04) 0px 4px 16px" }}
            >
              <div className="h-[100px] w-full relative">
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polygon
                    fill="url(#moodGrad)"
                    points={`0,100 ${chartData.map((v, i) => `${(i / (chartData.length - 1)) * 100},${100 - ((v - 1) / 4) * 80}`).join(" ")} 100,100`}
                  />
                  <polyline
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={chartData.map((v, i) => `${(i / (chartData.length - 1)) * 100},${100 - ((v - 1) / 4) * 80}`).join(" ")}
                  />
                </svg>
              </div>
              <p className="font-sans text-[13px] text-[#8C7B6A] mt-4">Your mood has been generally stable this month.</p>
            </div>
          </div>

          {/* Recent entries */}
          <div>
            <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-4">
              Recent entries
            </p>
            <div className="space-y-2">
              {recentEntries.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-start py-4 border-b border-border/50 last:border-0"
                >
                  <span className="text-[22px] leading-none mr-3 flex-shrink-0">{entry.mood}</span>
                  <div>
                    <div className="font-sans text-[12px] text-[#8C7B6A] mb-0.5">{entry.date}</div>
                    <div className="font-sans text-[14px] text-foreground italic">"{entry.note}"</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedPage>
    </MainLayout>
  );
}
