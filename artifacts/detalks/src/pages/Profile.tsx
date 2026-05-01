import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { MainLayout } from "@/components/MainLayout";
import { useAppContext } from "@/context/AppContext";
import { ChevronRight, Shield, Bell, Lock, HeartHandshake, LogOut, History } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user } = useAppContext();

  return (
    <MainLayout>
      <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto">
        {/* Light header — no dark bar */}
        <header className="px-6 pt-10 pb-6">
          <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-6">
            You
          </p>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-foreground/[0.06] border border-border/60 flex items-center justify-center font-sans text-[24px] font-medium text-foreground/70 flex-shrink-0">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="font-serif text-[26px] text-foreground font-normal leading-[1.15]">
                {user.name}
              </h1>
              <p className="font-sans text-[13px] text-[#8C7B6A] mt-0.5">
                Alias: {user.alias}
              </p>
            </div>
          </div>
        </header>

        <div className="px-6 space-y-8 pb-8">
          {/* Subscription */}
          <div
            className="bg-card rounded-[20px] p-5 border border-border/60"
            style={{ boxShadow: "rgba(100,70,30,0.05) 0px 4px 20px" }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-sans text-[15px] font-semibold text-foreground mb-0.5">Free Plan</div>
                <div className="font-sans text-[13px] text-primary">Student Verified ✓</div>
              </div>
              <button
                onClick={() => setLocation("/subscription")}
                className="font-sans text-[12px] font-medium text-primary border border-primary/40 px-3 py-1.5 rounded-full min-h-[36px] hover:bg-primary/5 transition-colors"
              >
                Upgrade
              </button>
            </div>
            <p className="font-sans text-[13px] text-[#8C7B6A] mt-3 leading-relaxed">
              Community, 3 journal entries, and 1 companion session per week.
            </p>
          </div>

          {/* Settings rows */}
          <div>
            <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-4">
              Account
            </p>
            <div
              className="bg-card rounded-[20px] border border-border/60 overflow-hidden"
              style={{ boxShadow: "rgba(100,70,30,0.04) 0px 4px 16px" }}
            >
              <SettingRow icon={<Shield className="w-[18px] h-[18px]" strokeWidth={1.5} />} label="Account" />
              <SettingRow
                icon={<History className="w-[18px] h-[18px]" strokeWidth={1.5} />}
                label="Session History"
                onClick={() => setLocation("/history")}
              />
              <SettingRow icon={<Lock className="w-[18px] h-[18px]" strokeWidth={1.5} />} label="Privacy & Safety" />
              <SettingRow icon={<Bell className="w-[18px] h-[18px]" strokeWidth={1.5} />} label="Notifications" isLast />
            </div>
          </div>

          {/* Support */}
          <div>
            <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-4">
              Support
            </p>
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="w-full bg-card rounded-[20px] p-5 border border-border/60 flex items-center justify-between min-h-[44px] hover:bg-foreground/[0.02] transition-colors"
                  style={{ boxShadow: "rgba(100,70,30,0.04) 0px 4px 16px" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-foreground/[0.04] flex items-center justify-center text-[#8C7B6A]">
                      <HeartHandshake className="w-[18px] h-[18px]" strokeWidth={1.5} />
                    </div>
                    <span className="font-sans text-[15px] font-medium text-foreground">Crisis Resources</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-foreground/30" strokeWidth={1.5} />
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-[28px] bg-card border-t border-border/60">
                <SheetHeader className="text-left pb-5 mb-2">
                  <SheetTitle className="font-serif text-[24px] text-foreground font-normal leading-tight">
                    You're not alone.
                    <br />
                    These lines are open.
                  </SheetTitle>
                  <p className="font-sans text-[14px] text-[#8C7B6A] mt-1">Free, confidential, 24/7.</p>
                </SheetHeader>
                <div className="space-y-3 pb-8">
                  <a href="tel:9152987821" className="block bg-background rounded-[16px] p-5 border border-border/60">
                    <div className="font-sans text-[13px] font-medium text-primary mb-1">iCall Mental Health Helpline</div>
                    <div className="font-serif text-[22px] text-foreground">9152987821</div>
                  </a>
                  <a href="tel:18602662345" className="block bg-background rounded-[16px] p-5 border border-border/60">
                    <div className="font-sans text-[13px] font-medium text-primary mb-1">Vandrevala Foundation</div>
                    <div className="font-serif text-[22px] text-foreground">1860-2662-345</div>
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Sign out */}
          <div className="flex justify-center pt-2 pb-4">
            <button
              onClick={() => setLocation("/splash")}
              className="flex items-center text-[#8C7B6A] font-sans text-[14px] min-h-[44px] px-4 hover:text-foreground/60 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Sign out
            </button>
          </div>
        </div>
      </AnimatedPage>
    </MainLayout>
  );
}

function SettingRow({
  icon,
  label,
  onClick,
  isLast,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  isLast?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-5 py-4 min-h-[52px] hover:bg-foreground/[0.02] transition-colors ${!isLast ? "border-b border-border/50" : ""}`}
    >
      <div className="flex items-center gap-3 text-[#8C7B6A]">
        {icon}
        <span className="font-sans text-[15px] font-medium text-foreground">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-foreground/25" strokeWidth={1.5} />
    </button>
  );
}
