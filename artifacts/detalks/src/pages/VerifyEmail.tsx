import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { api } from "@/lib/api";
import { useAppContext } from "@/context/AppContext";

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const { refreshUser } = useAppContext();
  const [token] = useState(() => new URLSearchParams(window.location.hash.slice(1)).get("token") ?? "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const confirm = async () => {
    setBusy(true);
    try {
      await api.confirmVerification(token);
      window.history.replaceState(null, "", "/verify-email");
      await refreshUser();
      setMessage("Your email is verified. You can now post in circles.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not verify. Try again."); }
    finally { setBusy(false); }
  };
  return <AnimatedPage className="h-full overflow-y-auto bg-background p-6 flex flex-col justify-center gap-6">
    <h1 className="font-serif text-[30px]">Verify your email</h1>
    <p className="text-[16px] leading-relaxed">Confirm this email belongs to you to unlock shared circles. Make sure you are signed into the account that requested this link.</p>
    {message && <p role="status">{message}</p>}
    <button onClick={confirm} disabled={busy || !token || message.startsWith("Your email")} className="rounded-[14px] bg-primary text-primary-foreground p-4 min-h-[48px] disabled:opacity-40">{busy ? "Verifying..." : "Verify my email"}</button>
    <button onClick={() => setLocation("/profile")} className="min-h-[44px]">Back to profile</button>
  </AnimatedPage>;
}
