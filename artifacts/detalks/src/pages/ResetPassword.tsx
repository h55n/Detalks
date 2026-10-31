import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Eye, EyeOff } from "lucide-react";
import { api, ApiError } from "@/lib/api";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [token] = useState(() => {
    const t = new URLSearchParams(window.location.hash.slice(1)).get("token") ?? "";
    return t;
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async () => {
    setError(null);
    setBusy(true);
    try {
      await api.resetPassword(token, password);
      // The token is single-use; scrub it from the address bar.
      window.history.replaceState(null, "", "/reset-password");
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't reach the server. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatedPage className="bg-background flex flex-col h-full overflow-y-auto">
      <div className="p-6 pb-2">
        <h1 className="font-serif text-[32px] text-foreground mb-2 mt-14">Choose a new password</h1>
        <p className="font-sans text-[15px] text-secondary-foreground">
          {done ? "All set." : "At least 8 characters. Your other sessions will be signed out."}
        </p>
      </div>

      {done ? (
        <div className="flex-1 px-6 pt-6 pb-8 flex flex-col space-y-6">
          <p className="font-sans text-[15px] text-foreground leading-relaxed">
            Your password is updated. Sign in with the new one.
          </p>
          <button onClick={() => setLocation("/auth")} className="w-full bg-foreground text-background font-sans text-[14px] font-medium py-4 rounded-[14px] min-h-[52px]">
            Sign in
          </button>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); if (token && password.length >= 8 && !busy) void submit(); }} className="flex-1 px-6 pt-6 pb-8 flex flex-col space-y-6">
          {!token && (
            <p className="font-sans text-[13px] text-[#B4541E] bg-[#B4541E]/10 border border-[#B4541E]/20 rounded-[12px] px-4 py-3">
              This reset link is missing its token. Open the full link from your email, or request a new one.
            </p>
          )}

          <div className="bg-card border border-[#C9BFB0] rounded-[10px] p-1 px-4 flex items-center">
            <div className="flex-1">
              <label htmlFor="reset-password" className="block text-[12px] font-sans text-secondary-foreground pt-1">New password</label>
              <input
                id="reset-password"
                autoComplete="new-password"
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

          {error && (
            <p className="font-sans text-[13px] text-[#B4541E] bg-[#B4541E]/10 border border-[#B4541E]/20 rounded-[12px] px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!token || password.length < 8 || busy}
            className="w-full bg-foreground text-background disabled:opacity-30 font-sans text-[14px] font-medium py-4 rounded-[14px] min-h-[52px] transition-opacity"
          >
            {busy ? "One moment…" : "Update password"}
          </button>

          <button type="button" onClick={() => setLocation("/forgot-password")} className="font-sans text-[13px] text-[#8C7B6A] min-h-[44px]">
            Request a new link
          </button>
        </form>
      )}
    </AnimatedPage>
  );
}
