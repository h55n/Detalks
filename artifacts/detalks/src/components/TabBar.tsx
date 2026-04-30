import { Link, useLocation } from "wouter";
import { Home, MessageCircle, PenLine, Sprout, User } from "lucide-react";

export function TabBar() {
  const [location] = useLocation();

  const tabs = [
    { name: "Home", path: "/home", icon: Home },
    { name: "Talk", path: "/talk", icon: MessageCircle },
    { name: "Journal", path: "/journal", icon: PenLine },
    { name: "Progress", path: "/progress", icon: Sprout },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 z-50 px-2 py-2 rounded-full bg-card/85 backdrop-blur-md border border-border/60 flex items-center gap-1"
      style={{
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
        boxShadow:
          "rgba(100, 70, 30, 0.10) 0px 8px 28px, rgba(100, 70, 30, 0.04) 0px 2px 6px",
      }}
    >
      {tabs.map((tab) => {
        const isActive = location.startsWith(tab.path);
        const Icon = tab.icon;

        return (
          <Link
            key={tab.name}
            href={tab.path}
            aria-label={tab.name}
            className={`relative flex items-center justify-center transition-all duration-300 ease-out rounded-full ${
              isActive
                ? "bg-foreground/[0.06] text-foreground px-4 py-2"
                : "text-muted-foreground hover:text-foreground/70 px-3 py-2"
            }`}
          >
            <Icon
              className={`w-[18px] h-[18px] transition-colors duration-300`}
              strokeWidth={1.5}
            />
            {isActive && (
              <span className="ml-2 text-[12px] font-sans font-medium tracking-tight">
                {tab.name}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
