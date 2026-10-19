import { useState } from "react";
import { useLocation } from "wouter";
import { Phone, MessageCircleHeart, ChevronDown, HeartHandshake } from "lucide-react";
import { CRISIS_LINES } from "@/lib/content";

interface CareCardProps {
  /** Short, kind explanation shown above the actions. */
  message?: string;
  /** Show a "talk to Disha privately" action (hide it when already in a session). */
  showDisha?: boolean;
  className?: string;
}

const PRIMARY = CRISIS_LINES[0];
const EMERGENCY = CRISIS_LINES[CRISIS_LINES.length - 1];

/**
 * The care block shown whenever Kavach steps in. Large, clearly labelled
 * actions: call the free national line, call emergency services, talk to
 * Disha privately, or open the full list of verified helplines.
 */
export function CareCard({ message, showDisha = false, className = "" }: CareCardProps) {
  const [, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const others = CRISIS_LINES.filter((l) => l.phone !== PRIMARY.phone && l.phone !== EMERGENCY.phone);

  return (
    <section
      role="alert"
      aria-label="Support is available right now"
      className={`rounded-[20px] border border-primary/25 bg-card p-5 shadow-[0_4px_20px_rgba(100,70,30,0.08)] ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <HeartHandshake className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-serif text-[20px] leading-tight text-foreground">You deserve support right now</h2>
          {message && (
            <p className="mt-1.5 font-sans text-[14px] leading-relaxed text-foreground/75">{message}</p>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-2.5">
        <a
          href={`tel:${PRIMARY.phone}`}
          className="flex min-h-[52px] items-center justify-center gap-2.5 rounded-[16px] bg-primary px-5 font-sans text-[15px] font-medium text-primary-foreground transition-transform active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Phone className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
          Call Tele-MANAS {PRIMARY.display}
          <span className="font-normal opacity-80">· free, 24/7</span>
        </a>

        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={`tel:${EMERGENCY.phone}`}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-[14px] border border-destructive/40 px-3 font-sans text-[14px] font-medium text-destructive transition-colors hover:bg-destructive/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive"
          >
            <Phone className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            Emergency {EMERGENCY.display}
          </a>
          {showDisha ? (
            <button
              type="button"
              onClick={() => setLocation("/consent")}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-[14px] border border-border bg-background/70 px-3 font-sans text-[14px] font-medium text-foreground transition-colors hover:bg-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <MessageCircleHeart className="h-4 w-4 text-primary" strokeWidth={1.8} aria-hidden="true" />
              Talk to Disha
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-[14px] border border-border bg-background/70 px-3 font-sans text-[14px] font-medium text-foreground transition-colors hover:bg-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              More lines
              <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
          )}
        </div>

        {showDisha && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex min-h-[44px] items-center justify-center gap-1.5 font-sans text-[13px] font-medium text-foreground/70 hover:text-foreground"
          >
            {open ? "Hide other helplines" : "See other helplines"}
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>
        )}

        {open && (
          <ul className="grid gap-2">
            {others.map((line) => (
              <li key={line.phone}>
                <a
                  href={`tel:${line.phone}`}
                  className="flex min-h-[48px] items-center justify-between rounded-[14px] border border-border/70 bg-background/60 px-4 py-2 font-sans transition-colors hover:bg-background"
                >
                  <span>
                    <span className="block text-[13px] font-medium text-foreground">{line.name}</span>
                    <span className="block text-[12px] text-foreground/60">{line.hours}</span>
                  </span>
                  <span className="font-serif text-[17px] text-primary">{line.display}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
