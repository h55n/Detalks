/**
 * Kavach: the safety guardian. Screens every seeker message for signs of
 * crisis before it reaches the companion. When something looks serious,
 * the session pauses the normal reply and responds with care and real,
 * verified helplines instead. Patterns are deliberately phrase-level so
 * ordinary uses ("that exam killed me" vs "I want to kill myself") do not
 * trip the guardian.
 */

const CRISIS_PATTERNS: RegExp[] = [
  /\b(kill|end|hurt|harm|cut)(ing)?\s+(myself|me)\b/i,
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
  /\b(take|taking|end|ending)\s+my\s+(own\s+)?(life|self)\b/i,
  /\b(hang|hanging|drown|drowning|poison|poisoning|shoot|shooting|stab|stabbing)\s+(myself)\b/i,
  /\b(jump|jumping)\s+(off|from)\s+(a|the|my)?\s*(bridge|building|roof|terrace|balcony|window|train)\b/i,
  /\b(overdose|overdosing|od)\s+(on|myself)\b/i,
  /\b(want|wanna|wish|going)\s+(to\s+)?(be\s+)?(dead|die|gone forever)\b/i,
  /\bdon't\s+want\s+to\s+be\s+alive\b/i,
  /\b(thinking|thought)s?\s+(of|about)\s+(dying|ending it|ending everything|killing myself)\b/i,
  /\b(not|no longer)\s+worth\s+living\b/i,
  // Hinglish (romanised Hindi), common among Indian students
  /\b(mar|marr)\s*(jana|jaana|jaun|jau|jaoon)\b/i,
  /\b(marna|mar\s+jaana?)\s+(chahta|chahti|chahte|hai|hu|hoon)\b/i,
  /\b(jeena|jina|jeene|jine)\s+(nahi|nhi|nahin)\s+(chahta|chahti|chahte|ka mann|ka man)\b/i,
  /\b(jeene|jine)\s+ka\s+(mann?|man|mood)\s+(nahi|nhi|nahin)\b/i,
  /\bkhud\s*kushi\b/i,
  /\bkhud\s+ko\s+(khatam|maar|hurt|nuksan)\b/i,
  /\b(apni|apna)\s+(jaan|life)\s+(de|dena|khatam|le)\b/i,
  /\bsab\s+khatam\s+kar\b/i,
];

export interface KavachResult {
  flagged: boolean;
}

export function kavachScan(text: string): KavachResult {
  const normalized = text
    .replace(/[\u2018\u2019\u02bc]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
  return { flagged: CRISIS_PATTERNS.some((p) => p.test(normalized)) };
}

export const CRISIS_RESOURCES = [
  { name: "Tele-MANAS (Govt of India)", phone: "14416", hours: "Free, 24/7" },
  { name: "iCall (TISS)", phone: "9152987821", hours: "Mon-Sat, 8am-9pm" },
  { name: "Vandrevala Foundation", phone: "+91 9999 666 555", hours: "Free, 24/7" },
  { name: "AASRA", phone: "+91 98204 66726", hours: "24/7" },
  { name: "Emergency", phone: "112", hours: "24/7" },
] as const;

export function kavachReply(): string {
  return (
    "I hear how heavy this is, and I'm really glad you said it out loud. " +
    "What you're describing sounds bigger than this space can hold safely, and you deserve real, immediate support. " +
    "Please call Tele-MANAS 14416 (free, 24/7) or Vandrevala Foundation +91 9999 666 555 (24/7). " +
    "iCall 9152987821 is available Monday to Saturday, 8am to 9pm. " +
    "If you are in immediate danger, call 112. " +
    "You matter, and this feeling can be survived with the right support beside you."
  );
}
