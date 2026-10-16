import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { MainLayout } from "@/components/MainLayout";
import { ArrowLeft } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { MOODS, timeAgo } from "@/lib/content";

export default function MoodTracker() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const { data } = useQuery({
    queryKey: ["moods", 30],
    queryFn: () => api.listMoods(30),
  });

  const saveMutation = useMutation({
    mutationFn: () => api.logMood(currentMood!, note.trim() || undefined),
    onSuccess: () => {
      setSaved(true);
      setNote("");
      setCurrentMood(null);
      queryClient.invalidateQueries();
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const handleSave = () => {
    if (currentMood) saveMutation.mutate();
  };

  // One point per day, most recent check-in of the day wins, oldest → newest.
  const byDay = new Map<string, number>();
  for (const e of data?.entries ?? []) {
    const key = new Date(e.createdAt).toISOString().slice(0, 10);
    if (!byDay.has(key)) byDay.set(key, e.mood);
  }
  const chartData = [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, mood]) => mood)
    .slice(-30);

  const recentEntries = (data?.entries ?? []).slice(0, 5);

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
          <div
            className="bg-card rounded-[24px] p-6 border border-border/60"
            style={{ boxShadow: "rgba(100,70,30,0.06) 0px 4px 24px" }}
          >
            <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-5">
              How are you feeling right now?
            </p>
            <div className="flex justify-between mb-6">
              {MOODS.map((m) => (
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
                disabled={!currentMood || saveMutation.isPending}
                className="bg-foreground text-background disabled:opacity-30 font-sans text-[13px] font-medium px-6 py-2.5 rounded-full min-h-[44px]"
              >
                Save check-in
              </button>
            </div>
          </div>

          {chartData.length > 1 && (
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
              </div>
            </div>
          )}

          <div>
            <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-4">
              Recent entries
            </p>
            {recentEntries.length === 0 ? (
              <p className="font-sans text-[14px] text-[#8C7B6A] italic">
                Nothing logged yet. Your first check-in is one tap above.
              </p>
            ) : (
              <div className="space-y-2">
                {recentEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start py-4 border-b border-border/50 last:border-0"
                  >
                    <span className="text-[22px] leading-none mr-3 flex-shrink-0">
                      {MOODS.find((m) => m.id === entry.mood)?.emoji ?? "😐"}
                    </span>
                    <div>
                      <div className="font-sans text-[12px] text-[#8C7B6A] mb-0.5">{timeAgo(entry.createdAt)}</div>
                      {entry.note && (
                        <div className="font-sans text-[14px] text-foreground italic">"{entry.note}"</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </AnimatedPage>
    </MainLayout>
  );
}
