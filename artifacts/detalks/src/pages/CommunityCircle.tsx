import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { ArrowLeft, ArrowUp, Heart } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function CommunityCircle() {
  const [, setLocation] = useLocation();
  const { user } = useAppContext();
  const [inputValue, setInputValue] = useState("");
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  const posts = [
    { id: 1, alias: "TidePebble", time: "2 hours ago", text: "Submitted my project at 4am. Feeling hollow now instead of relieved. Anyone else feel like the relief never quite arrives the way you expected?", likes: 12 },
    { id: 2, alias: "CalmRiver", time: "5 hours ago", text: "Third week of barely sleeping. I keep telling myself it'll get better after this deadline but there's always another one.", likes: 28 },
    { id: 3, alias: "SoftMoss", time: "Yesterday", text: "Had to drop a course today. Felt like failure but also like a breath of air. Still processing.", likes: 34 },
  ];

  const toggleLike = (id: number) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <AnimatedPage className="flex flex-col h-full bg-background">
      {/* Minimal header — not sticky card */}
      <header className="px-6 pt-10 pb-4">
        <button
          onClick={() => setLocation("/talk")}
          className="p-2 -ml-2 mb-4 min-h-[44px] min-w-[44px] flex items-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground/70" strokeWidth={1.5} />
        </button>
        <div className="flex items-start justify-between">
          <div>
            <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-1">
              Circle
            </p>
            <h1 className="font-serif text-[26px] text-foreground font-normal leading-[1.20]">
              Academic Pressure
            </h1>
            <p className="font-sans text-[12px] text-[#8C7B6A] mt-1">
              142 voices · Anonymous
            </p>
          </div>
          <div className="mt-2 text-right">
            <p className="font-sans text-[11px] text-[#8C7B6A]">Your alias</p>
            <p className="font-sans text-[12px] font-medium text-foreground">{user.alias}</p>
          </div>
        </div>
      </header>

      {/* Posts */}
      <div className="flex-1 overflow-y-auto px-6 pb-32 space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-card rounded-[20px] p-5 border border-border/60"
            style={{ boxShadow: "rgba(100,70,30,0.05) 0px 4px 16px" }}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="font-sans text-[13px] font-medium text-foreground/70">{post.alias}</span>
              <span className="font-sans text-[12px] text-[#8C7B6A]">{post.time}</span>
            </div>
            <p className="font-sans text-[15px] text-foreground leading-[1.70] mb-4">
              "{post.text}"
            </p>
            <button
              onClick={() => toggleLike(post.id)}
              className="flex items-center gap-2 transition-all"
            >
              <Heart
                className={`w-[18px] h-[18px] transition-all ${liked[post.id] ? "fill-primary text-primary" : "text-[#8C7B6A]"}`}
                strokeWidth={1.5}
              />
              <span className={`font-sans text-[13px] ${liked[post.id] ? "text-primary" : "text-[#8C7B6A]"}`}>
                {post.likes + (liked[post.id] ? 1 : 0)} resonated
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Compose — floating bar */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-card/90 backdrop-blur-md border-t border-border/60 p-4 pb-8"
      >
        <div className="flex items-end gap-3">
          <textarea
            placeholder="Share a thought with the circle…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-background/80 border border-border/60 rounded-[14px] px-4 py-3 font-sans text-[14px] text-foreground placeholder:text-[#8C7B6A] resize-none max-h-[100px] outline-none"
            rows={1}
          />
          <button className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform">
            <ArrowUp className="w-4 h-4 text-background" strokeWidth={2} />
          </button>
        </div>
        <p className="font-sans text-[11px] text-[#8C7B6A] mt-2 px-1">
          Posted anonymously as {user.alias}
        </p>
      </div>
    </AnimatedPage>
  );
}
