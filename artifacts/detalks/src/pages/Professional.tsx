import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { ArrowLeft, Phone } from "lucide-react";
import { CRISIS_LINES } from "@/lib/content";

export default function Professional() {
  const [, setLocation] = useLocation();

  return (
    <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto">
      <header className="px-6 pt-10 pb-4">
        <button aria-label="Back"
          onClick={() => setLocation("/talk")}
          className="p-2 -ml-2 mb-4 min-h-[44px] min-w-[44px] flex items-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground/70" strokeWidth={1.5} />
        </button>
        <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-2">
          Beyond a listening ear
        </p>
        <h1 className="font-serif text-[30px] text-foreground font-normal leading-[1.15] mb-1">
          Professional help
        </h1>
        <p className="font-sans text-[14px] text-[#8C7B6A]">
          Disha listens, but some things deserve a trained human.
        </p>
      </header>

      <div className="px-6 space-y-6 pb-10">
        <div
          className="rounded-[24px] p-6"
          style={{
            background: "linear-gradient(180deg, #F2E9CE 0%, #ECE0BD 100%)",
            boxShadow: "rgba(100,70,30,0.08) 0px 4px 24px",
          }}
        >
          <h2 className="font-serif text-[22px] text-foreground mb-2 leading-[1.3]">
            If it's urgent, don't wait for an app.
          </h2>
          <p className="font-sans text-[14px] text-[#5A5040] leading-relaxed">
            These Indian helplines are free and confidential. Save one in your phone right now — future you may need it.
          </p>
        </div>

        <div className="space-y-3">
          {CRISIS_LINES.map((line) => (
            <a
              key={line.phone}
              href={`tel:${line.phone}`}
              className="flex items-center justify-between bg-card rounded-[20px] p-5 border border-border/60"
              style={{ boxShadow: "rgba(100,70,30,0.05) 0px 4px 16px" }}
            >
              <div>
                <div className="font-sans text-[15px] font-medium text-foreground">{line.name}</div>
                <div className="font-sans text-[12px] text-[#8C7B6A] mt-0.5">{line.hours}</div>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <span className="font-serif text-[18px]">{line.display}</span>
                <Phone className="w-4 h-4" strokeWidth={1.5} />
              </div>
            </a>
          ))}
        </div>

        <div
          className="bg-card rounded-[24px] p-6 border border-border/60"
          style={{ boxShadow: "rgba(100,70,30,0.04) 0px 4px 16px" }}
        >
          <h2 className="font-serif text-[20px] text-foreground mb-2">Therapist booking is coming</h2>
          <p className="font-sans text-[14px] text-[#8C7B6A] leading-relaxed">
            We're working on vetted, licensed therapists you can book through DeTalks.
            Until then, the helplines above can point you to qualified care near you,
            and your college counsellor is often free for students.
          </p>
        </div>
      </div>
    </AnimatedPage>
  );
}
