import { Link, useLocation } from "wouter";
import { Home, MessageCircle, PenLine, Leaf, User } from "lucide-react";

export function TabBar() {
  const [location] = useLocation();

  const tabs = [
    { name: "Home", path: "/home", icon: Home },
    { name: "Talk", path: "/talk", icon: MessageCircle },
    { name: "Journal", path: "/journal", icon: PenLine },
    { name: "Progress", path: "/progress", icon: Leaf },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[68px] bg-card border-t border-border flex items-center justify-around px-2 pb-safe z-50">
      {tabs.map((tab) => {
        const isActive = location.startsWith(tab.path);
        const Icon = tab.icon;
        
        return (
          <Link key={tab.name} href={tab.path} className="relative flex flex-col items-center justify-center w-full h-full">
            {isActive && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-primary rounded-b-full" />
            )}
            <Icon 
              className={`w-6 h-6 mb-1 ${isActive ? "text-primary" : "text-muted-foreground"}`} 
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span className={`text-[11px] font-sans ${isActive ? "text-primary font-medium" : "text-muted-foreground"}`}>
              {tab.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
