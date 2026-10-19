import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { api } from "@/lib/api";
import { MoodFace } from "@/components/MoodFace";
import { MOODS } from "@/lib/content";
import { CareCard } from "@/components/CareCard";

export default function PulseCheck() {
  const [, setLocation] = useLocation();
  const [mood, setMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const save = async () => {
    if (!mood || busy) return;
    setBusy(true);
    try { await api.logMood(mood, note.trim() || undefined); setLocation("/home"); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not save. Try again."); }
    finally { setBusy(false); }
  };
  return <AnimatedPage className="bg-background h-full flex flex-col overflow-y-auto p-6 gap-6">
    <header className="pt-6"><p className="text-[13px] text-primary mb-3">Your first check-in</p><h1 className="font-serif text-[30px]">How are you feeling?</h1></header>
    <p className="text-[16px] leading-relaxed">No right answer. This saves a private mood check-in, not a diagnosis or assessment.</p>
    <div className="flex justify-between gap-1">{MOODS.map(m => <button key={m.id} aria-label={m.label} aria-pressed={mood === m.id} onClick={() => setMood(m.id)} className={`min-w-[44px] min-h-[72px] flex flex-col items-center justify-center gap-2 rounded-full ${mood === m.id ? "ring-1 ring-primary bg-card" : ""}`}><MoodFace mood={m.id}/><span className="text-[12px]">{m.label}</span></button>)}</div>
    <label htmlFor="pulse-note" className="text-[14px]">Want to add a note? (optional)</label>
    <textarea id="pulse-note" value={note} onChange={e => setNote(e.target.value)} maxLength={500} className="rounded-[14px] p-4 bg-card border border-border min-h-[100px] text-[16px]"/>
    {error && <p role="alert">{error}</p>}
    <button onClick={save} disabled={!mood || busy} className="bg-primary text-primary-foreground rounded-[14px] p-4 min-h-[48px] disabled:opacity-40">{busy ? "Saving..." : "Save check-in"}</button>
    <button onClick={() => setLocation("/home")} className="min-h-[44px]">Skip for now</button>
    <CareCard message="Need help now? You don't have to finish this check-in." />
  </AnimatedPage>;
}
