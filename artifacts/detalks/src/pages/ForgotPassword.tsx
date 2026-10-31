import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { ArrowLeft } from "lucide-react";
import { api, ApiError } from "@/lib/api";

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  // null while the availability check is in flight.
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;
    api.emailStatus()
      .then((status) => { if (alive) setAvailable(status.passwordReset); })
      // If the check itself fails, show the form and let submit report honestly.
      .catch(() => { if (alive) setAvailable(true); });
    return () => { alive = false; };
  }, []);

  const submit = async () => {
    setError(null);
    setBusy(true);
    try {
      await api.forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't reach the server. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatedPage className="bg-background flex flex-col h-full overflow-y-auto">
      <div className="p-6 pb-2">
        <button aria-label="Back" onClick={() => setLocation("/auth")} className="p-2 -ml-2 mb-6 min-h-[44px] min-w-[44px] flex items-center">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="font-serif text-[32px] text-foreground mb-2">Reset your password</h1>
        <p className="font-sans text-[15px] text-secondary-foreground">
          {sent ? "Check your inbox." : available === false ? "This isn't available yet." : "Enter the email you signed up with."}
        </p>
      </div>

      {available === null ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border border-primary/30 bg-primary/10 animate-pulse" />
        </div>
      ) : available === false ? (
        <div className="flex-1 px-6 pt-6 pb-8 flex flex-col space-y-6">
          <p className="font-sans text-[15px] text-foreground leading-relaxed">
            Password reset by email is not available yet - there is no email service connected to send your link. If you are locked out, contact us and we will help.
          </p>
          <button onClick={() => setLocation("/auth")} className="w-full bg-foreground text-background font-sans text-[14px] font-medium py-4 rounded-[14px] min-h-[52px]">
            Back to sign in
          </button>
        </div>
      ) : sent ? (
        <div className="flex-1 px-6 pt-6 pb-8 flex flex-col space-y-6">
          <p className="font-sans text-[15px] text-foreground leading-relaxed">
            If an account exists for {email}, a reset link is on its way. It works for 30 minutes.
          </p>
          <button onClick={() => setLocation("/auth")} className="w-full bg-foreground text-background font-sans text-[14px] font-medium py-4 rounded-[14px] min-h-[52px]">
            Back to sign in
          </button>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); if (email.trim().length > 3 && !busy) void submit(); }} className="flex-1 px-6 pt-6 pb-8 flex flex-col space-y-6">
          <div className="bg-card border border-[#C9BFB0] rounded-[10px] p-1 px-4">
            <label htmlFor="forgot-email" className="block text-[12px] font-sans text-secondary-foreground pt-1">Your email</label>
            <input
              id="forgot-email"
              autoComplete="email"
              maxLength={200}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="we keep this private"
              className="w-full bg-transparent border-none outline-none font-sans text-[16px] text-foreground pb-2 pt-1 placeholder:text-muted-foreground"
            />
          </div>

          {error && (
            <p className="font-sans text-[13px] text-[#B4541E] bg-[#B4541E]/10 border border-[#B4541E]/20 rounded-[12px] px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={email.trim().length <= 3 || busy}
            className="w-full bg-foreground text-background disabled:opacity-30 font-sans text-[14px] font-medium py-4 rounded-[14px] min-h-[52px] transition-opacity"
          >
            {busy ? "One moment…" : "Send reset link"}
          </button>
        </form>
      )}
    </AnimatedPage>
  );
}
