/** Small typed client for the DeTalks API. Same-origin, cookie session. */

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  alias: string;
  isStudent: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface MoodEntry {
  id: string;
  mood: number;
  note: string | null;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  content: string;
  mood: number | null;
  prompt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressSummary {
  sessionsCount: number;
  journalCount: number;
  daysCheckedIn: number;
  streak: number;
  moodHistory: (number | null)[];
  moodsLast30Days: number;
}

export interface SessionSummary {
  id: string;
  arrivalState: string | null;
  createdAt: string;
  endedAt: string | null;
  durationMin: number;
  messageCount: number;
  reflection: string | null;
  postMood: number | null;
}

export interface SessionMessage {
  id: string;
  role: "user" | "companion";
  content: string;
  flagged: boolean;
  createdAt: string;
}

export interface CircleSummary {
  id: string;
  name: string;
  tag: string;
  voices: number;
  latest: { alias: string; excerpt: string } | null;
}

export interface CirclePost {
  id: string;
  alias: string;
  content: string;
  createdAt: string;
  likes: number;
  likedByMe: boolean;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method,
    credentials: "include",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) {
    throw new ApiError(res.status, data.error ?? "Something went wrong");
  }
  return data as T;
}

export const api = {
  signup: (input: { name: string; email: string; password: string; isStudent: boolean }) =>
    call<{ user: ApiUser }>("POST", "/api/auth/signup", input),
  login: (input: { email: string; password: string }) =>
    call<{ user: ApiUser }>("POST", "/api/auth/login", input),
  forgotPassword: (email: string) => call<{ ok: true }>("POST", "/api/auth/password/forgot", { email }),
  resetPassword: (token: string, password: string) => call<{ ok: true }>("POST", "/api/auth/password/reset", { token, password }),
  requestVerification: () => call<{ ok: true }>("POST", "/api/auth/verification/request"),
  confirmVerification: (token: string) => call<{ ok: true }>("POST", "/api/auth/verification/confirm", { token }),
  logout: () => call<{ ok: true }>("POST", "/api/auth/logout"),
  me: () => call<{ user: ApiUser }>("GET", "/api/auth/me"),
  deleteAccount: (password: string) => call<{ ok: true }>("DELETE", "/api/account", { password }),
  exportAccount: async (): Promise<Blob> => {
    const res = await fetch("/api/account/export", { credentials: "include" });
    if (!res.ok) throw new ApiError(res.status, "Could not export your data");
    return res.blob();
  },

  listMoods: (days = 30) => call<{ entries: MoodEntry[] }>("GET", `/api/moods?days=${days}`),
  logMood: (mood: number, note?: string) =>
    call<{ entry: MoodEntry }>("POST", "/api/moods", { mood, note }),

  listJournal: () => call<{ entries: JournalEntry[] }>("GET", "/api/journal"),
  createJournalEntry: (input: { content: string; mood?: number; prompt?: string }) =>
    call<{ entry: JournalEntry }>("POST", "/api/journal", input),
  updateJournalEntry: (id: string, input: { content: string; mood?: number; prompt?: string }) =>
    call<{ entry: JournalEntry }>("PUT", `/api/journal/${id}`, input),
  deleteJournalEntry: (id: string) => call<{ ok: true }>("DELETE", `/api/journal/${id}`),

  progress: () => call<ProgressSummary>("GET", "/api/progress"),

  listSessions: () => call<{ sessions: SessionSummary[] }>("GET", "/api/sessions"),
  startSession: (arrivalState: string) =>
    call<{ session: { id: string }; messages: SessionMessage[] }>("POST", "/api/sessions", { arrivalState, consentVersion: "groq-v1" }),
  sessionMessages: (id: string) =>
    call<{ session: { id: string; endedAt: string | null; createdAt: string }; messages: SessionMessage[] }>(
      "GET",
      `/api/sessions/${id}/messages`,
    ),
  sendMessage: (id: string, content: string) =>
    call<{ userMessage: SessionMessage; companionMessage: SessionMessage; flagged: boolean }>(
      "POST",
      `/api/sessions/${id}/messages`,
      { content },
    ),
  endSession: (id: string, input: { postMood?: number; reflection?: string }) =>
    call<{ session: unknown }>("POST", `/api/sessions/${id}/end`, input),

  listCircles: () => call<{ circles: CircleSummary[] }>("GET", "/api/circles"),
  circlePosts: (circleId: string) =>
    call<{ posts: CirclePost[] }>("GET", `/api/circles/${circleId}/posts`),
  createCirclePost: (circleId: string, content: string) =>
    call<{ post: CirclePost }>("POST", `/api/circles/${circleId}/posts`, { content }),
  toggleLike: (postId: string) =>
    call<{ likes: number; likedByMe: boolean }>("POST", `/api/circles/posts/${postId}/like`),
};
