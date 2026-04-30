import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { MainLayout } from "@/components/MainLayout";
import { ArrowLeft } from "lucide-react";

export default function Professional() {
  const [, setLocation] = useLocation();

  const therapists = [
    { name: "Dr. Anjali Iyer", creds: "M.A. Clinical Psychology · 8 yrs", langs: ["English", "Hindi", "Marathi"], price: "₹1,200 / session" },
    { name: "Dr. Rohan Mehta", creds: "Ph.D. Clinical Psychology · 12 yrs", langs: ["English", "Gujarati"], price: "₹1,500 / session" },
    { name: "Ms. Kavya Reddy", creds: "M.Sc. Counseling · 5 yrs", langs: ["English", "Telugu", "Hindi"], price: "₹900 / session" }
  ];

  return (
    <MainLayout>
      <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto pb-6">
        <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-md px-4 py-4 border-b border-border">
          <div className="flex items-center">
            <button onClick={() => setLocation("/talk")} className="p-2 -ml-2 mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </button>
            <div>
              <h1 className="font-serif text-[28px] text-foreground leading-tight">Professional Therapy</h1>
              <p className="font-sans text-[14px] text-secondary-foreground">Licensed psychologists. Warm handoff every time.</p>
            </div>
          </div>
        </header>

        <div className="p-4 space-y-8">
          <div className="bg-card border border-border rounded-[16px] p-4 shadow-sm flex flex-wrap gap-2 justify-center">
            {["Licensed in India", "Kavach-prepared handoff", "Session reports"].map(t => (
              <span key={t} className="bg-muted text-secondary-foreground font-sans text-[12px] font-medium px-3 py-1.5 rounded-full">
                {t}
              </span>
            ))}
          </div>

          <section>
            <h3 className="font-sans text-[13px] font-medium text-[#8C7B6A] uppercase tracking-[0.5px] mb-4">How it works</h3>
            <div className="space-y-4">
              {[
                { title: "Choose your therapist", sub: "Browse profiles, languages, and specialties." },
                { title: "Disha prepares your context", sub: "A short brief, only what you choose to share." },
                { title: "Meet via secure video", sub: "45-60 min. Notes saved to your journey if you'd like." }
              ].map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-sans text-[12px] font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-sans text-[15px] font-semibold text-foreground mb-1">{step.title}</div>
                    <div className="font-sans text-[13px] text-secondary-foreground">{step.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-sans text-[13px] font-medium text-[#8C7B6A] uppercase tracking-[0.5px] mb-4">Available Therapists</h3>
            <div className="space-y-4">
              {therapists.map((t, i) => (
                <div key={i} className="bg-card border border-border rounded-[16px] p-5 shadow-sm flex flex-col" style={{ boxShadow: "rgba(100, 70, 30, 0.05) 0px 4px 20px" }}>
                  <div className="flex items-start mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-sans text-[18px] font-semibold mr-3">
                      {t.name.split(" ")[1].charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-sans text-[16px] font-semibold text-foreground">{t.name}</div>
                      <div className="font-sans text-[13px] text-secondary-foreground">{t.creds}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {t.langs.map(l => (
                      <span key={l} className="bg-muted text-secondary-foreground font-sans text-[11px] font-medium px-2 py-1 rounded-full">
                        {l}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="font-sans text-[14px] font-medium text-foreground">{t.price}</div>
                    <button className="font-sans text-[13px] font-medium text-primary">
                      View profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="pt-4 text-center pb-safe">
            <button onClick={() => setLocation("/talk")} className="font-sans text-[14px] text-secondary-foreground hover:text-foreground transition-colors min-h-[44px]">
              Not ready yet? Try a companion session first.
            </button>
          </div>
        </div>
      </AnimatedPage>
    </MainLayout>
  );
}
