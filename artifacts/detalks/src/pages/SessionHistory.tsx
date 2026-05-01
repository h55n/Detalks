import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { MainLayout } from "@/components/MainLayout";
import { ArrowLeft } from "lucide-react";

export default function SessionHistory() {
  const [, setLocation] = useLocation();

  const sessions = [
    { id: 4, date: "Yesterday", tags: ["Academic pressure", "Sleep", "Family"], duration: "45 min", messages: 187 },
    { id: 3, date: "12 April", tags: ["Loneliness", "Stress"], duration: "38 min", messages: 154 },
    { id: 2, date: "05 April", tags: ["Identity", "Friendship"], duration: "45 min", messages: 200 },
    { id: 1, date: "28 March", tags: ["First step", "Anxiety"], duration: "25 min", messages: 92 },
  ];

  return (
    <MainLayout>
      <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto">
        <header className="px-6 pt-10 pb-4">
          <button
            onClick={() => setLocation("/profile")}
            className="p-2 -ml-2 mb-4 min-h-[44px] min-w-[44px] flex items-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground/70" strokeWidth={1.5} />
          </button>
          <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-2">
            Private to you
          </p>
          <h1 className="font-serif text-[30px] text-foreground font-normal leading-[1.15]">
            Session History
          </h1>
        </header>

        <div className="px-6 space-y-3 pb-8">
          {sessions.map((s, i) => (
            <div
              key={s.id}
              className="bg-card rounded-[20px] p-5 border border-border/60"
              style={{ boxShadow: "rgba(100,70,30,0.05) 0px 4px 16px" }}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-sans text-[13px] text-[#8C7B6A]">Session {s.id}</span>
                <span className="font-sans text-[12px] text-[#8C7B6A]">{s.date}</span>
              </div>
              <div className="flex gap-2 flex-wrap mb-3">
                {s.tags.map((t) => (
                  <span key={t} className="bg-foreground/[0.05] text-foreground/70 font-sans text-[12px] px-3 py-1 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
              <div className="font-sans text-[12px] text-[#8C7B6A]">
                {s.duration} · {s.messages} messages
              </div>
              {i === sessions.length - 1 && (
                <p className="font-sans text-[11px] text-[#8C7B6A] italic mt-3 pt-3 border-t border-border/50">
                  A different companion each time. By design.
                </p>
              )}
            </div>
          ))}
        </div>
      </AnimatedPage>
    </MainLayout>
  );
}
