import { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full bg-background flex justify-center overflow-hidden">
      <div className="w-full max-w-[430px] h-[100dvh] relative bg-background shadow-2xl flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
