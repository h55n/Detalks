import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { ArrowLeft, Check } from "lucide-react";

export default function Subscription() {
  const [, setLocation] = useLocation();

  const free = [
    "Unlimited check-ins, journal and practices",
    "Disha companion sessions",
    "All community circles",
    "Crisis resources, always free",
  ];

  const later = [
    "Longer and richer companion sessions",
    "Supervised human companions",
    "Licensed therapist booking",
  ];

  return (
    <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto">
      <header className="px-6 pt-10 pb-4">
        <button aria-label="Back"
          onClick={() => setLocation("/profile")}
          className="p-2 -ml-2 mb-4 min-h-[44px] min-w-[44px] flex items-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground/70" strokeWidth={1.5} />
        </button>
        <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-2">
          Support levels
        </p>
        <h1 className="font-serif text-[30px] text-foreground font-normal leading-[1.15] mb-1">
          Free while we grow
        </h1>
        <p className="font-sans text-[14px] text-[#8C7B6A]">
          DeTalks is in pilot. Every feature is free for everyone right now.
        </p>
      </header>

      <div className="px-6 space-y-6 pb-10">
        <div
          className="bg-card rounded-[24px] p-6 border border-border/60"
          style={{ boxShadow: "rgba(100,70,30,0.06) 0px 4px 24px" }}
        >
          <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-1">
            Today
          </p>
          <h2 className="font-serif text-[24px] text-foreground mb-4">The whole app, ₹0</h2>
          <div className="space-y-3">
            {free.map((f) => (
              <div key={f} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary" strokeWidth={2.5} />
                </div>
                <span className="font-sans text-[14px] text-foreground leading-[1.5]">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="bg-card rounded-[24px] p-6 border border-border/60"
          style={{ boxShadow: "rgba(100,70,30,0.04) 0px 4px 16px" }}
        >
          <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-1">
            Later, if it helps
          </p>
          <h2 className="font-serif text-[24px] text-foreground mb-4">What paid tiers could add</h2>
          <div className="space-y-3 mb-5">
            {later.map((f) => (
              <div key={f} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-foreground/[0.05] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-foreground/40" strokeWidth={2.5} />
                </div>
                <span className="font-sans text-[14px] text-foreground/70 leading-[1.5]">{f}</span>
              </div>
            ))}
          </div>
          <p className="font-sans text-[13px] text-[#8C7B6A] leading-relaxed">
            We're still learning what students actually need before we charge anyone anything.
            Crisis support will always be free.
          </p>
        </div>
      </div>
    </AnimatedPage>
  );
}
