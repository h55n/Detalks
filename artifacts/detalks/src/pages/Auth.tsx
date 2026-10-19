import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { api, ApiError } from "@/lib/api";
import { useAppContext } from "@/context/AppContext";

export default function Auth() {
  const [, setLocation] = useLocation();
  const { refreshUser } = useAppContext();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        await api.signup({ name: name.trim(), email: email.trim(), password, isStudent });
      } else {
        await api.login({ email: email.trim(), password });
      }
      await refreshUser();
      const onboarded = localStorage.getItem("detalks-onboarded");
      setLocation(mode === "signup" || !onboarded ? "/pulse-check" : "/home");
      if (mode === "signup") localStorage.setItem("detalks-onboarded", "true");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't reach the server. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const canSubmit =
    email.trim().length > 3 &&
    password.length >= (mode === "signup" ? 8 : 1) &&
    (mode === "login" || name.trim().length > 0) &&
    !busy;

  return (
    <AnimatedPage className="bg-background flex flex-col h-full overflow-y-auto">
      <div className="p-6 pb-2">
        <button aria-label="Back" onClick={() => setLocation("/splash")} className="p-2 -ml-2 mb-6 min-h-[44px] min-w-[44px] flex items-center">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>

        <h1 className="font-serif text-[32px] text-foreground mb-2">
          {mode === "signup" ? "Let's set up your space" : "Welcome back"}
        </h1>
        <p className="font-sans text-[15px] text-secondary-foreground">
          {mode === "signup" ? "No pressure. Takes 30 seconds." : "Your space is just as you left it."}
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); if (canSubmit) void submit(); }} className="flex-1 px-6 pt-6 pb-8 flex flex-col space-y-6">
        <div className="space-y-4">
          {mode === "signup" && (
            <div className="bg-card border border-[#C9BFB0] rounded-[10px] p-1 px-4">
              <label htmlFor="auth-name" className="block text-[12px] font-sans text-secondary-foreground pt-1">What should we call you?</label>
              <input
                id="auth-name"
                autoComplete="nickname"
                maxLength={60}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name or a nickname"
                className="w-full bg-transparent border-none outline-none font-sans text-[16px] text-foreground pb-2 pt-1 placeholder:text-muted-foreground"
              />
            </div>
          )}

          <div className="bg-card border border-[#C9BFB0] rounded-[10px] p-1 px-4">
            <label htmlFor="auth-email" className="block text-[12px] font-sans text-secondary-foreground pt-1">Your email</label>
            <input
              id="auth-email"
              autoComplete="email"
              maxLength={200}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="we keep this private"
              className="w-full bg-transparent border-none outline-none font-sans text-[16px] text-foreground pb-2 pt-1 placeholder:text-muted-foreground"
            />
          </div>

          <div className="bg-card border border-[#C9BFB0] rounded-[10px] p-1 px-4 flex items-center">
            <div className="flex-1">
              <label htmlFor="auth-password" className="block text-[12px] font-sans text-secondary-foreground pt-1">
                {mode === "signup" ? "A safe password (8+ characters)" : "Your password"}
              </label>
              <input
                id="auth-password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                maxLength={200}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent border-none outline-none font-sans text-[16px] text-foreground pb-2 pt-1 placeholder:text-muted-foreground"
              />
            </div>
            <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)} className="flex min-h-[44px] min-w-[44px] items-center justify-center text-muted-foreground">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mode === "signup" && (
          <div className="py-2">
            <div className="flex items-center justify-between mb-4">
              <span className="font-sans text-[14px] text-foreground">I'm a student</span>
              <Switch aria-label="I am a student" checked={isStudent} onCheckedChange={setIsStudent} />
            </div>
            <p className="font-sans text-[12px] text-[#8C7B6A] leading-relaxed">
              Your public face here is an anonymous alias we create for you. Circles never show your name or email.
            </p>
          </div>
        )}

        {error && (
          <p className="font-sans text-[13px] text-[#B4541E] bg-[#B4541E]/10 border border-[#B4541E]/20 rounded-[12px] px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-foreground text-background disabled:opacity-30 font-sans text-[14px] font-medium py-4 rounded-[14px] min-h-[52px] transition-opacity"
        >
          {busy ? "One moment…" : mode === "signup" ? "Create my space" : "Sign in"}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signup" ? "login" : "signup");
            setError(null);
          }}
          className="font-sans text-[13px] text-[#8C7B6A] min-h-[44px]"
        >
          {mode === "signup" ? "I already have an account" : "New here? Create an account"}
        </button>

        <p className="font-sans text-[11px] text-[#8C7B6A]/80 text-center leading-relaxed">
          DeTalks is a wellness companion, not a medical or crisis service. In crisis, call Tele-MANAS 14416 (free, 24/7).
        </p>
      </form>
    </AnimatedPage>
  );
}
