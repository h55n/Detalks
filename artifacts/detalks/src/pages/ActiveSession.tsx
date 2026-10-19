import { CareCard } from "@/components/CareCard";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { AnimatedPage } from "@/components/AnimatedPage";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUp, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";

const SESSION_LIMIT_SECONDS = 45 * 60;
const MESSAGE_LIMIT = 100;

export default function ActiveSession({ id }: { id: string }) {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [showExit, setShowExit] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [closeError, setCloseError] = useState("");
  const [now, setNow] = useState(Date.now());
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, error } = useQuery({
    queryKey: ["session", id],
    queryFn: () => api.sessionMessages(id),
  });

  const sendMutation = useMutation({
    mutationFn: (content: string) => api.sendMessage(id, content),
    onSuccess: () => {
      setInputValue("");
      queryClient.invalidateQueries({ queryKey: ["session", id] });
    },
    onError: (err) => {
      if (err instanceof ApiError && err.status === 409) {
        queryClient.invalidateQueries({ queryKey: ["session", id] });
      }
    },
  });

  const messages = data?.messages ?? [];
  const session = data?.session;
  const startedAt = session ? new Date(session.createdAt).getTime() : Date.now();
  const ended = !!session?.endedAt;

  const elapsed = Math.floor((now - startedAt) / 1000);
  const remaining = Math.max(0, SESSION_LIMIT_SECONDS - elapsed);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const userMessageCount = messages.filter((m) => m.role === "user").length;

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (remaining <= 5 * 60 && remaining > 0) setShowTimeWarning(true);
    if (remaining === 0 && session && !ended) {
      api.endSession(id, {}).catch(() => undefined).then(() => {
        queryClient.invalidateQueries({ queryKey: ["session", id] });
        setShowExit(true);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length, sendMutation.isPending]);

  if (error instanceof ApiError && error.status === 404) {
    return (
      <AnimatedPage className="flex flex-col h-full bg-background items-center justify-center p-8 text-center">
        <h2 className="font-serif text-[24px] text-foreground mb-3">This session isn't here.</h2>
        <button
          onClick={() => setLocation("/talk")}
          className="bg-foreground text-background font-sans text-[14px] font-medium px-8 py-3.5 rounded-[14px]"
        >
          Back to Talk
        </button>
      </AnimatedPage>
    );
  }

  const send = () => {
    const content = inputValue.trim();
    if (!content || sendMutation.isPending || ended) return;
    sendMutation.mutate(content);
  };

  const closeSession = async () => {
    try { await api.endSession(id, {}); setShowExit(true); }
    catch { setCloseError("Could not close the session. Check your connection and try again."); }
  };

  return (
    <AnimatedPage className="flex flex-col h-full bg-background relative overflow-hidden">
      {/* Header */}
      <div className="h-[56px] flex items-center px-5 justify-between relative z-10 border-b border-border/50">
        <button aria-label="Back" onClick={closeSession} className="p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground/70" strokeWidth={1.5} />
        </button>
        <div className="font-sans text-[13px] font-medium text-[#8C7B6A]">
          {ended ? "Session ended" : "With Disha"}
        </div>
        <div className="font-sans text-[13px] text-[#8C7B6A] font-mono">{mm}:{ss}</div>
        <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-foreground/[0.04]">
          <div
            className="h-full bg-primary/60 transition-all duration-1000"
            style={{ width: `${(remaining / SESSION_LIMIT_SECONDS) * 100}%` }}
          />
        </div>
      </div>

      <div className="text-right px-4 pt-2 font-sans text-[12px] text-muted-foreground">
        {userMessageCount} / {MESSAGE_LIMIT} messages
      </div>

      <AnimatePresence>
        {showTimeWarning && !ended && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="absolute top-[80px] left-4 right-4 z-20"
          >
            <div className="bg-card border border-[#E0D8CC] rounded-full p-3 px-4 shadow-sm flex items-center justify-between">
              <span className="font-sans text-[13px] text-secondary-foreground">
                You've been talking for a while. This session will close in 5 minutes.
              </span>
              <button onClick={() => setShowTimeWarning(false)} className="ml-2 text-muted-foreground p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-4 pt-2 space-y-4">
        {messages.map((msg, i) => (
          <div key={msg.id}>
            <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
              {msg.role === "companion" && i === 0 && (
                <span className="font-sans text-[11px] text-[#8C7B6A] mb-1 ml-1">Disha</span>
              )}
              <div
                className={`max-w-[75%] p-4 font-sans text-[16px] leading-[1.60] ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-[18px_18px_4px_18px]"
                    : "bg-card border border-border text-foreground rounded-[18px_18px_18px_4px]"
                }`}
              >
                {msg.content}
              </div>
            </div>
            {msg.role === "companion" && msg.flagged && (
              <CareCard className="mt-3 max-w-[92%]" />
            )}
          </div>
        ))}

        {sendMutation.isPending && (
          <div className="flex items-center space-x-2 text-[#8C7B6A] pt-2">
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-current" />
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, delay: 0.2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-current" />
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, delay: 0.4, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-current" />
            <span className="font-sans text-[12px] italic ml-1">Listening…</span>
          </div>
        )}
      </div>

      {(sendMutation.isError || closeError) && <p role="alert" className="px-4 py-2 text-[14px] text-destructive">{closeError || (sendMutation.error instanceof Error ? sendMutation.error.message : "Could not send. Try again.")}</p>}
      {/* Input */}
      {!ended && (
        <div className="bg-card/90 backdrop-blur-md border-t border-border/50 p-4 pb-8 z-10 flex items-end gap-3">
          <div className="flex-1 bg-background/80 border border-border/60 rounded-[14px] px-4 py-2.5">
            <textarea
              aria-label="Message to Disha"
              maxLength={2000}
              placeholder="Share what's on your mind…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              className="w-full bg-transparent border-none outline-none font-sans text-[15px] text-foreground placeholder:text-[#8C7B6A] resize-none max-h-[100px]"
              rows={1}
            />
          </div>
          <button
            aria-label="Send message"
            onClick={send}
            disabled={!inputValue.trim() || sendMutation.isPending}
            className="w-11 h-11 rounded-full bg-foreground disabled:opacity-30 flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
          >
            <ArrowUp className="w-4 h-4 text-background" strokeWidth={2} />
          </button>
        </div>
      )}

      {ended && !showExit && (
        <div className="p-4 pb-8 z-10">
          <button
            onClick={() => setShowExit(true)}
            className="w-full bg-foreground text-background font-sans text-[14px] font-medium py-4 rounded-[14px] min-h-[52px]"
          >
            Close this session
          </button>
        </div>
      )}

      {/* Close overlay */}
      <AnimatePresence>
        {showExit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-background/95 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-6"
          >
            <h2 className="font-serif text-[24px] text-foreground text-center mb-4">
              This conversation has been saved to your journey.
            </h2>
            <p className="font-sans text-[16px] text-secondary-foreground mb-8 text-center">
              Take what you need from it.
            </p>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              onClick={() => setLocation(`/session/reflection/${id}`)}
              className="w-full max-w-[300px] bg-primary text-primary-foreground font-sans text-[14px] font-medium py-4 rounded-[12px] min-h-[44px]"
            >
              Continue
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
