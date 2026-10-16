export const CIRCLES = [
  { id: "academic", name: "Academic Pressure", tag: "Studies" },
  { id: "loneliness", name: "Loneliness", tag: "Connection" },
  { id: "grief", name: "Grief", tag: "Loss" },
  { id: "relationship", name: "Relationship Transitions", tag: "Life Changes" },
  { id: "work", name: "Work Stress", tag: "Career" },
  { id: "identity", name: "Identity", tag: "Self" },
] as const;

export function circleName(id: string): string {
  return CIRCLES.find((c) => c.id === id)?.name ?? "Circle";
}

export const MOODS = [
  { label: "Rough", id: 1, emoji: "😣" },
  { label: "Low", id: 2, emoji: "😔" },
  { label: "Okay", id: 3, emoji: "😐" },
  { label: "Good", id: 4, emoji: "🙂" },
  { label: "Great", id: 5, emoji: "😄" },
] as const;

export const JOURNAL_PROMPTS = [
  "What's one small thing that didn't go wrong today?",
  "What's one thing you'd tell yourself from last week?",
  "What are you carrying right now that nobody can see?",
  "What would today look like if you were a little kinder to yourself?",
  "What's taking up the most space in your mind?",
  "What did you survive this week that you haven't given yourself credit for?",
  "What do you need to hear right now?",
];

export function todaysPrompt(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return JOURNAL_PROMPTS[dayOfYear % JOURNAL_PROMPTS.length];
}

export const CRISIS_LINES = [
  { name: "Tele-MANAS (Govt of India)", phone: "14416", display: "14416", hours: "Free · 24/7" },
  { name: "KIRAN Helpline", phone: "18005990019", display: "1800-599-0019", hours: "Free · 24/7" },
  { name: "iCall (TISS)", phone: "9152987821", display: "91529 87821", hours: "Mon–Sat · 8am–9pm" },
  { name: "Vandrevala Foundation", phone: "+919999666555", display: "+91 99996 66555", hours: "Free · 24/7" },
  { name: "AASRA", phone: "+919820466726", display: "+91 98204 66726", hours: "24/7" },
  { name: "Emergency", phone: "112", display: "112", hours: "24/7" },
] as const;

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "long" });
}

export function entryDate(iso: string): { day: string; date: string; time: string } {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString("en-US", { weekday: "long" }),
    date: d.toLocaleDateString("en-US", { day: "numeric", month: "long" }),
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
}
