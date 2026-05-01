import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { useAppContext } from "@/context/AppContext";
import {
  ArrowRight,
  Activity,
  BookOpen,
  CircleDot,
  Library,
  HeartHandshake,
  X,
  Flame,
} from "lucide-react";
import { MainLayout } from "@/components/MainLayout";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [, setLocation] = useLocation();
  const { user, currentMood, setCurrentMood, streakNudge, dismissNudge } = useAppContext();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const moods = [
    { label: "Rough", id: 1, emoji: "😣" },
    { label: "Low", id: 2, emoji: "😔" },
    { label: "Okay", id: 3, emoji: "😐" },
    { label: "Good", id: 4, emoji: "🙂" },
    { label: "Great", id: 5, emoji: "😄" },
  ];

  return (
    <MainLayout>
      <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto relative">
        {/* Quiet, typography-first greeting */}
        <header className="px-6 pt-10 pb-2 flex items-start justify-between">
          <div>
            <p className="font-sans text-[12px] tracking-[0.18em] uppercase text-[#8C7B6A]/80 mb-2">
              {today}
            </p>
            <h1 className="font-serif text-[28px] leading-[1.15] text-foreground font-normal">
              {getGreeting()},
              <br />
              <span className="text-foreground/85">{user.name}.</span>
            </h1>
          </div>
          <button
            onClick={() => setLocation("/profile")}
            className="w-9 h-9 rounded-full bg-foreground/[0.04] border border-border/60 flex items-center justify-center text-foreground/70 font-sans text-[13px] font-medium mt-1 transition-colors hover:bg-foreground/[0.07]"
            aria-label="Profile"
          >
            {user.name.charAt(0)}
          </button>
        </header>

        {/* Streak nudge — dismissible */}
        <AnimatePresence>
          {streakNudge && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mx-6 mt-4"
            >
              <div className="flex items-center justify-between bg-[#F5C518]/10 border border-[#F5C518]/30 rounded-[18px] px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <Flame className="w-4 h-4 text-[#E8A020] flex-shrink-0" strokeWidth={1.75} />
                  <div>
                    <p className="font-sans text-[13px] font-medium text-foreground leading-tight">
                      7-day streak — keep it going today
                    </p>
                    <p className="font-sans text-[11px] text-[#8C7B6A] mt-0.5">
                      A quick check-in takes under a minute.
                    </p>
                  </div>
                </div>
                <button
                  onClick={dismissNudge}
                  className="p-1.5 text-foreground/30 hover:text-foreground/60 transition-colors flex-shrink-0"
                  aria-label="Dismiss"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-6 space-y-10 pt-6">
          {/* Hero — today's prompt (the focal point) */}
          <section
            className="relative rounded-[24px] p-7 overflow-hidden"
            style={{
              background:
                "linear-gradient(180deg, #F2E9CE 0%, #ECE0BD 100%)",
              boxShadow: "rgba(100,70,30,0.08) 0px 4px 24px",
            }}
          >
            <p className="font-sans text-[10px] font-medium text-[#8C7B6A] tracking-[0.22em] uppercase mb-4">
              Today's prompt
            </p>
            <h2 className="font-serif text-[26px] text-foreground leading-[1.30] mb-3">
              What's one small thing that didn't go wrong today?
            </h2>
            <p className="font-sans text-[14px] text-[#5A5040] mb-6 leading-relaxed">
              Take five minutes. Write anything.
            </p>
            <button
              onClick={() => setLocation("/journal/write")}
              className="font-sans text-[13px] font-medium text-foreground/90 inline-flex items-center group"
            >
              Open journal
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
            </button>
          </section>

          {/* Quick check-in — quieter */}
          <section>
            <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-5">
              Quick check-in
            </p>
            <div className="flex justify-between">
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
          </section>

          {/* Disha — minimal row */}
          <section
            onClick={() => setLocation("/pulse-check")}
            className="flex items-center justify-between cursor-pointer group py-3"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-foreground/[0.04] border border-border/60 flex items-center justify-center mr-3">
                <span className="font-serif text-[16px] text-foreground/70">D</span>
              </div>
              <div>
                <div className="font-sans text-[14px] font-medium text-foreground">
                  Disha
                </div>
                <div className="font-sans text-[13px] text-[#8C7B6A]">
                  Ready when you are.
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-foreground/40 transition-all group-hover:text-foreground/70 group-hover:translate-x-0.5" strokeWidth={1.75} />
          </section>

          {/* Tools — quieter rows, not bordered tiles */}
          <section>
            <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-5">
              Your tools
            </p>
            <div className="space-y-1">
              <ToolRow
                icon={<Activity className="w-[18px] h-[18px]" strokeWidth={1.5} />}
                title="Mood Tracker"
                meta="7 days tracked"
                onClick={() => setLocation("/tools/mood-tracker")}
              />
              <ToolRow
                icon={<BookOpen className="w-[18px] h-[18px]" strokeWidth={1.5} />}
                title="Guided Journal"
                meta="3 entries this week"
                onClick={() => setLocation("/journal")}
              />
              <ToolRow
                icon={<CircleDot className="w-[18px] h-[18px]" strokeWidth={1.5} />}
                title="Practices"
                meta="Recentering moments"
                onClick={() => setLocation("/practice")}
              />
              <ToolRow
                icon={<Library className="w-[18px] h-[18px]" strokeWidth={1.5} />}
                title="Resource Library"
                meta="Calm reads"
                onClick={() => setLocation("/resources")}
              />
            </div>
          </section>

          {/* Circle — single quiet card */}
          <section>
            <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-5">
              Your circle
            </p>
            <button
              onClick={() => setLocation("/community/circle/academic")}
              className="w-full text-left py-3 group"
            >
              <h4 className="font-serif text-[19px] text-foreground mb-1">
                Academic Pressure
              </h4>
              <div className="flex items-center text-[#8C7B6A] font-sans text-[12px]">
                <span>142 voices</span>
                <span className="mx-2 opacity-50">·</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5" />
                <span>Active now</span>
              </div>
            </button>
          </section>

          {/* Need support */}
          <div className="flex justify-center pt-2 pb-2">
            <Sheet>
              <SheetTrigger asChild>
                <button className="font-sans text-[12px] font-medium text-[#8C7B6A] flex items-center px-4 py-2 hover:text-foreground/70 transition-colors">
                  <HeartHandshake className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />
                  Need support now?
                </button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="rounded-t-[28px] bg-card border-t border-border/60"
              >
                <SheetHeader className="text-left pb-5 mb-2">
                  <SheetTitle className="font-serif text-[24px] text-foreground font-normal leading-tight">
                    You're not alone.
                    <br />
                    These lines are open.
                  </SheetTitle>
                  <p className="font-sans text-[14px] text-[#8C7B6A] mt-1">
                    Free, confidential, 24/7.
                  </p>
                </SheetHeader>
                <div className="space-y-3 pb-8">
                  <a
                    href="tel:9152987821"
                    className="block bg-background rounded-[16px] p-5 border border-border/60 hover:border-primary/40 transition-colors"
                  >
                    <div className="font-sans text-[13px] font-medium text-primary mb-1">
                      iCall Mental Health Helpline
                    </div>
                    <div className="font-serif text-[22px] text-foreground">
                      9152987821
                    </div>
                  </a>
                  <a
                    href="tel:18602662345"
                    className="block bg-background rounded-[16px] p-5 border border-border/60 hover:border-primary/40 transition-colors"
                  >
                    <div className="font-sans text-[13px] font-medium text-primary mb-1">
                      Vandrevala Foundation
                    </div>
                    <div className="font-serif text-[22px] text-foreground">
                      1860-2662-345
                    </div>
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </AnimatedPage>
    </MainLayout>
  );
}

function ToolRow({
  icon,
  title,
  meta,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  meta: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-3.5 px-1 group transition-colors"
    >
      <div className="flex items-center">
        <div className="w-9 h-9 rounded-full bg-foreground/[0.04] flex items-center justify-center mr-3 text-foreground/60 group-hover:text-foreground/80 transition-colors">
          {icon}
        </div>
        <div className="text-left">
          <div className="font-sans text-[14px] font-medium text-foreground leading-tight">
            {title}
          </div>
          <div className="font-sans text-[12px] text-[#8C7B6A] mt-0.5">
            {meta}
          </div>
        </div>
      </div>
      <ArrowRight
        className="w-4 h-4 text-foreground/30 transition-all group-hover:text-foreground/60 group-hover:translate-x-0.5"
        strokeWidth={1.5}
      />
    </button>
  );
}
