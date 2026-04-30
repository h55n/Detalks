import { createContext, useContext, useState, ReactNode } from "react";

type User = {
  name: string;
  plan: "free" | "companion_plus" | "professional";
  isStudentVerified: boolean;
  alias: string;
};

type MoodHistory = number[]; // e.g. [3,3,4,2,3,4,4] (1-5 scale)

export type JournalEntry = {
  id: string;
  date: string;
  day: string;
  time: string;
  preview: string;
  content: string;
  mood: "good" | "neutral" | "rough";
};

type AppState = {
  user: User;
  moodHistory: MoodHistory;
  sessionsCount: number;
  journalEntries: JournalEntry[];
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentMood: number | null;
  setCurrentMood: (mood: number | null) => void;
};

const defaultState: AppState = {
  user: {
    name: "Rohan",
    plan: "free",
    isStudentVerified: true,
    alias: "WarmPebble",
  },
  moodHistory: [3, 3, 4, 2, 3, 4, 4],
  sessionsCount: 3,
  journalEntries: [
    {
      id: "1",
      date: "14 April",
      day: "Monday",
      time: "8:30 PM",
      preview: "Felt overwhelmed after the study group today. Everyone seemed to understand the material except me...",
      content: "Felt overwhelmed after the study group today. Everyone seemed to understand the material except me. I know I shouldn't compare, but it's hard.",
      mood: "rough",
    },
    {
      id: "2",
      date: "12 April",
      day: "Saturday",
      time: "9:00 AM",
      preview: "Slept in. The morning quiet was really nice. Had chai on the balcony without checking my phone...",
      content: "Slept in. The morning quiet was really nice. Had chai on the balcony without checking my phone for the first hour.",
      mood: "good",
    },
    {
      id: "3",
      date: "10 April",
      day: "Thursday",
      time: "11:15 PM",
      preview: "Just a regular day. Got most of my reading done, but still feel a bit behind schedule...",
      content: "Just a regular day. Got most of my reading done, but still feel a bit behind schedule. Need to focus more tomorrow.",
      mood: "neutral",
    },
    {
      id: "4",
      date: "08 April",
      day: "Tuesday",
      time: "10:45 PM",
      preview: "Talked to mom today. Didn't mention the test grades. It's easier when I don't have to explain...",
      content: "Talked to mom today. Didn't mention the test grades. It's easier when I don't have to explain why I'm struggling right now.",
      mood: "rough",
    },
  ],
  currentTab: "home",
  setCurrentTab: () => {},
  currentMood: null,
  setCurrentMood: () => {},
};

const AppContext = createContext<AppState>(defaultState);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentTab, setCurrentTab] = useState("home");
  const [currentMood, setCurrentMood] = useState<number | null>(null);

  return (
    <AppContext.Provider
      value={{
        ...defaultState,
        currentTab,
        setCurrentTab,
        currentMood,
        setCurrentMood,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
