import { ReactNode } from "react";
import { HeartHandshake, Lock, Phone } from "lucide-react";

/**
 * The app is designed mobile-first. On phones it fills the screen. On wider
 * screens it sits in a centred column with a calm side panel that explains
 * the product and keeps the crisis line one tap away.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full bg-background flex justify-center overflow-hidden lg:gap-16 lg:px-10 xl:gap-24">
      <aside className="hidden lg:flex flex-col justify-center max-w-[360px] py-10" aria-label="About DeTalks">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-[#8C7B6A]">DeTalks</p>
        <h1 className="mt-4 font-serif text-[40px] leading-[1.1] text-foreground">
          A calm place
          <br />
          to say it out loud.
        </h1>
        <p className="mt-5 font-sans text-[15px] leading-relaxed text-foreground/70">
          A private wellness companion for students in India. Check in with Disha, write, breathe, and find others who
          get it.
        </p>
        <ul className="mt-8 space-y-4 font-sans text-[14px] text-foreground/80">
          <li className="flex items-start gap-3">
            <Lock className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 text-primary" strokeWidth={1.6} aria-hidden="true" />
            Anonymous by default. Others only see your alias.
          </li>
          <li className="flex items-start gap-3">
            <HeartHandshake
              className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 text-primary"
              strokeWidth={1.6}
              aria-hidden="true"
            />
            Kavach watches every conversation and points to real help when it matters.
          </li>
        </ul>
        <a
          href="tel:14416"
          className="mt-10 inline-flex min-h-[48px] items-center gap-2.5 self-start rounded-full border border-primary/40 px-5 font-sans text-[14px] font-medium text-primary transition-colors hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Phone className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
          In crisis? Tele-MANAS 14416, free 24/7
        </a>
        <p className="mt-4 font-sans text-[12px] text-[#8C7B6A]">
          DeTalks is a wellness companion, not a medical or crisis service.
        </p>
      </aside>
      <div className="w-full max-w-[430px] h-[100dvh] relative bg-background shadow-2xl flex flex-col overflow-hidden lg:rounded-[32px] lg:my-0 lg:border lg:border-border/60">
        {children}
      </div>
    </div>
  );
}
