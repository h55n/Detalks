import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { MainLayout } from "@/components/MainLayout";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Professional() {
  const [, setLocation] = useLocation();

  const therapists = [
    { name: "Dr. Anjali Iyer", creds: "M.A. Clinical Psychology · 8 yrs", langs: ["English", "Hindi", "Marathi"], price: "₹1,200 / session" },
    { name: "Dr. Rohan Mehta", creds: "Ph.D. Clinical Psychology · 12 yrs", langs: ["English", "Gujarati"], price: "₹1,500 / session" },
    { name: "Ms. Kavya Reddy", creds: "M.Sc. Counseling · 5 yrs", langs: ["English", "Telugu", "Hindi"], price: "₹900 / session" },
  ];

  const steps = [
    { title: "Choose your therapist", sub: "Browse profiles, languages, and specialties." },
    { title: "Disha prepares your context", sub: "A short brief — only what you choose to share." },
    { title: "Meet via secure video", sub: "45–60 min. Notes saved to your journey if you'd like." },
  ];

  return (
    <MainLayout>
      <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto">
        <header className="px-6 pt-10 pb-4">
          <button
            onClick={() => setLocation("/talk")}
            className="p-2 -ml-2 mb-4 min-h-[44px] min-w-[44px] flex items-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground/70" strokeWidth={1.5} />
          </button>
          <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-2">
            Professional support
          </p>
          <h1 className="font-serif text-[30px] text-foreground font-normal leading-[1.15]">
            Therapy
          </h1>
          <p className="font-sans text-[14px] text-[#8C7B6A] mt-2">
            Licensed psychologists. Warm handoff every time.
          </p>
        </header>

        <div className="px-6 space-y-8 pb-8">
          {/* Trust badges */}
          <div className="flex flex-wrap gap-2">
            {["Licensed in India", "Kavach-prepared handoff", "Session reports"].map((t) => (
              <span
                key={t}
                className="bg-foreground/[0.04] border border-border/60 text-[#8C7B6A] font-sans text-[12px] px-3 py-1.5 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>

          {/* How it works */}
          <div>
            <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-5">
              How it works
            </p>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-7 h-7 rounded-full bg-foreground/[0.05] border border-border/60 flex items-center justify-center font-sans text-[12px] font-medium text-foreground/60 flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-sans text-[15px] font-medium text-foreground mb-0.5">{step.title}</div>
                    <div className="font-sans text-[13px] text-[#8C7B6A] leading-relaxed">{step.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Therapist cards */}
          <div>
            <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-5">
              Available therapists
            </p>
            <div className="space-y-3">
              {therapists.map((t, i) => (
                <div
                  key={i}
                  className="bg-card rounded-[20px] p-5 border border-border/60"
                  style={{ boxShadow: "rgba(100,70,30,0.05) 0px 4px 20px" }}
                >
                  <div className="flex items-start mb-4">
                    <div className="w-11 h-11 rounded-full bg-foreground/[0.05] border border-border/60 flex items-center justify-center font-sans text-[16px] font-medium text-foreground/60 mr-3 flex-shrink-0">
                      {t.name.split(" ")[1].charAt(0)}
                    </div>
                    <div>
                      <div className="font-sans text-[15px] font-semibold text-foreground">{t.name}</div>
                      <div className="font-sans text-[13px] text-[#8C7B6A]">{t.creds}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {t.langs.map((l) => (
                      <span key={l} className="bg-foreground/[0.04] text-[#8C7B6A] font-sans text-[11px] px-2.5 py-1 rounded-full">
                        {l}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-sans text-[15px] font-medium text-foreground">{t.price}</div>
                    <button className="font-sans text-[13px] font-medium text-primary inline-flex items-center group">
                      View profile
                      <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pb-2">
            <button
              onClick={() => setLocation("/talk")}
              className="font-sans text-[13px] text-[#8C7B6A] min-h-[44px] hover:text-foreground/60 transition-colors"
            >
              Not ready yet? Try a companion session first.
            </button>
          </div>
        </div>
      </AnimatedPage>
    </MainLayout>
  );
}
