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
      <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto pb-6">
        <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-md px-4 py-4 border-b border-border">
          <div className="flex items-center">
            <button onClick={() => setLocation("/profile")} className="p-2 -ml-2 mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </button>
            <div>
              <h1 className="font-serif text-[28px] text-foreground leading-tight">Your Sessions</h1>
              <p className="font-sans text-[13px] text-[#8C7B6A] italic">Private to you.</p>
            </div>
          </div>
        </header>

        <div className="p-4 space-y-4">
          {sessions.map((s, i) => (
            <div key={s.id} className="bg-card border border-[#E0D8CC] rounded-[16px] p-5 shadow-sm space-y-3" style={{ boxShadow: "rgba(100, 70, 30, 0.05) 0px 4px 20px" }}>
              <div className="flex justify-between items-center">
                <span className="font-sans text-[13px] text-[#8C7B6A]">Session {s.id}</span>
                <span className="font-sans text-[13px] text-secondary-foreground">{s.date}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {s.tags.map(t => (
                  <span key={t} className="bg-primary/10 text-primary font-sans text-[12px] font-medium px-3 py-1 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
              <div className="font-sans text-[12px] text-secondary-foreground">
                {s.duration} · {s.messages} messages
              </div>
              {i === sessions.length - 1 && (
                <div className="pt-2 border-t border-border mt-2 font-sans text-[11px] text-[#8C7B6A] italic">
                  Companion was different each time. By design.
                </div>
              )}
            </div>
          ))}
        </div>
      </AnimatedPage>
    </MainLayout>
  );
}
