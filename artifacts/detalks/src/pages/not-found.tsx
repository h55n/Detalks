import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";

export default function NotFound() {
  const [, setLocation] = useLocation();
  return (
    <AnimatedPage className="bg-background flex flex-col items-center justify-center p-8 h-full text-center">
      <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-3">
        Lost for a moment
      </p>
      <h1 className="font-serif text-[30px] text-foreground leading-[1.2] mb-3">
        This page isn't here.
      </h1>
      <p className="font-sans text-[15px] text-[#8C7B6A] leading-relaxed mb-8">
        The link may be old or mistyped. Let's get you back somewhere familiar.
      </p>
      <button
        onClick={() => setLocation("/home")}
        className="bg-foreground text-background font-sans text-[14px] font-medium px-8 py-3.5 rounded-[14px] min-h-[44px]"
      >
        Back home
      </button>
    </AnimatedPage>
  );
}
