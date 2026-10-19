import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { ArrowLeft, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function Consent() {
  const [, setLocation] = useLocation();
  const [consented, setConsented] = useState(false);

  const handleContinue = () => {
    if (consented) {
      sessionStorage.setItem("detalks-consent-v2", "true");
      setLocation("/session/precheck");
    }
  };

  const points = [
    "Other members cannot read your sessions. Chat text is stored in DeTalks and sent to Groq to generate replies.",
    "Disha is an AI companion, not a therapist or doctor",
    "Kavach screens for signs of crisis. It can miss things and is not monitored by a human.",
  ];

  return (
    <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto">
      <header className="px-6 pt-10 pb-4">
        <button aria-label="Back"
          onClick={() => setLocation("/talk")}
          className="p-2 -ml-2 mb-6 min-h-[44px] min-w-[44px] flex items-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground/70" strokeWidth={1.5} />
        </button>
        <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-2">
          Before we begin
        </p>
        <h1 className="font-serif text-[28px] text-foreground font-normal leading-[1.25]">
          A quiet space for you.
        </h1>
      </header>

      <div className="px-6 flex-1 flex flex-col">
        <p className="font-sans text-[15px] text-[#8C7B6A] leading-[1.70] mb-8">
          Before talking, please understand how this space works. Avoid sharing your name, address, phone number or other identifying details. Groq may temporarily retain chat text for reliability or abuse checks, as described in its data policy.
        </p>

        <div className="space-y-4 mb-8">
          {points.map((text, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-primary" strokeWidth={2.5} />
              </div>
              <span className="font-sans text-[15px] text-foreground leading-[1.50]">{text}</span>
            </div>
          ))}
        </div>

        {/* Consent toggle */}
        <div
          className="bg-card rounded-[20px] p-5 mb-8 flex items-center justify-between border border-border/60"
          style={{ boxShadow: "rgba(100,70,30,0.05) 0px 4px 16px" }}
        >
          <span className="font-sans text-[15px] font-medium text-foreground">I understand and consent</span>
          <Switch aria-label="I understand and consent" checked={consented} onCheckedChange={setConsented} />
        </div>

        <button
          onClick={handleContinue}
          disabled={!consented}
          className="w-full bg-foreground text-background disabled:opacity-30 font-sans text-[14px] font-medium py-4 rounded-[14px] min-h-[52px] transition-opacity"
        >
          Continue to pre-check
        </button>

        <div className="text-center mt-5 pb-8">
          <a href="https://console.groq.com/docs/your-data" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[14px] text-primary underline min-h-[44px]">Read Groq's data policy</a>
        </div>
      </div>
    </AnimatedPage>
  );
}
