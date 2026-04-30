import { ReactNode } from "react";
import { TabBar } from "./TabBar";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full w-full flex flex-col bg-background relative overflow-hidden">
      <div className="flex-1 overflow-hidden pb-[88px]">{children}</div>
      <TabBar />
    </div>
  );
}
