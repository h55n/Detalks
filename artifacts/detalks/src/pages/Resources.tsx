import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { MainLayout } from "@/components/MainLayout";
import { ArrowLeft, BookOpen, Clock, Download } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function Resources() {
  const [, setLocation] = useLocation();
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const topics = [
    "Academic Pressure",
    "Loneliness",
    "Family Dynamics",
    "Workplace Burnout",
    "Grief",
    "Identity",
    "Relationships"
  ];

  const articles = [
    {
      id: 1,
      category: "Academic Pressure",
      title: "When the Exam Defines Your Worth",
      preview: "Untangling your identity from your marks. A gentle guide to finding grounding when the pressure of expectations feels too heavy to carry.",
      time: "4 min read"
    },
    {
      id: 2,
      category: "Family Dynamics",
      title: "Setting Boundaries with Parents",
      preview: "How to say 'no' respectfully in a culture that doesn't always understand the word. Practical steps for preserving peace at home.",
      time: "6 min read"
    },
    {
      id: 3,
      category: "Loneliness",
      title: "Being Alone vs. Feeling Lonely",
      preview: "Understanding the difference in a hyper-connected world. Why moving to a new city for college or work often triggers deep isolation.",
      time: "5 min read"
    },
    {
      id: 4,
      category: "Workplace Burnout",
      title: "The Hustle Culture Trap",
      preview: "Recognizing the signs of early burnout before it becomes debilitating. Rest is not a reward for hard work, it's a requirement.",
      time: "7 min read"
    },
    {
      id: 5,
      category: "Grief",
      title: "Mourning What Could Have Been",
      preview: "Grief isn't just for losing people. It's for lost opportunities, changed plans, and the versions of our lives that didn't happen.",
      time: "4 min read"
    },
    {
      id: 6,
      category: "Identity",
      title: "Navigating Two Worlds",
      preview: "Balancing traditional expectations with personal aspirations. Finding a voice that feels authentic to both who you are and where you come from.",
      time: "5 min read"
    }
  ];

  return (
    <MainLayout>
      <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto pb-6">
        <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-md px-4 py-4 border-b border-border">
          <div className="flex items-center mb-2">
            <button onClick={() => setLocation("/home")} className="p-2 -ml-2 mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </button>
            <div>
              <h1 className="font-serif text-[28px] text-foreground leading-tight">Resource Library</h1>
              <p className="font-sans text-[14px] text-secondary-foreground">Calm reads. Real voices. Indian context.</p>
            </div>
          </div>
        </header>

        <div className="pt-4 pb-2">
          <div className="flex overflow-x-auto space-x-2 px-4 no-scrollbar pb-2">
            {topics.map(topic => (
              <button
                key={topic}
                className="whitespace-nowrap bg-muted border border-border rounded-full px-4 py-2 font-sans text-[14px] text-foreground min-h-[44px]"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 space-y-4 pb-6">
          {articles.map(article => (
            <div 
              key={article.id} 
              className="bg-card border border-border rounded-[16px] p-5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer relative"
              onClick={() => setSelectedArticle(article)}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="bg-primary/10 text-primary font-sans text-[12px] font-medium px-3 py-1 rounded-full">
                  {article.category}
                </span>
                <span className="flex items-center bg-muted text-secondary-foreground font-sans text-[11px] font-medium px-2 py-1 rounded-full">
                  <Download className="w-3 h-3 mr-1" /> Available offline
                </span>
              </div>
              <h2 className="font-serif text-[18px] text-foreground mb-2 leading-snug">{article.title}</h2>
              <p className="font-sans text-[14px] text-secondary-foreground line-clamp-2 leading-relaxed mb-4">
                {article.preview}
              </p>
              <div className="flex items-center justify-between text-primary font-sans text-[13px] font-medium">
                <span className="flex items-center text-secondary-foreground">
                  <Clock className="w-4 h-4 mr-1.5" /> {article.time}
                </span>
                <span className="flex items-center">
                  Read <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                </span>
              </div>
            </div>
          ))}
        </div>

        <Sheet open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
          <SheetContent side="bottom" className="rounded-t-[24px] bg-card border-t border-border h-[85vh] overflow-y-auto">
            <SheetHeader className="text-left pb-4 border-b border-border mb-6">
              <span className="bg-primary/10 text-primary font-sans text-[12px] font-medium px-3 py-1 rounded-full w-max mb-3">
                {selectedArticle?.category}
              </span>
              <SheetTitle className="font-serif text-[28px] text-foreground leading-tight">
                {selectedArticle?.title}
              </SheetTitle>
              <div className="flex items-center text-secondary-foreground font-sans text-[13px] mt-2">
                <Clock className="w-4 h-4 mr-1.5" /> {selectedArticle?.time}
              </div>
            </SheetHeader>
            <div className="space-y-4 font-sans text-[16px] text-foreground leading-relaxed pb-8">
              <p className="font-medium text-[18px] text-[#8C7B6A] mb-6">
                {selectedArticle?.preview}
              </p>
              <p>
                In a society that deeply values collective achievement and familial pride, the weight of academic or professional expectations can sometimes feel suffocating. We are often taught that our worth is inextricably linked to our output—the grades we get, the institutions we attend, the jobs we secure.
              </p>
              <p>
                But this narrative misses a fundamental truth: you are a complete, worthy human being regardless of those metrics. Learning to separate your identity from your achievements is not a rejection of hard work; it is a necessary boundary for your mental wellbeing.
              </p>
              <p>
                It starts with acknowledging the pressure without internalizing it. When a parent expresses disappointment, or when peers seem to be moving faster, it is easy to absorb their anxiety as your own failure. Notice when this happens. Pause. Remind yourself that their reactions are born from their own conditioning, not from your inadequacy.
              </p>
              <div className="bg-muted p-5 rounded-[12px] my-6 border-l-[4px] border-l-primary">
                <p className="italic text-secondary-foreground">
                  "You are allowed to be a masterpiece and a work in progress at the same time."
                </p>
              </div>
              <p>
                Take small steps today. Identify one thing you enjoy doing that has no productive value. A walk, a sketch, listening to a particular song. Do it just for yourself. Reclaim a piece of your time that belongs only to you, not to your goals or anyone else's expectations.
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </AnimatedPage>
    </MainLayout>
  );
}
