import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { MainLayout } from "@/components/MainLayout";
import { useAppContext } from "@/context/AppContext";
import { PenLine, ArrowRight } from "lucide-react";

export default function Journal() {
  const [, setLocation] = useLocation();
  const { journalEntries } = useAppContext();

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "good": return "bg-[#2D6A2D]";
      case "neutral": return "bg-[#EDE7DC]";
      case "rough": return "bg-[#E8A020]";
      default: return "bg-[#EDE7DC]";
    }
  };

  return (
    <MainLayout>
      <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto pb-6">
        <header className="bg-card border-b border-border px-4 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="font-serif text-[28px] text-foreground">Your Journal</h1>
          <button 
            onClick={() => setLocation("/journal/write")}
            className="flex items-center font-sans text-[14px] font-medium text-primary"
          >
            New Entry <PenLine className="w-4 h-4 ml-1" />
          </button>
        </header>

        <div className="p-4 space-y-6">
          <div className="bg-[#F0E8C8] rounded-[20px] p-5 shadow-sm">
            <div className="font-sans text-[10px] font-medium text-[#8C7B6A] tracking-[0.8px] uppercase mb-2">TODAY'S PROMPT</div>
            <h2 className="font-serif text-[20px] text-foreground leading-[1.35] mb-4">What's one thing you'd tell yourself from last week?</h2>
            <button 
              onClick={() => setLocation("/journal/write")}
              className="font-sans text-[14px] font-medium text-primary flex items-center"
            >
              Write Now <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="space-y-4">
            {journalEntries.map(entry => (
              <button 
                key={entry.id}
                onClick={() => setLocation("/journal/write")}
                className="w-full text-left bg-card border border-border rounded-[16px] p-4 shadow-sm"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${getMoodColor(entry.mood)}`} />
                    <span className="font-sans text-[13px] text-[#8C7B6A]">{entry.day}, {entry.date}</span>
                  </div>
                  <span className="font-sans text-[12px] text-muted-foreground">{entry.time}</span>
                </div>
                <p className="font-sans text-[15px] text-foreground leading-[1.60] line-clamp-2">
                  {entry.preview}
                </p>
              </button>
            ))}
          </div>
        </div>
      </AnimatedPage>
    </MainLayout>
  );
}
