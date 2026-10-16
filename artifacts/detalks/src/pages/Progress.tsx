import { AnimatedPage } from "@/components/AnimatedPage";
import { MainLayout } from "@/components/MainLayout";
import { Flame, Sprout } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function Progress() {
  const { data } = useQuery({ queryKey: ["progress"], queryFn: api.progress });

  const stats = [
    { value: String(data?.sessionsCount ?? 0), label: "Companion sessions" },
    { value: String(data?.journalCount ?? 0), label: "Journal entries" },
    { value: String(data?.daysCheckedIn ?? 0), label: "Days checked in" },
    { value: String(data?.moodsLast30Days ?? 0), label: "Check-ins this month" },
  ];

  const streak = data?.streak ?? 0;
  const moodHistory = data?.moodHistory ?? [];

  return (
    <MainLayout>
      <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto">
        <header className="px-6 pt-10 pb-4">
          <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-2">
            Your arc
          </p>
          <h1 className="font-serif text-[30px] text-foreground font-normal leading-[1.15]">
            Journey
          </h1>
        </header>

        <div className="px-6 space-y-8 pb-8">
          <div
            className="bg-card rounded-[24px] p-6 border border-border/60"
            style={{ boxShadow: "rgba(100,70,30,0.06) 0px 4px 24px" }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-1">
                  Current streak
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-[44px] text-foreground leading-none">{streak}</span>
                  <span className="font-sans text-[14px] text-[#8C7B6A] mb-1">{streak === 1 ? "day" : "days"}</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#F5C518]/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-[#F5C518]" strokeWidth={1.5} />
              </div>
            </div>

            {moodHistory.some((m) => m !== null) && (
              <>
                <div className="flex justify-between items-end h-[56px]">
                  {moodHistory.map((val, i) => (
                    <div key={i} className="flex flex-col items-center justify-end h-full w-[10%]">
                      <div
                        className="w-full rounded-t-[3px]"
                        style={{
                          height: val ? `${(val / 5) * 100}%` : "4%",
                          background: "var(--color-primary)",
                          opacity: val ? (i === 6 ? 1 : 0.25 + (i / moodHistory.length) * 0.4) : 0.08,
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 font-sans text-[10px] text-[#8C7B6A] uppercase">
                  {[...Array(7)].map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    return <span key={i}>{d.toLocaleDateString("en-US", { weekday: "narrow" })}</span>;
                  })}
                </div>
              </>
            )}
          </div>

          {streak >= 7 ? (
            <div
              className="bg-card rounded-[24px] p-6 border border-border/60"
              style={{
                boxShadow: "rgba(245, 197, 24, 0.12) 0px 0px 0px 1.5px, rgba(100,70,30,0.05) 0px 4px 20px",
              }}
            >
              <p className="font-sans text-[10px] font-medium text-[#F5C518] tracking-[0.22em] uppercase mb-3">
                Milestone
              </p>
              <h3 className="font-serif text-[22px] text-foreground mb-2">First Week Complete</h3>
              <p className="font-sans text-[14px] text-[#8C7B6A] leading-relaxed">
                You showed up for yourself for 7 days straight. That's a beautiful start.
              </p>
            </div>
          ) : (
            <div
              className="bg-card rounded-[24px] p-6 border border-border/60"
              style={{ boxShadow: "rgba(100,70,30,0.05) 0px 4px 20px" }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sprout className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-serif text-[20px] text-foreground mb-1">A gentle start</h3>
                  <p className="font-sans text-[14px] text-[#8C7B6A] leading-relaxed">
                    {streak === 0
                      ? "One check-in today is all a streak needs to begin."
                      : `${7 - streak} more ${7 - streak === 1 ? "day" : "days"} of checking in and your first week milestone is yours.`}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-5">
              All time
            </p>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-card rounded-[20px] p-5 border border-border/60"
                  style={{ boxShadow: "rgba(100,70,30,0.04) 0px 4px 16px" }}
                >
                  <div className="font-serif text-[38px] text-primary leading-none mb-1">{s.value}</div>
                  <div className="font-sans text-[13px] text-[#8C7B6A] leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedPage>
    </MainLayout>
  );
}
