import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { MainLayout } from "@/components/MainLayout";
import { PenLine, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { entryDate, todaysPrompt } from "@/lib/content";

export default function Journal() {
  const [, setLocation] = useLocation();
  const { data } = useQuery({ queryKey: ["journal"], queryFn: api.listJournal });
  const entries = data?.entries ?? [];

  const getMoodDot = (mood: number | null) => {
    if (mood === null) return "bg-foreground/20";
    if (mood >= 4) return "bg-primary";
    if (mood <= 2) return "bg-[#E8A020]";
    return "bg-foreground/20";
  };

  return (
    <MainLayout>
      <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto">
        <header className="px-6 pt-10 pb-4 flex items-start justify-between">
          <div>
            <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-2">
              Your writing
            </p>
            <h1 className="font-serif text-[30px] text-foreground font-normal leading-[1.15]">
              Journal
            </h1>
          </div>
          <button
            onClick={() => setLocation("/journal/write")}
            className="mt-2 flex items-center font-sans text-[13px] font-medium text-foreground/70 bg-foreground/[0.04] border border-border/60 px-4 py-2 rounded-full min-h-[44px] hover:bg-foreground/[0.07] transition-colors"
          >
            New <PenLine className="w-3.5 h-3.5 ml-1.5" strokeWidth={1.5} />
          </button>
        </header>

        <div className="px-6 space-y-8 pb-8">
          <div
            className="rounded-[24px] p-6"
            style={{
              background: "linear-gradient(180deg, #F2E9CE 0%, #ECE0BD 100%)",
              boxShadow: "rgba(100,70,30,0.08) 0px 4px 24px",
            }}
          >
            <p className="font-sans text-[10px] font-medium text-[#8C7B6A] tracking-[0.22em] uppercase mb-3">
              Today's prompt
            </p>
            <h2 className="font-serif text-[22px] text-foreground leading-[1.30] mb-4">
              {todaysPrompt()}
            </h2>
            <button
              onClick={() => setLocation("/journal/write")}
              className="font-sans text-[13px] font-medium text-foreground/80 inline-flex items-center min-h-[44px] group"
            >
              Write now
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
            </button>
          </div>

          <div>
            <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-5">
              Past entries
            </p>
            {entries.length === 0 ? (
              <p className="font-sans text-[14px] text-[#8C7B6A] italic">
                No entries yet. What you write here stays private to you.
              </p>
            ) : (
              <div className="space-y-3">
                {entries.map((entry) => {
                  const d = entryDate(entry.createdAt);
                  return (
                    <button
                      key={entry.id}
                      onClick={() => setLocation(`/journal/edit/${entry.id}`)}
                      className="w-full text-left bg-card rounded-[20px] p-5 border border-border/60 active:scale-[0.99] transition-transform"
                      style={{ boxShadow: "rgba(100,70,30,0.05) 0px 4px 16px" }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getMoodDot(entry.mood)}`} />
                          <span className="font-sans text-[13px] text-[#8C7B6A]">
                            {d.day}, {d.date}
                          </span>
                        </div>
                        <span className="font-sans text-[12px] text-[#8C7B6A]">{d.time}</span>
                      </div>
                      <p className="font-sans text-[15px] text-foreground leading-[1.65] line-clamp-2">
                        {entry.content}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </AnimatedPage>
    </MainLayout>
  );
}
