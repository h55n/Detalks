import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { MainLayout } from "@/components/MainLayout";
import { useAppContext } from "@/context/AppContext";

export default function Progress() {
  const { moodHistory } = useAppContext();

  return (
    <MainLayout>
      <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto pb-6">
        <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
          <h1 className="font-serif text-[28px] text-foreground">Your Journey</h1>
        </header>

        <div className="p-4 space-y-6">
          <div className="bg-card border border-border rounded-[16px] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-sans text-[16px] font-semibold text-foreground">Current Streak</h2>
              <div className="bg-[#F0E8C8] text-[#E8A020] font-sans text-[13px] font-bold px-3 py-1 rounded-full">
                7 Days
              </div>
            </div>
            
            <div className="flex justify-between items-end h-[60px] pt-4">
              {moodHistory.map((val, i) => (
                <div key={i} className="flex flex-col items-center justify-end h-full w-[10%]">
                  <div 
                    className="w-full bg-primary rounded-t-[4px]" 
                    style={{ height: `${(val / 5) * 100}%`, opacity: i === 6 ? 1 : 0.6 }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 font-sans text-[10px] text-muted-foreground uppercase">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-[16px] p-5 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 shadow-[rgba(245,197,24,0.20)_0px_0px_0px_3px_inset]" />
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-[#F5C518]/20 flex items-center justify-center mr-4 flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5C518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15l-2 5l9-9l-9-9l2 5l-9 9l9 9z"/>
                </svg>
              </div>
              <div>
                <div className="font-sans text-[10px] font-medium text-[#F5C518] tracking-[0.8px] uppercase mb-1">MILESTONE</div>
                <h3 className="font-serif text-[18px] text-foreground mb-1">First Week Complete</h3>
                <p className="font-sans text-[13px] text-secondary-foreground">You showed up for yourself for 7 days straight. That's a beautiful start.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-[16px] p-4 shadow-sm">
              <div className="font-serif text-[32px] text-primary mb-1">3</div>
              <div className="font-sans text-[13px] font-medium text-secondary-foreground">Companion Sessions</div>
            </div>
            <div className="bg-card border border-border rounded-[16px] p-4 shadow-sm">
              <div className="font-serif text-[32px] text-primary mb-1">4</div>
              <div className="font-sans text-[13px] font-medium text-secondary-foreground">Journal Entries</div>
            </div>
          </div>
        </div>
      </AnimatedPage>
    </MainLayout>
  );
}
