import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { MainLayout } from "@/components/MainLayout";
import { ArrowLeft, Wind, Anchor, Sparkles } from "lucide-react";

export default function Practices() {
  const [, setLocation] = useLocation();

  const sections = [
    {
      title: "Breathing",
      icon: Wind,
      items: [
        { id: "belly", name: "Belly Breathing", duration: "2 min", desc: "Deep, slow breaths (4-4 cycle)", path: "/practice/breathe?t=belly" },
        { id: "box", name: "Box Breathing", duration: "3 min", desc: "Equal parts focus (4-4-4-4)", path: "/practice/breathe?t=box" },
        { id: "478", name: "4-7-8 Technique", duration: "4 min", desc: "For deep relaxation", path: "/practice/breathe?t=478" }
      ]
    },
    {
      title: "Grounding",
      icon: Anchor,
      items: [
        { id: "54321", name: "5-4-3-2-1 Sensory", duration: "3 min", desc: "Bring your mind back to the room", path: "/practice/grounding/54321" },
        { id: "scan", name: "Body Scan", duration: "5 min", desc: "Release physical tension", path: "/practice/grounding/scan" }
      ]
    },
    {
      title: "Reflection",
      icon: Sparkles,
      items: [
        { id: "3q", name: "3-Question Reflection", duration: "3 min", desc: "A gentle mental reset", path: "/practice/reflection" }
      ]
    }
  ];

  return (
    <MainLayout>
      <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto pb-6">
        <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-md px-4 py-4 border-b border-border">
          <div className="flex items-center">
            <button onClick={() => setLocation("/home")} className="p-2 -ml-2 mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </button>
            <div>
              <h1 className="font-serif text-[28px] text-foreground leading-tight">Practices</h1>
              <p className="font-sans text-[14px] text-secondary-foreground">Small moments to recenter.</p>
            </div>
          </div>
        </header>

        <div className="p-4 space-y-8">
          {sections.map(section => (
            <section key={section.title}>
              <div className="flex items-center mb-4 px-1">
                <section.icon className="w-5 h-5 text-primary mr-2" />
                <h2 className="font-serif text-[22px] text-foreground">{section.title}</h2>
              </div>
              <div className="space-y-3">
                {section.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setLocation(item.path)}
                    className="w-full bg-card border border-border rounded-[16px] p-4 shadow-sm flex items-center justify-between border-l-[4px] border-l-primary active:scale-[0.98] transition-transform text-left min-h-[44px]"
                  >
                    <div>
                      <div className="font-sans text-[16px] font-semibold text-foreground mb-1">{item.name}</div>
                      <div className="font-sans text-[13px] text-secondary-foreground">{item.desc}</div>
                    </div>
                    <div className="bg-muted text-secondary-foreground font-sans text-[12px] font-medium px-3 py-1.5 rounded-full">
                      {item.duration}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </AnimatedPage>
    </MainLayout>
  );
}
