import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { MainLayout } from "@/components/MainLayout";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/content";

export default function SessionHistory() {
  const [, setLocation] = useLocation();
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ["sessions"], queryFn: api.listSessions });
  const sessions = data?.sessions ?? [];

  return (
    <MainLayout>
      <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto">
        <header className="px-6 pt-10 pb-4">
          <button aria-label="Back"
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
          {isLoading ? <p role="status">Loading your sessions...</p> : isError ? <div role="alert"><p>Could not load your sessions.</p><button onClick={() => refetch()} className="min-h-[44px] underline">Try again</button></div> : sessions.length === 0 ? (
            <div className="bg-card rounded-[24px] border border-border/60 p-6 text-center">
              <h2 className="font-serif text-[20px] text-foreground mb-2">Nothing here yet</h2>
              <p className="font-sans text-[14px] text-secondary-foreground mb-5">
                When you talk with Disha, a short private note from each session lands here.
              </p>
              <button
                onClick={() => setLocation("/talk")}
                className="bg-primary text-primary-foreground font-sans text-[15px] font-medium px-6 rounded-full min-h-[44px]"
              >
                Talk to Disha
              </button>
            </div>
          ) : (
            sessions.map((s, i) => (
              <div
                key={s.id}
                className="bg-card rounded-[20px] p-5 border border-border/60"
                style={{ boxShadow: "rgba(100,70,30,0.05) 0px 4px 16px" }}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-sans text-[13px] text-[#8C7B6A]">Session {sessions.length - i}</span>
                  <span className="font-sans text-[12px] text-[#8C7B6A]">{timeAgo(s.createdAt)}</span>
                </div>
                <div className="flex gap-2 flex-wrap mb-3">
                  {s.arrivalState && (
                    <span className="bg-foreground/[0.05] text-foreground/70 font-sans text-[12px] px-3 py-1 rounded-full">
                      {s.arrivalState}
                    </span>
                  )}
                </div>
                <div className="font-sans text-[12px] text-[#8C7B6A]">
                  {s.durationMin} min · {s.messageCount} messages
                </div>
                <button onClick={() => setLocation(`/session/active/${s.id}`)} className="min-h-[44px] mt-3 text-primary underline text-[14px]">Read conversation</button>
                {s.reflection && (
                  <p className="font-sans text-[13px] text-foreground/80 italic mt-3 pt-3 border-t border-border/50">
                    "{s.reflection}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </AnimatedPage>
    </MainLayout>
  );
}
