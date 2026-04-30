import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { MainLayout } from "@/components/MainLayout";
import { useAppContext } from "@/context/AppContext";
import { ChevronRight, Shield, Bell, Lock, HeartHandshake, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user } = useAppContext();
  const [showCrisis, setShowCrisis] = useState(false);

  return (
    <MainLayout>
      <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto pb-6">
        <header className="bg-[#0F2210] px-6 py-8 pb-10 flex flex-col items-center text-center rounded-b-[32px]">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-[#E8F0E8] font-sans text-[28px] font-semibold mb-4 border-4 border-[#1A3D1A]">
            {user.name.charAt(0)}
          </div>
          <h1 className="font-serif text-[24px] text-[#E8F0E8] mb-1">{user.name}</h1>
          <p className="font-sans text-[14px] text-[#B8C9B8]">Alias: {user.alias}</p>
        </header>

        <div className="p-4 space-y-6 mt-2">
          <section className="bg-card border border-border rounded-[16px] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center text-foreground">
                <Shield className="w-5 h-5 mr-3 text-secondary-foreground" />
                <span className="font-sans text-[15px] font-medium">Account</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center text-foreground">
                <Lock className="w-5 h-5 mr-3 text-secondary-foreground" />
                <span className="font-sans text-[15px] font-medium">Privacy & Safety</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center text-foreground">
                <Bell className="w-5 h-5 mr-3 text-secondary-foreground" />
                <span className="font-sans text-[15px] font-medium">Notifications</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </section>

          <section>
            <h3 className="font-sans text-[13px] font-medium text-[#8C7B6A] uppercase tracking-[0.5px] mb-3 px-2">Subscription</h3>
            <div className="bg-card border border-border rounded-[16px] p-5 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-sans text-[15px] font-semibold text-foreground mb-1">Free Plan</div>
                  <div className="font-sans text-[13px] text-primary">Student Verified ✓</div>
                </div>
                <button 
                  onClick={() => setLocation("/subscription")}
                  className="font-sans text-[13px] font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full"
                >
                  Upgrade
                </button>
              </div>
              <p className="font-sans text-[13px] text-secondary-foreground">Access to community, 3 journal entries, and 1 companion session per week.</p>
            </div>
          </section>

          <section>
            <h3 className="font-sans text-[13px] font-medium text-[#8C7B6A] uppercase tracking-[0.5px] mb-3 px-2">Support</h3>
            
            <Sheet open={showCrisis} onOpenChange={setShowCrisis}>
              <SheetTrigger asChild>
                <div className="bg-card border border-border rounded-[16px] p-4 shadow-sm flex items-center justify-between cursor-pointer">
                  <div className="flex items-center text-foreground">
                    <HeartHandshake className="w-5 h-5 mr-3 text-[#E8A020]" />
                    <span className="font-sans text-[15px] font-medium">Crisis Resources</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-[24px] bg-card border-t border-border">
                <SheetHeader className="text-left pb-4 border-b border-border mb-4">
                  <SheetTitle className="font-serif text-[22px] text-foreground">Crisis Resources</SheetTitle>
                  <p className="font-sans text-[14px] text-secondary-foreground">If you are in immediate danger, please reach out to these services. They are free, confidential, and available 24/7.</p>
                </SheetHeader>
                <div className="space-y-4 pb-8">
                  <div className="bg-background rounded-[12px] p-4 border border-border">
                    <div className="font-sans text-[15px] font-semibold text-foreground mb-1">Kiran Mental Health Helpline</div>
                    <div className="font-sans text-[14px] text-secondary-foreground mb-2">Govt. of India</div>
                    <a href="tel:18005990019" className="font-sans text-[16px] font-bold text-primary block">1800-599-0019</a>
                  </div>
                  <div className="bg-background rounded-[12px] p-4 border border-border">
                    <div className="font-sans text-[15px] font-semibold text-foreground mb-1">Vandrevala Foundation</div>
                    <a href="tel:9999666555" className="font-sans text-[16px] font-bold text-primary block">9999 666 555</a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </section>

          <div className="pt-4 flex justify-center">
            <button 
              onClick={() => setLocation("/splash")}
              className="flex items-center text-[#C0392B] font-sans text-[15px] font-medium"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </button>
          </div>
        </div>
      </AnimatedPage>
    </MainLayout>
  );
}
