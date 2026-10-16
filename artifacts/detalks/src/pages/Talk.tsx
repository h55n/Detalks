import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { MainLayout } from "@/components/MainLayout";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/content";

export default function Talk() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<"companions" | "community">("companions");

  const { data: sessionsData } = useQuery({ queryKey: ["sessions"], queryFn: api.listSessions });
  const { data: circlesData } = useQuery({ queryKey: ["circles"], queryFn: api.listCircles });

  const recent = (sessionsData?.sessions ?? []).slice(0, 3);

  const startSession = () => {
    if (sessionStorage.getItem("detalks-consent")) {
      setLocation("/session/precheck");
    } else {
      setLocation("/consent");
    }
  };

  return (
    <MainLayout>
      <AnimatedPage className="flex flex-col h-full bg-background overflow-hidden relative">
        <header className="px-6 pt-10 pb-4">
          <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-2">
            Connect
          </p>
          <h1 className="font-serif text-[30px] text-foreground font-normal leading-[1.15] mb-4">
            Talk
          </h1>

          <div className="flex bg-foreground/[0.04] p-1 rounded-full w-max">
            <button
              onClick={() => setTab("companions")}
              className={`px-5 py-2 rounded-full font-sans text-[13px] font-medium transition-all duration-200 ${
                tab === "companions" ? "bg-card text-foreground shadow-sm" : "text-[#8C7B6A]"
              }`}
            >
              Companion
            </button>
            <button
              onClick={() => setTab("community")}
              className={`px-5 py-2 rounded-full font-sans text-[13px] font-medium transition-all duration-200 ${
                tab === "community" ? "bg-card text-foreground shadow-sm" : "text-[#8C7B6A]"
              }`}
            >
              Community
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 pb-8">
          {tab === "companions" ? (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div
                className="rounded-[24px] p-6"
                style={{
                  background: "linear-gradient(180deg, #F2E9CE 0%, #ECE0BD 100%)",
                  boxShadow: "rgba(100,70,30,0.08) 0px 4px 24px",
                }}
              >
                <h2 className="font-serif text-[24px] text-foreground mb-2 leading-[1.25]">
                  Talk it out with Disha
                </h2>
                <p className="font-sans text-[14px] text-[#5A5040] leading-relaxed mb-6">
                  Disha is our AI companion — a patient listener for the everyday heavy stuff.
                  Kavach, our safety guardian, watches over every session and points you to
                  real help when it matters.
                </p>
                <button
                  onClick={startSession}
                  className="w-full bg-foreground text-background font-sans text-[14px] font-medium py-3.5 rounded-[14px] min-h-[44px]"
                >
                  Let's talk
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {["45 min max", "Text-based", "AI companion, not a therapist"].map((txt) => (
                  <span
                    key={txt}
                    className="bg-foreground/[0.04] border border-border/60 text-[#8C7B6A] font-sans text-[12px] font-medium px-3 py-1.5 rounded-full"
                  >
                    {txt}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setLocation("/professional")}
                className="w-full flex items-center justify-between py-3.5 px-1 group"
              >
                <span className="font-sans text-[14px] text-foreground font-medium">
                  Need more than a listener?
                </span>
                <ArrowRight
                  className="w-4 h-4 text-foreground/40 group-hover:text-foreground/70 transition-all group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                />
              </button>

              <div>
                <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-4">
                  Recent sessions
                </p>
                {recent.length === 0 ? (
                  <p className="font-sans text-[14px] text-[#8C7B6A] italic">
                    No sessions yet. Your first conversation is one tap away.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recent.map((s, i) => (
                      <div
                        key={s.id}
                        className="bg-card rounded-[20px] p-5 border border-border/60"
                        style={{ boxShadow: "rgba(100,70,30,0.06) 0px 4px 20px" }}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-sans text-[13px] text-[#8C7B6A]">
                            Session {(sessionsData?.sessions.length ?? 0) - i}
                          </span>
                          <span className="font-sans text-[12px] text-[#8C7B6A]">{timeAgo(s.createdAt)}</span>
                        </div>
                        {s.arrivalState && (
                          <div className="flex gap-2 mb-3 flex-wrap">
                            <span className="bg-foreground/[0.05] text-foreground/70 font-sans text-[12px] px-3 py-1 rounded-full">
                              {s.arrivalState}
                            </span>
                          </div>
                        )}
                        <div className="font-sans text-[12px] text-[#8C7B6A] text-right">
                          {s.durationMin} min · {s.messageCount} messages
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-2 pb-6"
            >
              <h2 className="font-serif text-[22px] text-foreground mb-5 pt-1">
                Anonymous spaces to feel less alone
              </h2>
              {(circlesData?.circles ?? []).map((circle) => (
                <button
                  key={circle.id}
                  onClick={() => setLocation(`/community/circle/${circle.id}`)}
                  className="w-full text-left py-4 border-b border-border/50 group last:border-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <h3 className="font-serif text-[20px] text-foreground mb-1 group-hover:text-primary transition-colors">
                        {circle.name}
                      </h3>
                      <div className="flex items-center text-[#8C7B6A] font-sans text-[12px] mb-2">
                        <span>{circle.voices} voices</span>
                        <span className="mx-2 opacity-50">·</span>
                        <span className="bg-foreground/[0.04] px-2 py-0.5 rounded-full">{circle.tag}</span>
                      </div>
                      <p className="font-sans text-[13px] text-[#8C7B6A] italic leading-relaxed line-clamp-1">
                        {circle.latest
                          ? `'${circle.latest.excerpt}' — ${circle.latest.alias}`
                          : "Be the first voice here."}
                      </p>
                    </div>
                    <ArrowRight
                      className="w-4 h-4 text-foreground/30 mt-2 group-hover:text-foreground/60 transition-all group-hover:translate-x-0.5 flex-shrink-0"
                      strokeWidth={1.5}
                    />
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </AnimatedPage>
    </MainLayout>
  );
}
