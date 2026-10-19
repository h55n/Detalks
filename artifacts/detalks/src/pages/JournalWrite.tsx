import { MoodFace } from "@/components/MoodFace";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { ArrowLeft, Check, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { MOODS, entryDate, todaysPrompt } from "@/lib/content";

export default function JournalWrite({ id }: { id?: string }) {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<number | null>(null);
  const [prompt, setPrompt] = useState(todaysPrompt());
  const [error, setError] = useState<string | null>(null);

  const { data: existing } = useQuery({
    queryKey: ["journal"],
    queryFn: api.listJournal,
    enabled: !!id,
  });

  useEffect(() => {
    if (id && existing) {
      const entry = existing.entries.find((e) => e.id === id);
      if (entry) {
        setContent(entry.content);
        setMood(entry.mood);
        if (entry.prompt) setPrompt(entry.prompt);
      }
    }
  }, [id, existing]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        content: content.trim(),
        ...(mood ? { mood } : {}),
        ...(prompt ? { prompt } : {}),
      };
      if (id) return api.updateJournalEntry(id, payload);
      return api.createJournalEntry(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      setLocation("/journal");
    },
    onError: () => setError("Couldn't save. Check your connection and try again."),
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.deleteJournalEntry(id!),
    onSuccess: () => {
      queryClient.invalidateQueries();
      setLocation("/journal");
    },
  });

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const dateLabel = id && existing
    ? (() => {
        const entry = existing.entries.find((e) => e.id === id);
        if (!entry) return today;
        const d = entryDate(entry.createdAt);
        return `${d.day}, ${d.date}`;
      })()
    : today;

  return (
    <AnimatedPage className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between px-5 py-4">
        <button aria-label="Back"
          onClick={() => setLocation("/journal")}
          className="p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground/70" strokeWidth={1.5} />
        </button>

        <div className="flex gap-2">
          {MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMood(mood === m.id ? null : m.id)}
              aria-label={m.label}
              className={`w-11 h-11 rounded-full flex items-center justify-center text-[18px] leading-none transition-all duration-200 active:scale-95 ${
                mood === m.id
                  ? "bg-foreground/[0.07] ring-1 ring-foreground/30 scale-110"
                  : "bg-foreground/[0.025]"
              }`}
            >
              <MoodFace mood={m.id} />
            </button>
          ))}
        </div>

        <div className="flex items-center">
          {id && (
            <button
              onClick={() => { if (window.confirm("Delete this journal entry permanently?")) deleteMutation.mutate(); }}
              className="p-2 min-w-[44px] min-h-[44px] flex items-center text-foreground/40"
              aria-label="Delete entry"
            >
              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
            </button>
          )}
          <button
            onClick={() => saveMutation.mutate()}
            disabled={!content.trim() || saveMutation.isPending}
            className="p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-end disabled:opacity-30"
            aria-label="Save entry"
          >
            <Check className="w-5 h-5 text-primary" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="flex-1 px-6 pt-2 pb-8 flex flex-col">
        <p className="font-sans text-[12px] text-[#8C7B6A] mb-6">{dateLabel}</p>

        <div
          className="rounded-[18px] p-5 mb-6"
          style={{ background: "linear-gradient(160deg, #F2E9CE 0%, #ECE0BD 100%)" }}
        >
          <p className="font-serif text-[18px] text-foreground leading-[1.40] italic">
            "{prompt}"
          </p>
        </div>

        <textarea
          aria-label="Journal entry"
          maxLength={20000}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing…"
          className="flex-1 w-full bg-transparent border-none outline-none font-sans text-[16px] text-foreground leading-[1.85] placeholder:text-[#8C7B6A]/60 resize-none"
          autoFocus={!id}
        />
        {deleteMutation.isError && <p role="alert" className="text-[14px] text-destructive">Could not delete this entry. Try again.</p>}
        {error && <p className="font-sans text-[13px] text-[#B4541E] mt-2">{error}</p>}
      </div>
    </AnimatedPage>
  );
}
