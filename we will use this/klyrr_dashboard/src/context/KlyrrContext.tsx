"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type FinancialPlan = "full_aid" | "partial_aid" | "self_funded";
export type AcademicStage = "grade_11" | "grade_12" | "gap_year" | "transfer";

export interface UserProfile {
  name: string;
  targetCountries: string[];
  academicStage: AcademicStage | "";
  major: string;
  gpa: string;
  financialPlan: FinancialPlan | "";
  extracurriculars: string;
  completed: boolean;
}

export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  acceptanceRate: number;
  tuitionUSD: number;
  financialAidAvailable: boolean;
  fullAidAvailable: boolean;
  programs: string[];
  deadline: string;
  type: "Reach" | "Target" | "Safety";
  matchScore?: number;
  logo: string;
  description: string;
}

export interface Essay {
  id: string;
  universityId: string;
  universityName: string;
  prompt: string;
  promptDecoded: string;
  content: string;
  wordCount: number;
  wordLimit: number;
  status: "Draft" | "In Review" | "Final";
  lastEdited: string;
}

export interface KlyrrContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  shortlistedUniversities: University[];
  addToShortlist: (university: University) => void;
  removeFromShortlist: (id: string) => void;
  essays: Essay[];
  addEssay: (essay: Essay) => void;
  updateEssay: (id: string, updates: Partial<Essay>) => void;
}

const defaultProfile: UserProfile = {
  name: "",
  targetCountries: [],
  academicStage: "",
  major: "",
  gpa: "",
  financialPlan: "",
  extracurriculars: "",
  completed: false,
};

const KlyrrContext = createContext<KlyrrContextType | undefined>(undefined);

export function KlyrrProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [shortlistedUniversities, setShortlistedUniversities] = useState<University[]>([]);
  const [essays, setEssays] = useState<Essay[]>([]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const addToShortlist = (university: University) => {
    setShortlistedUniversities((prev) => {
      if (prev.find((u) => u.id === university.id)) return prev;
      return [...prev, university];
    });
  };

  const removeFromShortlist = (id: string) => {
    setShortlistedUniversities((prev) => prev.filter((u) => u.id !== id));
  };

  const addEssay = (essay: Essay) => {
    setEssays((prev) => [...prev, essay]);
  };

  const updateEssay = (id: string, updates: Partial<Essay>) => {
    setEssays((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, ...updates, wordCount: updates.content ? updates.content.trim().split(/\s+/).filter(Boolean).length : e.wordCount }
          : e
      )
    );
  };

  return (
    <KlyrrContext.Provider
      value={{
        profile,
        updateProfile,
        shortlistedUniversities,
        addToShortlist,
        removeFromShortlist,
        essays,
        addEssay,
        updateEssay,
      }}
    >
      {children}
    </KlyrrContext.Provider>
  );
}

export function useKlyrr() {
  const ctx = useContext(KlyrrContext);
  if (!ctx) throw new Error("useKlyrr must be used within KlyrrProvider");
  return ctx;
}

// ── Mock University Data ────────────────────────────────────────────────────
export const MOCK_UNIVERSITIES: University[] = [
  {
    id: "1", name: "University of Toronto", country: "Canada", city: "Toronto",
    acceptanceRate: 43, tuitionUSD: 38000, financialAidAvailable: true, fullAidAvailable: false,
    programs: ["Computer Science", "Engineering", "Business", "Medicine"],
    deadline: "Jan 15, 2025", type: "Target", logo: "🍁",
    description: "Canada's top research university with a strong international student community.",
  },
  {
    id: "2", name: "University of Edinburgh", country: "UK", city: "Edinburgh",
    acceptanceRate: 36, tuitionUSD: 32000, financialAidAvailable: true, fullAidAvailable: false,
    programs: ["Computer Science", "Medicine", "Law", "Arts"],
    deadline: "Jan 25, 2025", type: "Target", logo: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    description: "Historic Russell Group university renowned for innovation and research.",
  },
  {
    id: "3", name: "National University of Singapore", country: "Singapore", city: "Singapore",
    acceptanceRate: 18, tuitionUSD: 27000, financialAidAvailable: true, fullAidAvailable: true,
    programs: ["Computer Science", "Engineering", "Business", "Medicine"],
    deadline: "Mar 1, 2025", type: "Reach", logo: "🇸🇬",
    description: "Asia's leading global university with exceptional scholarship opportunities for Indian students.",
  },
  {
    id: "4", name: "University of Melbourne", country: "Australia", city: "Melbourne",
    acceptanceRate: 52, tuitionUSD: 35000, financialAidAvailable: true, fullAidAvailable: false,
    programs: ["Engineering", "Commerce", "Arts", "Science"],
    deadline: "Oct 31, 2024", type: "Target", logo: "🦘",
    description: "Australia's leading university, consistently ranked in global top 40.",
  },
  {
    id: "5", name: "TU Munich", country: "Germany", city: "Munich",
    acceptanceRate: 8, tuitionUSD: 500, financialAidAvailable: true, fullAidAvailable: true,
    programs: ["Computer Science", "Engineering", "Natural Sciences"],
    deadline: "May 31, 2025", type: "Reach", logo: "🇩🇪",
    description: "Germany's top technical university. Near-zero tuition even for international students.",
  },
  {
    id: "6", name: "University of Waterloo", country: "Canada", city: "Waterloo",
    acceptanceRate: 53, tuitionUSD: 36000, financialAidAvailable: true, fullAidAvailable: false,
    programs: ["Computer Science", "Engineering", "Mathematics"],
    deadline: "Feb 1, 2025", type: "Safety", logo: "💧",
    description: "North America's #1 co-op university. 100% employment rate for CS graduates.",
  },
  {
    id: "7", name: "University of Amsterdam", country: "Netherlands", city: "Amsterdam",
    acceptanceRate: 40, tuitionUSD: 12000, financialAidAvailable: true, fullAidAvailable: false,
    programs: ["Computer Science", "Economics", "Social Sciences", "Psychology"],
    deadline: "Apr 1, 2025", type: "Target", logo: "🌷",
    description: "World-class education with affordable tuition in the heart of Europe.",
  },
  {
    id: "8", name: "University College Dublin", country: "Ireland", city: "Dublin",
    acceptanceRate: 55, tuitionUSD: 22000, financialAidAvailable: true, fullAidAvailable: false,
    programs: ["Computer Science", "Business", "Engineering", "Law"],
    deadline: "Feb 1, 2025", type: "Safety", logo: "☘️",
    description: "Ireland's largest university with strong industry ties to major tech companies.",
  },
  {
    id: "9", name: "King's College London", country: "UK", city: "London",
    acceptanceRate: 30, tuitionUSD: 33000, financialAidAvailable: true, fullAidAvailable: false,
    programs: ["Law", "Medicine", "Arts", "Science", "Engineering"],
    deadline: "Jan 25, 2025", type: "Reach", logo: "👑",
    description: "Russell Group university in central London with exceptional global alumni network.",
  },
  {
    id: "10", name: "Simon Fraser University", country: "Canada", city: "Vancouver",
    acceptanceRate: 61, tuitionUSD: 25000, financialAidAvailable: true, fullAidAvailable: false,
    programs: ["Computing Science", "Business", "Engineering", "Arts"],
    deadline: "Feb 28, 2025", type: "Safety", logo: "🏔️",
    description: "Leading Canadian university with strong tech industry connections in Vancouver.",
  },
];

export const COUNTRIES = ["USA", "UK", "Canada", "Australia", "Germany", "Singapore", "Netherlands", "Ireland"];
export const MAJORS = [
  "Computer Science", "Engineering", "Business & Management", "Medicine",
  "Law", "Economics", "Psychology", "Architecture", "Data Science", "Arts & Humanities",
];