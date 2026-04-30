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
      sessionStorage.setItem('detalks-consent', 'true');
      setLocation("/session/precheck");
    }
  };

  return (
    <AnimatedPage className="flex flex-col h-full bg-background relative overflow-y-auto">
      <div className="p-4 sticky top-0 z-10">
        <button onClick={() => setLocation("/talk")} className="p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
      </div>

      <div className="px-6 flex-1 flex flex-col justify-center">
        <h1 className="font-serif text-[24px] text-foreground mb-4">Before we begin</h1>
        <p className="font-sans text-[15px] text-secondary-foreground leading-[1.65] mb-8">
          Every session is monitored in real time by Kavach — our quiet safety guardian. They never interrupt your conversation. They're only there if you need help.
        </p>

        <div className="space-y-4 mb-10">
          {[
            "Sessions are private to you and your companion",
            "Kavach watches for safety only — never advertising",
            "You can leave at any time"
          ].map((text, i) => (
            <div key={i} className="flex items-start">
              <Check className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span className="font-sans text-[14px] text-foreground leading-[1.4]">{text}</span>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-[16px] p-4 mb-8 flex items-center justify-between">
          <span className="font-sans text-[15px] font-medium text-foreground">I understand and consent</span>
          <Switch checked={consented} onCheckedChange={setConsented} />
        </div>

        <button
          onClick={handleContinue}
          disabled={!consented}
          className="w-full bg-primary text-primary-foreground disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground font-sans text-[15px] font-medium py-4 rounded-[12px] min-h-[44px] transition-all"
        >
          Continue to pre-check
        </button>

        <div className="text-center mt-6">
          <button className="font-sans text-[13px] text-[#8C7B6A] hover:text-foreground transition-colors">
            Read our full privacy approach
          </button>
        </div>
      </div>
    </AnimatedPage>
  );
}
