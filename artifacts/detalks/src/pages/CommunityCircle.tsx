import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { ArrowLeft, ArrowUp } from "lucide-react";
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
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <AnimatedPage className="flex flex-col h-full bg-background relative">
      <div className="bg-card border-b border-border p-4 pb-3 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <button onClick={() => setLocation("/talk")} className="p-2 -ml-2 mr-2">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="font-serif text-[20px] text-foreground">Academic Pressure</h1>
          </div>
          <div 
            className="font-sans text-[12px] text-secondary-foreground italic"
            title="Your alias rotates every 30 days. No one knows who you are."
          >
            Your alias: {user.alias}
          </div>
        </div>
        <div className="font-sans text-[13px] text-[#8C7B6A] ml-9">142 voices · Anonymous</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        {posts.map(post => (
          <div key={post.id} className="bg-card border border-border rounded-[16px] p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="font-sans text-[13px] font-medium text-primary">{post.alias}</span>
              <span className="font-sans text-[12px] text-muted-foreground">{post.time}</span>
            </div>
            <p className="font-sans text-[15px] text-foreground leading-[1.65] mb-4">
              "{post.text}"
            </p>
            <button 
              onClick={() => toggleLike(post.id)}
              className="flex items-center space-x-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={liked[post.id] ? "#2D6A2D" : "none"} stroke={liked[post.id] ? "#2D6A2D" : "#7A907A"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span className="font-sans text-[13px] text-secondary-foreground">
                {post.likes + (liked[post.id] ? 1 : 0)} resonated
              </span>
            </button>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-card border-t border-border p-4 pb-safe z-10">
        <div className="flex items-end space-x-3 mb-2">
          <textarea
            placeholder="Share a thought with the circle..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none font-sans text-[15px] text-foreground placeholder:text-muted-foreground resize-none max-h-[100px] py-1"
            rows={1}
          />
          <button className="bg-primary text-primary-foreground font-sans text-[13px] font-medium px-4 py-1.5 rounded-full flex-shrink-0">
            Share
          </button>
        </div>
        <div className="font-sans text-[12px] text-muted-foreground">
          Posted anonymously as {user.alias}
        </div>
      </div>
    </AnimatedPage>
  );
}
