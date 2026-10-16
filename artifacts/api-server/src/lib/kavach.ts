/**
 * Kavach: the safety guardian. Screens every seeker message for signs of
 * crisis before it reaches the companion. When something looks serious,
 * the session pauses the normal reply and responds with care and real,
 * verified helplines instead. Patterns are deliberately phrase-level so
 * ordinary uses ("that exam killed me" vs "I want to kill myself") do not
 * trip the guardian.
 */

const CRISIS_PATTERNS: RegExp[] = [
  /\b(kill|end|hurt|harm|cut)ing?\s+(myself|me)\b/i,
  /\b(want|wanting|going|plan(ning)?|about)\s+to\s+(die|kill myself|end (it|my life|everything)|disappear forever)\b/i,
  /\b(suicid\w*)\b/i,
  /\b(self[- ]?harm\w*)\b/i,
  /\bend(ing)?\s+(my|this)\s+life\b/i,
  /\b(no|nothing left)\s+(reason|point)\s+(to|in)\s+(live|living|go on)\b/i,
  /\b(don't|do not|dont)\s+want\s+to\s+(live|be here|exist|wake up)\b/i,
  /\bbetter\s+off\s+(dead|without me)\b/i,
  /\b(can't|cant|cannot)\s+(go on|take it|do this)\s+(anymore|any longer)\b/i,
  /\bwish\s+(i\s+)?(was|were)\s+(dead|never born|gone)\b/i,
  /\beveryone\s+would\s+be\s+better\s+off\s+without\s+me\b/i,
];

export interface KavachResult {
  flagged: boolean;
}

export function kavachScan(text: string): KavachResult {
  const normalized = text.replace(/\s+/g, " ").trim();
  return { flagged: CRISIS_PATTERNS.some((p) => p.test(normalized)) };
}

export const CRISIS_RESOURCES = [
  { name: "Tele-MANAS (Govt of India)", phone: "14416", hours: "Free, 24/7" },
  { name: "KIRAN Helpline", phone: "1800-599-0019", hours: "Free, 24/7" },
  { name: "iCall (TISS)", phone: "9152987821", hours: "Mon-Sat, 8am-9pm" },
  { name: "Vandrevala Foundation", phone: "+91 9999 666 555", hours: "Free, 24/7" },
  { name: "AASRA", phone: "+91 98204 66726", hours: "24/7" },
  { name: "Emergency", phone: "112", hours: "24/7" },
] as const;

export function kavachReply(): string {
  return (
    "I hear how heavy this is, and I'm really glad you said it out loud. " +
    "What you're describing sounds bigger than this space can hold safely, and you deserve real, immediate support. " +
    "Please reach out to one of these free, confidential lines right now: " +
    "Tele-MANAS 14416 (24/7), KIRAN 1800-599-0019 (24/7), iCall 9152987821, Vandrevala Foundation +91 9999 666 555. " +
    "If you are in immediate danger, call 112. " +
    "You matter, and this feeling can be survived with the right support beside you."
  );
}
