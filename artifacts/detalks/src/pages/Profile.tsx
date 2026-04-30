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
            <div className="p-4 border-b border-border flex items-center justify-between cursor-pointer min-h-[44px]">
              <div className="flex items-center text-foreground">
                <Shield className="w-5 h-5 mr-3 text-secondary-foreground" />
                <span className="font-sans text-[15px] font-medium">Account</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <div onClick={() => setLocation("/history")} className="p-4 border-b border-border flex items-center justify-between cursor-pointer min-h-[44px]">
              <div className="flex items-center text-foreground">
                <Shield className="w-5 h-5 mr-3 text-secondary-foreground opacity-0" />
                <span className="font-sans text-[15px] font-medium">Session History</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="p-4 border-b border-border flex items-center justify-between cursor-pointer min-h-[44px]">
              <div className="flex items-center text-foreground">
                <Lock className="w-5 h-5 mr-3 text-secondary-foreground" />
                <span className="font-sans text-[15px] font-medium">Privacy & Safety</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="p-4 flex items-center justify-between cursor-pointer min-h-[44px]">
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
                  className="font-sans text-[13px] font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  Upgrade
                </button>
              </div>
              <p className="font-sans text-[13px] text-secondary-foreground">Access to community, 3 journal entries, and 1 companion session per week.</p>
            </div>
          </section>

          <section>
            <h3 className="font-sans text-[13px] font-medium text-[#8C7B6A] uppercase tracking-[0.5px] mb-3 px-2">Support</h3>
            
            <Sheet>
              <SheetTrigger asChild>
                <div className="bg-card border border-border rounded-[16px] p-4 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform min-h-[44px]">
                  <div className="flex items-center text-foreground">
                    <HeartHandshake className="w-5 h-5 mr-3 text-[#E8A020]" />
                    <span className="font-sans text-[15px] font-medium">Crisis Resources</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-[24px] bg-card border-t border-border">
                <SheetHeader className="text-left pb-4 border-b border-border mb-4">
                  <SheetTitle className="font-serif text-[22px] text-foreground">You're not alone. These lines are open.</SheetTitle>
                  <p className="font-sans text-[14px] text-secondary-foreground">Free, confidential, 24/7.</p>
                </SheetHeader>
                <div className="space-y-4 pb-8">
                  <div className="bg-background rounded-[12px] p-4 border border-border">
                    <div className="font-sans text-[15px] font-semibold text-primary mb-1">iCall Mental Health Helpline</div>
                    <a href="tel:9152987821" className="font-sans text-[22px] font-serif text-foreground block mb-2">9152987821</a>
                    <a href="tel:9152987821" className="font-sans text-[14px] font-bold text-primary block">Call now</a>
                  </div>
                  <div className="bg-background rounded-[12px] p-4 border border-border">
                    <div className="font-sans text-[15px] font-semibold text-primary mb-1">Vandrevala Foundation</div>
                    <a href="tel:18602662345" className="font-sans text-[22px] font-serif text-foreground block mb-2">1860-2662-345</a>
                    <a href="tel:18602662345" className="font-sans text-[14px] font-bold text-primary block">Call now</a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </section>

          <div className="pt-4 flex justify-center pb-safe">
            <button 
              onClick={() => setLocation("/splash")}
              className="flex items-center justify-center text-[#C0392B] font-sans text-[15px] font-medium min-h-[44px] min-w-[120px]"
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
