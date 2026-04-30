import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { ArrowLeft, Check } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function JournalWrite() {
  const [, setLocation] = useLocation();
  const { currentMood, setCurrentMood } = useAppContext();
  const [content, setContent] = useState("");

  const moods = [
    { id: 1, color: "bg-[#2D6A2D]" },
    { id: 2, color: "bg-[#4A6B4A]" },
    { id: 3, color: "bg-[#EDE7DC]" },
    { id: 4, color: "bg-[#E8A020]" },
    { id: 5, color: "bg-[#C0392B]" },
  ];

  return (
    <AnimatedPage className="flex flex-col h-full bg-background relative">
      <div className="flex items-center justify-between px-4 py-4 sticky top-0 z-10">
        <button onClick={() => setLocation("/journal")} className="p-2 -ml-2">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        
        <div className="flex space-x-2">
          {moods.map(m => (
            <button
              key={m.id}
              onClick={() => setCurrentMood(m.id)}
              className={`w-6 h-6 rounded-full border-2 ${currentMood === m.id ? "border-foreground" : "border-transparent"} ${m.color}`}
            />
          ))}
        </div>
        
        <button onClick={() => setLocation("/journal")} className="p-2 -mr-2">
          <Check className="w-5 h-5 text-primary" />
        </button>
      </div>

      <div className="flex-1 p-6 pt-2">
        <div className="font-sans text-[13px] text-[#8C7B6A] mb-6">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
        
        <div className="bg-[#F0E8C8] rounded-xl p-4 mb-6 relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E8A020] rounded-l-xl" />
          <p className="font-serif text-[18px] text-foreground italic">
            "What's one small thing that didn't go wrong today?"
          </p>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="w-full h-full bg-transparent border-none outline-none font-sans text-[16px] text-foreground leading-[1.80] placeholder:text-muted-foreground resize-none"
          autoFocus
        />
      </div>
    </AnimatedPage>
  );
}
