import { forwardRef, useState, type ButtonHTMLAttributes } from "react";
import { useLocation } from "wouter";
import { api } from "@/lib/api";
import { AnimatedPage } from "@/components/AnimatedPage";
import { MainLayout } from "@/components/MainLayout";
import { useAppContext } from "@/context/AppContext";
import { CRISIS_LINES } from "@/lib/content";
import { ChevronRight, Shield, Lock, HeartHandshake, LogOut, History } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAppContext();

  return (
    <MainLayout>
      <AnimatedPage className="flex flex-col h-full bg-background overflow-y-auto">
        {/* Light header — no dark bar */}
        <header className="px-6 pt-10 pb-6">
          <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-6">
            You
          </p>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-foreground/[0.06] border border-border/60 flex items-center justify-center font-sans text-[24px] font-medium text-foreground/70 flex-shrink-0">
              {user?.name?.charAt(0) ?? "·"}
            </div>
            <div>
              <h1 className="font-serif text-[26px] text-foreground font-normal leading-[1.15]">
                {user?.name ?? "Friend"}
              </h1>
              <p className="font-sans text-[13px] text-[#8C7B6A] mt-0.5">
                Alias: {user?.alias ?? "—"}
              </p>
            </div>
          </div>
        </header>

        <div className="px-6 space-y-8 pb-8">
          {/* Subscription */}
          <div
            className="bg-card rounded-[20px] p-5 border border-border/60"
            style={{ boxShadow: "rgba(100,70,30,0.05) 0px 4px 20px" }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-sans text-[15px] font-semibold text-foreground mb-0.5">Free Plan</div>
                {user?.isStudent && <div className="font-sans text-[13px] text-primary">Student</div>}
              </div>
              <button
                onClick={() => setLocation("/subscription")}
                className="font-sans text-[12px] font-medium text-primary border border-primary/40 px-3 py-1.5 rounded-full min-h-[44px] hover:bg-primary/5 transition-colors"
              >
                Upgrade
              </button>
            </div>
            <p className="font-sans text-[13px] text-[#8C7B6A] mt-3 leading-relaxed">
              Everything is free while DeTalks is in pilot.
            </p>
          </div>

          {/* Settings rows */}
          <div>
            <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-4">
              Account
            </p>
            <div
              className="bg-card rounded-[20px] border border-border/60 overflow-hidden"
              style={{ boxShadow: "rgba(100,70,30,0.04) 0px 4px 16px" }}
            >
              <Sheet>
                <SheetTrigger asChild>
                  <SettingRow icon={<Shield className="w-[18px] h-[18px]" strokeWidth={1.5} />} label="Your data" />
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-[28px] bg-card border-t border-border/60">
                  <SheetHeader className="text-left pb-4">
                    <SheetTitle className="font-serif text-[24px] text-foreground font-normal leading-tight">
                      Your data is yours
                    </SheetTitle>
                    <p className="font-sans text-[14px] text-[#8C7B6A] mt-1">
                      Download everything DeTalks holds about you, or delete your account for good.
                    </p>
                  </SheetHeader>
                  <DataControls />
                </SheetContent>
              </Sheet>
              <SettingRow
                icon={<History className="w-[18px] h-[18px]" strokeWidth={1.5} />}
                label="Session History"
                onClick={() => setLocation("/history")}
              />
              <Sheet>
                <SheetTrigger asChild>
                  <SettingRow icon={<Lock className="w-[18px] h-[18px]" strokeWidth={1.5} />} label="Privacy & Safety" isLast />
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-[28px] bg-card border-t border-border/60">
                  <SheetHeader className="text-left pb-4">
                    <SheetTitle className="font-serif text-[24px] text-foreground font-normal leading-tight">
                      Privacy and safety
                    </SheetTitle>
                  </SheetHeader>
                  <ul className="font-sans text-[14px] text-foreground/80 leading-relaxed space-y-3 pb-8 list-disc pl-5">
                    <li>Other people only see your alias, never your name or email.</li>
                    <li>Journal entries and Disha chats are private to you.</li>
                    <li>Kavach screens messages and circle posts for crisis language and points you to real helplines.</li>
                    <li>DeTalks is a wellness companion, not medical care. In an emergency call 112, or Tele-MANAS 14416 (free, 24/7).</li>
                  </ul>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Support */}
          <div>
            <p className="font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em] mb-4">
              Support
            </p>
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="w-full bg-card rounded-[20px] p-5 border border-border/60 flex items-center justify-between min-h-[44px] hover:bg-foreground/[0.02] transition-colors"
                  style={{ boxShadow: "rgba(100,70,30,0.04) 0px 4px 16px" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-foreground/[0.04] flex items-center justify-center text-[#8C7B6A]">
                      <HeartHandshake className="w-[18px] h-[18px]" strokeWidth={1.5} />
                    </div>
                    <span className="font-sans text-[15px] font-medium text-foreground">Crisis Resources</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-foreground/30" strokeWidth={1.5} />
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-[28px] bg-card border-t border-border/60">
                <SheetHeader className="text-left pb-5 mb-2">
                  <SheetTitle className="font-serif text-[24px] text-foreground font-normal leading-tight">
                    You're not alone.
                    <br />
                    These lines are open.
                  </SheetTitle>
                  <p className="font-sans text-[14px] text-[#8C7B6A] mt-1">Free, confidential, 24/7.</p>
                </SheetHeader>
                <div className="space-y-3 pb-8">
                  {CRISIS_LINES.map((line) => (
                    <a key={line.phone} href={`tel:${line.phone}`} className="block bg-background rounded-[16px] p-5 border border-border/60">
                      <div className="font-sans text-[13px] font-medium text-primary mb-1">{line.name}</div>
                      <div className="font-serif text-[22px] text-foreground">{line.display}</div>
                      <div className="font-sans text-[12px] text-[#8C7B6A] mt-0.5">{line.hours}</div>
                    </a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Sign out */}
          <div className="flex justify-center pt-2 pb-4">
            <button
              onClick={async () => {
                await logout();
                setLocation("/splash");
              }}
              className="flex items-center text-[#8C7B6A] font-sans text-[14px] min-h-[44px] px-4 hover:text-foreground/60 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Sign out
            </button>
          </div>
        </div>
      </AnimatedPage>
    </MainLayout>
  );
}

interface SettingRowProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  isLast?: boolean;
}

const SettingRow = forwardRef<HTMLButtonElement, SettingRowProps>(function SettingRow(
  { icon, label, isLast, className: _c, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      {...rest}
      className={`w-full flex items-center justify-between px-5 py-4 min-h-[52px] hover:bg-foreground/[0.02] transition-colors ${!isLast ? "border-b border-border/50" : ""}`}
    >
      <div className="flex items-center gap-3 text-[#8C7B6A]">
        {icon}
        <span className="font-sans text-[15px] font-medium text-foreground">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-foreground/25" strokeWidth={1.5} />
    </button>
  );
});

function DataControls() {
  const [password, setPassword] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const download = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const blob = await api.exportAccount();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "detalks-export.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not export");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await api.deleteAccount(password);
      window.location.assign("/");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not delete");
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3 pb-8">
      <button
        onClick={download}
        disabled={busy}
        className="w-full bg-background rounded-[16px] p-4 border border-border/60 font-sans text-[15px] font-medium text-foreground min-h-[48px] disabled:opacity-50"
      >
        Download my data (JSON)
      </button>
      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="w-full rounded-[16px] p-4 border border-destructive/40 font-sans text-[15px] font-medium text-destructive min-h-[48px]"
        >
          Delete my account
        </button>
      ) : (
        <div className="rounded-[16px] border border-destructive/40 p-4 space-y-3">
          <p className="font-sans text-[13px] text-foreground/80">
            This permanently removes your account, journal, moods, sessions and circle posts. Enter your password to confirm.
          </p>
          <input
            type="password"
            autoComplete="current-password"
            aria-label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-background border border-border/60 rounded-[12px] px-4 py-3 font-sans text-[15px] outline-none"
          />
          <button
            onClick={remove}
            disabled={busy || !password}
            className="w-full rounded-[12px] bg-destructive text-destructive-foreground py-3 font-sans text-[15px] font-medium min-h-[44px] disabled:opacity-40"
          >
            Delete permanently
          </button>
        </div>
      )}
      {message && <p role="alert" className="font-sans text-[13px] text-destructive">{message}</p>}
    </div>
  );
}
