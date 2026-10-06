import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { MainLayout } from "@/components/MainLayout";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function Resources() {
  const [, setLocation] = useLocation();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const topics = ["All", "Academic Pressure", "Loneliness", "Family Dynamics", "Workplace Burnout", "Grief", "Identity", "Relationships"];

  const articles = [
    { id: 1, category: "Academic Pressure", title: "When the Exam Defines Your Worth", preview: "Untangling your identity from your marks. A gentle guide to finding grounding when the pressure of expectations feels too heavy to carry.", time: "4 min" },
    { id: 2, category: "Family Dynamics", title: "Setting Boundaries with Parents", preview: "How to say 'no' respectfully in a culture that doesn't always understand the word. Practical steps for preserving peace at home.", time: "6 min" },
    { id: 3, category: "Loneliness", title: "Being Alone vs. Feeling Lonely", preview: "Understanding the difference in a hyper-connected world. Why moving to a new city for college or work often triggers deep isolation.", time: "5 min" },
    { id: 4, category: "Workplace Burnout", title: "The Hustle Culture Trap", preview: "Recognizing the signs of early burnout before it becomes debilitating. Rest is not a reward for hard work, it's a requirement.", time: "7 min" },
    { id: 5, category: "Grief", title: "Mourning What Could Have Been", preview: "Grief isn't just for losing people. It's for lost opportunities, changed plans, and the versions of our lives that didn't happen.", time: "4 min" },
    { id: 6, category: "Identity", title: "Navigating Two Worlds", preview: "Balancing traditional expectations with personal aspirations. Finding a voice that feels authentic to both who you are and where you come from.", time: "5 min" },
  ];

  const filtered = selectedTopic && selectedTopic !== "All"
    ? articles.filter((a) => a.category === selectedTopic)
    : articles;

  return (
    <MainLayout>
      <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto">
        <header className="shrink-0 px-6 pt-10 pb-4">
          <button
            onClick={() => setLocation("/home")}
            className="p-2 -ml-2 mb-4 min-h-[44px] min-w-[44px] flex items-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground/70" strokeWidth={1.5} />
          </button>
          <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-2">
            Explore
          </p>
          <h1 className="font-serif text-[30px] text-foreground font-normal leading-[1.15]">
            Resource Library
          </h1>
          <p className="font-sans text-[14px] text-[#8C7B6A] mt-2">Calm reads. Real voices. Indian context.</p>
        </header>

        {/* Topic filter pills */}
        <div className="shrink-0 flex overflow-x-auto gap-2 px-6 pb-5 no-scrollbar">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic === "All" ? null : topic)}
              className={`shrink-0 whitespace-nowrap font-sans text-[13px] font-medium px-4 py-2 rounded-full min-h-[36px] transition-all ${
                (topic === "All" && !selectedTopic) || selectedTopic === topic
                  ? "bg-foreground text-background"
                  : "bg-foreground/[0.04] border border-border/60 text-[#8C7B6A]"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        <div className="shrink-0 px-6 space-y-4 pb-8">
          {filtered.map((article) => (
            <button
              key={article.id}
              className="w-full text-left bg-card rounded-[20px] p-5 border border-border/60 active:scale-[0.99] transition-transform"
              style={{ boxShadow: "rgba(100,70,30,0.05) 0px 4px 16px" }}
              onClick={() => setSelectedArticle(article)}
            >
              <span className="inline-block bg-foreground/[0.05] text-[#8C7B6A] font-sans text-[11px] font-medium px-3 py-1 rounded-full mb-3">
                {article.category}
              </span>
              <h2 className="font-serif text-[20px] text-foreground mb-2 leading-[1.25]">
                {article.title}
              </h2>
              <p className="font-sans text-[14px] text-[#8C7B6A] line-clamp-2 leading-relaxed mb-4">
                {article.preview}
              </p>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-[#8C7B6A] font-sans text-[12px]">
                  <Clock className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />
                  {article.time} read
                </span>
                <span className="flex items-center text-foreground/60 font-sans text-[13px] font-medium">
                  Read
                  <ArrowRight className="w-3.5 h-3.5 ml-1" strokeWidth={1.75} />
                </span>
              </div>
            </button>
          ))}
        </div>

        <Sheet open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
          <SheetContent
            side="bottom"
            className="rounded-t-[28px] bg-card border-t border-border/60 h-[88vh] overflow-y-auto"
          >
            <SheetHeader className="text-left pb-6 mb-2">
              <span className="inline-block bg-foreground/[0.05] text-[#8C7B6A] font-sans text-[11px] font-medium px-3 py-1 rounded-full mb-3 w-max">
                {selectedArticle?.category}
              </span>
              <SheetTitle className="font-serif text-[28px] text-foreground font-normal leading-[1.20]">
                {selectedArticle?.title}
              </SheetTitle>
              <div className="flex items-center text-[#8C7B6A] font-sans text-[12px] mt-2">
                <Clock className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />
                {selectedArticle?.time} read
              </div>
            </SheetHeader>
            <div className="space-y-5 font-sans text-[16px] text-foreground leading-[1.75] pb-10">
              <p className="text-[17px] text-[#8C7B6A] leading-[1.65]">{selectedArticle?.preview}</p>
              <p>
                In a society that deeply values collective achievement and familial pride, the weight of academic or professional expectations can sometimes feel suffocating. We are often taught that our worth is inextricably linked to our output — the grades we get, the institutions we attend, the jobs we secure.
              </p>
              <p>
                But this narrative misses a fundamental truth: you are a complete, worthy human being regardless of those metrics. Learning to separate your identity from your achievements is not a rejection of hard work; it is a necessary boundary for your wellbeing.
              </p>
              <p>
                It starts with acknowledging the pressure without internalizing it. When a parent expresses disappointment, or when peers seem to be moving faster, it is easy to absorb their anxiety as your own failure. Notice when this happens. Pause. Remind yourself that their reactions are born from their own conditioning, not from your inadequacy.
              </p>
              <div className="bg-foreground/[0.04] rounded-[16px] p-5 my-2 border-l-[3px] border-l-primary/40">
                <p className="italic text-[#8C7B6A]">
                  "You are allowed to be a masterpiece and a work in progress at the same time."
                </p>
              </div>
              <p>
                Take small steps today. Identify one thing you enjoy doing that has no productive value. A walk, a sketch, listening to a particular song. Reclaim a piece of your time that belongs only to you.
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </AnimatedPage>
    </MainLayout>
  );
}
