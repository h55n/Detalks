import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { ArrowLeft, Check } from "lucide-react";

export default function Subscription() {
  const [, setLocation] = useLocation();

  return (
    <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto">
      <header className="px-6 pt-10 pb-4">
        <button
          onClick={() => setLocation("/profile")}
          className="p-2 -ml-2 mb-4 min-h-[44px] min-w-[44px] flex items-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground/70" strokeWidth={1.5} />
        </button>
        <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-2">
          Support levels
        </p>
        <h1 className="font-serif text-[30px] text-foreground font-normal leading-[1.15] mb-1">
          Choose your space
        </h1>
        <p className="font-sans text-[14px] text-[#8C7B6A]">
          Find the level of support that fits your needs.
        </p>
      </header>

      <div className="px-6 space-y-4 pb-10">
        {/* Free */}
        <div
          className="bg-card rounded-[24px] p-6 border border-border/60"
          style={{ boxShadow: "rgba(100,70,30,0.04) 0px 4px 16px" }}
        >
          <h2 className="font-sans text-[15px] font-semibold text-foreground mb-1">Free</h2>
          <div className="flex items-baseline gap-1 mb-5">
            <span className="font-serif text-[36px] text-foreground">₹0</span>
            <span className="font-sans text-[14px] text-[#8C7B6A]">/month</span>
          </div>
          <ul className="space-y-3 mb-6">
            {["Community Circles access", "3 journal entries per week", "1 companion session per week"].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" strokeWidth={2} />
                <span className="font-sans text-[14px] text-[#8C7B6A]">{item}</span>
              </li>
            ))}
          </ul>
          <button className="w-full bg-foreground/[0.04] border border-border/60 text-[#8C7B6A] font-sans text-[14px] font-medium py-3.5 rounded-[12px]">
            Current plan
          </button>
        </div>

        {/* Companion+ — featured */}
        <div
          className="rounded-[24px] p-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #F2E9CE 0%, #E8DDB5 100%)",
            boxShadow: "rgba(232,160,32,0.18) 0px 0px 0px 1.5px, rgba(100,70,30,0.08) 0px 6px 28px",
          }}
        >
          <div className="absolute top-0 right-0 bg-[#E8A020] text-[#FAF6F0] font-sans text-[10px] font-bold uppercase tracking-[1px] px-3 py-1.5 rounded-bl-[12px] rounded-tr-[22px]">
            Student
          </div>
          <h2 className="font-sans text-[15px] font-semibold text-foreground mb-1">Companion+</h2>
          <div className="flex items-baseline gap-1 mb-5">
            <span className="font-serif text-[36px] text-foreground">₹99</span>
            <span className="font-sans text-[14px] text-[#8C7B6A]">/month</span>
          </div>
          <ul className="space-y-3 mb-6">
            {["Unlimited companion sessions", "Unlimited journaling", "Priority matching"].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" strokeWidth={2} />
                <span className="font-sans text-[14px] text-foreground">{item}</span>
              </li>
            ))}
          </ul>
          <button className="w-full bg-foreground text-background font-sans text-[14px] font-medium py-3.5 rounded-[12px]">
            Upgrade to Companion+
          </button>
        </div>

        {/* Professional */}
        <div
          className="bg-card rounded-[24px] p-6 border border-border/60"
          style={{ boxShadow: "rgba(100,70,30,0.04) 0px 4px 16px" }}
        >
          <h2 className="font-sans text-[15px] font-semibold text-foreground mb-1">Professional</h2>
          <div className="flex items-baseline gap-1 mb-5">
            <span className="font-serif text-[36px] text-foreground">₹899</span>
            <span className="font-sans text-[14px] text-[#8C7B6A]">/session</span>
          </div>
          <ul className="space-y-3 mb-6">
            {["Licensed therapists", "Video or text sessions", "Personalized care plan"].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" strokeWidth={2} />
                <span className="font-sans text-[14px] text-[#8C7B6A]">{item}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setLocation("/professional")}
            className="w-full border border-foreground/20 text-foreground font-sans text-[14px] font-medium py-3.5 rounded-[12px]"
          >
            Book a session
          </button>
        </div>

        {/* Gov scheme */}
        <div
          className="bg-card rounded-[20px] p-5 border border-border/60"
          style={{ boxShadow: "rgba(100,70,30,0.04) 0px 4px 16px" }}
        >
          <h3 className="font-sans text-[14px] font-semibold text-foreground mb-2">Government Schemes</h3>
          <p className="font-sans text-[13px] text-[#8C7B6A] leading-[1.65] mb-4">
            If you need professional support but cannot afford it, you may be eligible for free sessions through our government partnerships.
          </p>
          <button className="font-sans text-[13px] font-medium text-primary min-h-[44px]">
            Apply for access →
          </button>
        </div>
      </div>
    </AnimatedPage>
  );
}
