import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { MainLayout } from "@/components/MainLayout";
import { ArrowLeft, ArrowRight, Wind, Anchor, Sparkles } from "lucide-react";

export default function Practices() {
  const [, setLocation] = useLocation();

  const sections = [
    {
      title: "Breathing",
      icon: Wind,
      subtitle: "Slow the body, quiet the mind.",
      items: [
        { id: "belly", name: "Belly Breathing", duration: "2 min", desc: "Deep, slow breaths — 4-4 cycle", path: "/practice/breathe?t=belly" },
        { id: "box", name: "Box Breathing", duration: "3 min", desc: "Equal parts focus — 4-4-4-4", path: "/practice/breathe?t=box" },
        { id: "478", name: "4-7-8 Technique", duration: "4 min", desc: "For deep relaxation", path: "/practice/breathe?t=478" },
      ],
    },
    {
      title: "Grounding",
      icon: Anchor,
      subtitle: "Bring your mind back to the room.",
      items: [
        { id: "54321", name: "5-4-3-2-1 Sensory", duration: "3 min", desc: "Anchor through your senses", path: "/practice/grounding/54321" },
        { id: "scan", name: "Body Scan", duration: "5 min", desc: "Release physical tension", path: "/practice/grounding/scan" },
      ],
    },
    {
      title: "Reflection",
      icon: Sparkles,
      subtitle: "A gentle mental reset.",
      items: [
        { id: "3q", name: "3-Question Reflection", duration: "3 min", desc: "Simple prompts, honest answers", path: "/practice/reflection" },
      ],
    },
  ];

  return (
    <MainLayout>
      <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto">
        <header className="px-6 pt-10 pb-4">
          <button
            onClick={() => setLocation("/home")}
            className="p-2 -ml-2 mb-4 min-h-[44px] min-w-[44px] flex items-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground/70" strokeWidth={1.5} />
          </button>
          <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-2">
            Tools
          </p>
          <h1 className="font-serif text-[30px] text-foreground font-normal leading-[1.15]">
            Practices
          </h1>
          <p className="font-sans text-[14px] text-[#8C7B6A] mt-2">Small moments to recenter.</p>
        </header>

        <div className="px-6 space-y-10 pb-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <section key={section.title}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-[#8C7B6A]" strokeWidth={1.5} />
                  <h2 className="font-serif text-[22px] text-foreground">{section.title}</h2>
                </div>
                <p className="font-sans text-[13px] text-[#8C7B6A] mb-5">{section.subtitle}</p>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setLocation(item.path)}
                      className="w-full flex items-center justify-between py-4 px-5 bg-card rounded-[18px] border border-border/60 text-left active:scale-[0.99] transition-transform"
                      style={{ boxShadow: "rgba(100,70,30,0.04) 0px 4px 16px" }}
                    >
                      <div className="flex-1 pr-3">
                        <div className="font-sans text-[15px] font-medium text-foreground mb-0.5">{item.name}</div>
                        <div className="font-sans text-[13px] text-[#8C7B6A]">{item.desc}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="font-sans text-[12px] text-[#8C7B6A] bg-foreground/[0.04] px-2.5 py-1 rounded-full">
                          {item.duration}
                        </span>
                        <ArrowRight className="w-4 h-4 text-foreground/30" strokeWidth={1.5} />
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </AnimatedPage>
    </MainLayout>
  );
}
