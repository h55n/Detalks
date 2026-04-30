import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { ArrowLeft, Check } from "lucide-react";

export default function Subscription() {
  const [, setLocation] = useLocation();

  return (
    <AnimatedPage className="flex flex-col h-full bg-background relative overflow-y-auto pb-12">
      <div className="p-4 sticky top-0 z-10 bg-background/80 backdrop-blur-md">
        <button onClick={() => setLocation("/profile")} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
      </div>

      <div className="px-6 pt-2 pb-6">
        <h1 className="font-serif text-[32px] text-foreground mb-2">Choose your space</h1>
        <p className="font-sans text-[15px] text-secondary-foreground mb-8">
          Find the level of support that fits your current needs.
        </p>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-[20px] p-6 shadow-sm">
            <h2 className="font-sans text-[18px] font-semibold text-foreground mb-1">Free</h2>
            <div className="font-serif text-[28px] text-foreground mb-4">₹0<span className="font-sans text-[14px] text-muted-foreground font-normal">/month</span></div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start"><Check className="w-4 h-4 text-primary mr-2 mt-0.5" /><span className="font-sans text-[14px] text-secondary-foreground">Access to Community Circles</span></li>
              <li className="flex items-start"><Check className="w-4 h-4 text-primary mr-2 mt-0.5" /><span className="font-sans text-[14px] text-secondary-foreground">3 Journal Entries per week</span></li>
              <li className="flex items-start"><Check className="w-4 h-4 text-primary mr-2 mt-0.5" /><span className="font-sans text-[14px] text-secondary-foreground">1 Companion Session per week</span></li>
            </ul>
            <button className="w-full bg-muted text-secondary-foreground font-sans text-[14px] font-medium py-3 rounded-[12px]">
              Current Plan
            </button>
          </div>

          <div className="bg-[#F0E8C8] border-2 border-[#E8A020] rounded-[20px] p-6 shadow-md relative">
            <div className="absolute top-0 right-0 bg-[#E8A020] text-[#FAF6F0] font-sans text-[10px] font-bold uppercase tracking-[1px] px-3 py-1 rounded-bl-[12px] rounded-tr-[18px]">
              Student
            </div>
            <h2 className="font-sans text-[18px] font-semibold text-foreground mb-1">Companion+</h2>
            <div className="font-serif text-[28px] text-foreground mb-4">₹99<span className="font-sans text-[14px] text-[#8C7B6A] font-normal">/month</span></div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start"><Check className="w-4 h-4 text-[#2D6A2D] mr-2 mt-0.5" /><span className="font-sans text-[14px] text-foreground">Unlimited Companion Sessions</span></li>
              <li className="flex items-start"><Check className="w-4 h-4 text-[#2D6A2D] mr-2 mt-0.5" /><span className="font-sans text-[14px] text-foreground">Unlimited Journaling</span></li>
              <li className="flex items-start"><Check className="w-4 h-4 text-[#2D6A2D] mr-2 mt-0.5" /><span className="font-sans text-[14px] text-foreground">Priority matching</span></li>
            </ul>
            <button className="w-full bg-primary text-primary-foreground font-sans text-[14px] font-medium py-3 rounded-[12px]">
              Upgrade to Companion+
            </button>
          </div>

          <div className="bg-card border border-border rounded-[20px] p-6 shadow-sm">
            <h2 className="font-sans text-[18px] font-semibold text-foreground mb-1">Professional</h2>
            <div className="font-serif text-[28px] text-foreground mb-4">₹899<span className="font-sans text-[14px] text-muted-foreground font-normal">/session</span></div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start"><Check className="w-4 h-4 text-primary mr-2 mt-0.5" /><span className="font-sans text-[14px] text-secondary-foreground">Licensed therapists</span></li>
              <li className="flex items-start"><Check className="w-4 h-4 text-primary mr-2 mt-0.5" /><span className="font-sans text-[14px] text-secondary-foreground">Video or text sessions</span></li>
              <li className="flex items-start"><Check className="w-4 h-4 text-primary mr-2 mt-0.5" /><span className="font-sans text-[14px] text-secondary-foreground">Personalized care plan</span></li>
            </ul>
            <button onClick={() => setLocation("/professional")} className="w-full bg-transparent border border-primary text-primary font-sans text-[14px] font-medium py-3 rounded-[12px]">
              Book a Session
            </button>
          </div>
        </div>

        <div className="mt-8 bg-card border border-border rounded-[16px] p-5 shadow-sm">
          <h3 className="font-sans text-[15px] font-medium text-foreground mb-2">Government Schemes</h3>
          <p className="font-sans text-[13px] text-secondary-foreground leading-[1.60] mb-4">
            If you need professional support but cannot afford it, you may be eligible for free sessions through our government partnerships.
          </p>
          <button className="font-sans text-[13px] font-medium text-primary">
            Apply for access
          </button>
        </div>
      </div>
    </AnimatedPage>
  );
}
