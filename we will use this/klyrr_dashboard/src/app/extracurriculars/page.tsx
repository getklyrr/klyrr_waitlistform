"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Trophy,
  FlaskConical,
  Landmark,
  Sun,
  Clock,
  CalendarDays,
  ChevronRight,
  Sparkles,
  Lock,
  Star,
  Target,
  FileText,
  Mic,
  Layers,
  CheckCircle2,
  Circle,
  PauseCircle,
  AlertTriangle,
  Plus,
  X,
  ArrowRight,
  LayoutDashboard,
  GraduationCap,
  FolderOpen,
  BookOpen,
  Zap,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// PART 1 — TYPES & MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

type ActivityCategory = "Research" | "Scholarship" | "Leadership" | "Summer Program" | "Competition" | "Internship";
type ActivityStatus = "Not Started" | "In Progress" | "Submitted" | "Accepted" | "Rejected" | "Waitlisted";
type UrgencyLevel = "critical" | "warning" | "normal" | "safe";

interface Requirement {
  label: string;
  done: boolean;
}

interface Extracurricular {
  id: number;
  title: string;
  organisation: string;
  category: ActivityCategory;
  status: ActivityStatus;
  deadline: string; // ISO date string
  description: string;
  location: string;
  stipend: string | null;
  requirements: Requirement[];
  tags: string[];
  aiPrepAvailable: boolean;
}

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getUrgency(dateStr: string, status: ActivityStatus): UrgencyLevel {
  if (status === "Submitted" || status === "Accepted" || status === "Rejected") return "safe";
  const days = getDaysUntil(dateStr);
  if (days < 0) return "safe";
  if (days <= 15) return "critical";
  if (days <= 30) return "warning";
  return "normal";
}

// Deadlines set relative to today so urgency always renders correctly
function relativeDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

const MOCK_EXTRACURRICULARS: Extracurricular[] = [
  {
    id: 1,
    title: "Research Internship in Computational Neuroscience",
    organisation: "MIT Brain & Cognitive Sciences",
    category: "Research",
    status: "In Progress",
    deadline: relativeDate(9),
    description:
      "A competitive 10-week summer research program embedding undergraduate students in active labs focused on neural computation, machine learning, and cognitive modelling. Fellows receive direct mentorship from faculty and present findings at a closing symposium.",
    location: "Cambridge, MA — On-site",
    stipend: "$6,000 + housing",
    requirements: [
      { label: "Personal Statement (500 words)", done: true },
      { label: "Two Letters of Recommendation", done: true },
      { label: "Research Proposal (300 words)", done: false },
      { label: "Unofficial Transcript Upload", done: false },
    ],
    tags: ["STEM", "Neuroscience", "Research", "Paid"],
    aiPrepAvailable: true,
  },
  {
    id: 2,
    title: "Inlaks Shivdasani Foundation Scholarship",
    organisation: "Inlaks Foundation",
    category: "Scholarship",
    status: "Not Started",
    deadline: relativeDate(22),
    description:
      "One of India's most prestigious postgraduate scholarships for exceptional students wishing to study at leading universities abroad. Awards up to $100,000 covering tuition, living expenses, and travel for Masters or PhD programmes at universities ranked in the global top 50.",
    location: "Remote Application",
    stipend: "Up to $100,000",
    requirements: [
      { label: "Application Form", done: false },
      { label: "Academic Transcripts", done: false },
      { label: "Statement of Purpose (1000 words)", done: false },
      { label: "Three Referee Reports", done: false },
      { label: "GRE / GMAT Scores", done: false },
    ],
    tags: ["Scholarship", "Postgraduate", "Fully Funded", "Competitive"],
    aiPrepAvailable: true,
  },
  {
    id: 3,
    title: "Student Senate President",
    organisation: "UIET Chandigarh",
    category: "Leadership",
    status: "Accepted",
    deadline: relativeDate(-30),
    description:
      "Elected head of the Student Senate representing 3,200 undergraduates across six departments. Responsibilities include chairing monthly sessions, liaising with faculty administration, and spearheading the annual Techfest budget of ₹18 lakhs.",
    location: "Chandigarh, India",
    stipend: null,
    requirements: [
      { label: "Election Nomination Filed", done: true },
      { label: "Manifesto Submitted", done: true },
      { label: "Campaign Completed", done: true },
    ],
    tags: ["Leadership", "Elected", "On-Campus", "Student Government"],
    aiPrepAvailable: true,
  },
  {
    id: 4,
    title: "iD Tech AI & Machine Learning Camp",
    organisation: "iD Tech at Stanford University",
    category: "Summer Program",
    status: "Not Started",
    deadline: relativeDate(41),
    description:
      "An intensive two-week residential programme on the Stanford campus for advanced high school and early undergraduate students. Curriculum covers supervised learning, neural network architecture, computer vision, and a capstone project pitched to a panel of industry mentors.",
    location: "Stanford, CA — Residential",
    stipend: null,
    requirements: [
      { label: "Application Essay", done: false },
      { label: "Counsellor Recommendation", done: false },
      { label: "Coding Portfolio / GitHub Link", done: false },
      { label: "Enrolment Fee Payment", done: false },
    ],
    tags: ["AI/ML", "Summer", "Stanford", "Residential", "STEM"],
    aiPrepAvailable: true,
  },
  {
    id: 5,
    title: "Google Code-In Open Source Challenge",
    organisation: "Google",
    category: "Competition",
    status: "Submitted",
    deadline: relativeDate(-14),
    description:
      "Annual global competition for pre-university students to complete open-source tasks for Google-affiliated mentoring organisations. Tasks span coding, design, documentation, and quality assurance. Grand Prize winners are flown to Google HQ.",
    location: "Remote",
    stipend: null,
    requirements: [
      { label: "Account Registration", done: true },
      { label: "Minimum 3 Tasks Completed", done: true },
      { label: "Final Submission", done: true },
    ],
    tags: ["Open Source", "Competition", "Remote", "Google"],
    aiPrepAvailable: false,
  },
  {
    id: 6,
    title: "Fulbright Foreign Student Program",
    organisation: "U.S. Department of State",
    category: "Scholarship",
    status: "Not Started",
    deadline: relativeDate(58),
    description:
      "The flagship international exchange scholarship sponsored by the U.S. government. Covers full tuition, airfare, living stipend, and health insurance for a graduate degree at a U.S. institution. The most competitive scholarship for international students.",
    location: "USA — University of Choice",
    stipend: "Full funding + living allowance",
    requirements: [
      { label: "Online Application", done: false },
      { label: "Study Objective Statement", done: false },
      { label: "Personal Statement", done: false },
      { label: "Three Letters of Recommendation", done: false },
      { label: "Language Proficiency Test", done: false },
    ],
    tags: ["Fully Funded", "US Government", "Prestigious", "Graduate"],
    aiPrepAvailable: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_META: Record<ActivityCategory, { icon: React.FC<{ className?: string }>, color: string, bg: string }> = {
  Research:        { icon: FlaskConical, color: "#5B7FA6", bg: "rgba(91,127,166,0.10)" },
  Scholarship:     { icon: Trophy,       color: "#B48C3C", bg: "rgba(180,140,60,0.12)" },
  Leadership:      { icon: Landmark,     color: "#4A1525", bg: "rgba(74,21,37,0.08)"   },
  "Summer Program":{ icon: Sun,          color: "#C07A3A", bg: "rgba(192,122,58,0.10)" },
  Competition:     { icon: Star,         color: "#7C5CBF", bg: "rgba(124,92,191,0.10)" },
  Internship:      { icon: Layers,       color: "#3A8A6E", bg: "rgba(58,138,110,0.10)" },
};

const STATUS_META: Record<ActivityStatus, { icon: React.FC<{ className?: string }>, color: string, label: string }> = {
  "Not Started": { icon: Circle,       color: "rgba(74,21,37,0.30)", label: "Not Started" },
  "In Progress": { icon: PauseCircle,  color: "#B48C3C",              label: "In Progress" },
  "Submitted":   { icon: CheckCircle2, color: "#3A8A6E",              label: "Submitted"   },
  "Accepted":    { icon: CheckCircle2, color: "#2E7D32",              label: "Accepted"    },
  "Rejected":    { icon: X,            color: "#C62828",              label: "Rejected"    },
  "Waitlisted":  { icon: Clock,        color: "#E65100",              label: "Waitlisted"  },
};

const URGENCY_META: Record<UrgencyLevel, { bg: string, text: string, border: string, label: string }> = {
  critical: { bg: "rgba(198,40,40,0.08)",  text: "#C62828", border: "rgba(198,40,40,0.25)", label: "Urgent"   },
  warning:  { bg: "rgba(180,140,60,0.10)", text: "#B48C3C", border: "rgba(180,140,60,0.30)", label: "Soon"    },
  normal:   { bg: "rgba(74,21,37,0.05)",   text: "#4A1525", border: "rgba(74,21,37,0.12)",   label: "Upcoming"},
  safe:     { bg: "rgba(46,125,50,0.06)",  text: "#2E7D32", border: "rgba(46,125,50,0.18)",  label: "Closed"  },
};

const CATEGORY_FILTERS: (ActivityCategory | "All")[] = [
  "All", "Research", "Scholarship", "Leadership", "Summer Program", "Competition", "Internship",
];

const AI_RESPONSES: Record<string, { interviewPrep: string; applicationStrategy: string }> = {
  "1": {
    interviewPrep:
      "For MIT BCS, expect a 20–30 min video interview focused on your research motivation and technical depth.\n\n**Likely questions:**\n• Walk me through a computational problem you've independently investigated.\n• How do you approach debugging a neural network that isn't converging?\n• What is your understanding of the difference between supervised and unsupervised learning in the context of neuroscience?\n\n**Recommended preparation:**\n• Review your prior coursework in linear algebra, probability, and any neuroscience electives.\n• Prepare a crisp 3-minute narrative about your research interests using the STAR framework.\n• Read 2 recent papers from your target lab on MIT DSpace before the interview.",
    applicationStrategy:
      "**Priority actions this week:**\n1. Draft your Research Proposal — this is weighted most heavily. Lead with a specific unanswered question, not a broad topic.\n2. Email your recommenders TODAY with a deadline reminder and a one-pager on your achievements.\n3. Use the 500-word personal statement to tell a story, not list credentials.\n\n**Differentiating angle:** Most applicants describe *what* they've studied. You should describe a moment of genuine confusion that sparked curiosity — this signals authentic scientific thinking.",
  },
  "2": {
    interviewPrep:
      "The Inlaks interview is conducted by a panel of 3–5 judges in Delhi or Mumbai. It lasts 45–60 minutes and is conversational but rigorous.\n\n**Likely questions:**\n• Why do you need to go abroad for this — what can't India offer?\n• How will you return value to India after your programme?\n• Name a global problem in your field and articulate your approach to solving it.\n• If you don't get in this year, what's your backup plan?\n\n**Mindset:** The panel is testing intellectual honesty and national commitment as much as academic brilliance. Avoid overly polished answers.",
    applicationStrategy:
      "**The Inlaks meta-strategy:**\nThis scholarship selects for *uncommon profiles* — they already receive thousands of applications from high-GPA students.\n\n1. Your SOP must crystallise ONE specific research/career question and explain why THIS programme at THAT university is the only path to answering it.\n2. Referee reports carry enormous weight — brief your referees on the scholarship values (national commitment, intellectual independence).\n3. Highlight any evidence of leadership or community contribution, even informal.",
  },
  "3": {
    interviewPrep:
      "As Student Senate President, admissions interviews will probe this role deeply.\n\n**Likely questions:**\n• What was the hardest decision you made as president and what was the outcome?\n• Describe a situation where you had to change the minds of a hostile group.\n• What institutional change are you most proud of?\n\n**Preparation tip:** Quantify your impact. 'I increased event attendance' becomes 'I redesigned our outreach process, lifting attendance by 40% over two semesters.'",
    applicationStrategy:
      "**Framing this role for US/UK applications:**\nAdmissions offices value leadership evidence that shows *systems thinking* — not just popularity.\n\n1. In every essay that references this role, connect a specific decision to a broader institutional impact.\n2. Use this as your primary 'leadership' activity across all Common App/UCAS entries.\n3. Ask your university's Dean or a faculty member who observed your tenure to write one of your recommendation letters — institutional voices are highly credible.",
  },
  "4": {
    interviewPrep:
      "iD Tech uses a short (15 min) virtual interview for competitive cohorts.\n\n**Likely questions:**\n• What ML project have you built or contributed to? Walk me through your process.\n• If you could improve one aspect of an existing AI system you use daily, what would it be?\n• How do you learn new technical concepts — give a recent example.\n\n**Show, don't tell:** Have your GitHub open during the interview. Be ready to share a screen and walk through 20–30 lines of code you're proud of.",
    applicationStrategy:
      "**Your application essay should:**\n1. Open with a specific moment — a bug that took days to solve, or an unexpected output that made you rethink your model.\n2. Demonstrate that you know what the programme covers (CNNs, transfer learning, capstone projects) — signal you've done your research.\n3. Name the kind of mentor/lab environment you're looking for — this shows maturity.\n\n**Portfolio tip:** Pin 2–3 repositories to your GitHub profile this week. Even small, documented projects outperform empty profiles.",
  },
  "5": {
    interviewPrep:
      "Google Code-In is competition-based, no interview required.\n\n**Post-submission:**\nIf you advance to finalist/winner stage, Google may conduct a brief call. Focus points:\n• Why open source matters to you beyond the competition.\n• Which task you found most challenging and how you resolved blockers.\n• What you'd like to contribute to the mentoring org long-term.",
    applicationStrategy:
      "**Leveraging this for applications:**\nEven without winning, submitted participation in Google Code-In is a strong signal.\n\n1. Document every task completed with the lines of code, language, and impact on the project.\n2. Reach out to your mentoring org contact for a brief written endorsement — even an informal email thread counts as evidence.\n3. In your CS essays, use the specific technical challenge you solved here as a concrete anecdote.",
  },
  "6": {
    interviewPrep:
      "The Fulbright interview (if shortlisted by country) is 30–40 minutes with a national selection committee.\n\n**Likely questions:**\n• Why the U.S. specifically — what does it uniquely offer your field?\n• How has your background shaped your academic outlook?\n• What will you bring back to your home country after your studies?\n• Describe a time you navigated a significant cross-cultural situation.\n\n**Critical nuance:** Fulbright is a cultural exchange programme as much as an academic one. Demonstrate global citizenship, not just academic ambition.",
    applicationStrategy:
      "**The Fulbright SOP is the most important document you'll write this cycle.**\n\n1. The opening paragraph must establish WHO you are in a single, memorable sentence — not your GPA, your story.\n2. Your 'why U.S.' argument must be specific: name the lab, the professor, the methodology — show that only this programme advances your stated research question.\n3. Your 'return plan' must be concrete: name the institution or initiative you intend to contribute to back home.\n\n**Timeline recommendation:** Start this SOP today. Plan for 6 full drafts over 8 weeks.",
  },
};

const BOTTOM_NAV_TABS = [
  { label: "Dashboard",      icon: LayoutDashboard, href: "/dashboard",       active: false },
  { label: "Universities",   icon: GraduationCap,   href: "/universities",    active: false },
  { label: "Docs",           icon: FolderOpen,      href: "/documents",       active: false },
  { label: "Extras",         icon: Trophy,          href: "/extracurriculars",active: true  },
  { label: "Essays",         icon: BookOpen,        href: "/essays",          active: false },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function formatDeadline(dateStr: string): string {
  const days = getDaysUntil(dateStr);
  if (days < 0) return "Closed";
  if (days === 0) return "Due Today";
  if (days === 1) return "Due Tomorrow";
  if (days <= 7) return `${days} days left`;
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function completionRate(reqs: Requirement[]): number {
  if (reqs.length === 0) return 100;
  return Math.round((reqs.filter((r) => r.done).length / reqs.length) * 100);
}

function renderMarkdown(text: string): React.ReactNode[] {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={j}>{part.slice(2, -2)}</strong>
        : <span key={j}>{part}</span>
    );
    return <span key={i} className="block">{parts}{i < text.split("\n").length - 1 ? null : null}</span>;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PART 2 — PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function ExtracurricularsPage() {
  const [activeFilter, setActiveFilter] = useState<ActivityCategory | "All">("All");
  const [selectedActivity, setSelectedActivity] = useState<Extracurricular | null>(null);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotMode, setCopilotMode] = useState<"interviewPrep" | "applicationStrategy" | null>(null);
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotOutput, setCopilotOutput] = useState<string>("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const copilotRef = useRef<HTMLDivElement>(null);

  const filtered = MOCK_EXTRACURRICULARS.filter(
    (a) => activeFilter === "All" || a.category === activeFilter
  );

  const upcoming = MOCK_EXTRACURRICULARS
    .filter((a) => {
      const d = getDaysUntil(a.deadline);
      return d >= 0 && d <= 30 && a.status !== "Submitted" && a.status !== "Accepted";
    })
    .sort((a, b) => getDaysUntil(a.deadline) - getDaysUntil(b.deadline));

  const runCopilot = (mode: "interviewPrep" | "applicationStrategy") => {
    if (!selectedActivity) return;
    setCopilotMode(mode);
    setCopilotOutput("");
    setCopilotLoading(true);
    setTimeout(() => {
      const data = AI_RESPONSES[String(selectedActivity.id)];
      setCopilotOutput(data ? data[mode] : "Analysis complete. Focus on tailoring your application narrative to the specific requirements of this programme.");
      setCopilotLoading(false);
    }, 1600);
  };

  const openCopilot = (activity: Extracurricular) => {
    setSelectedActivity(activity);
    setCopilotOpen(true);
    setCopilotMode(null);
    setCopilotOutput("");
    setTimeout(() => copilotRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const closeCopilot = () => {
    setCopilotOpen(false);
    setCopilotMode(null);
    setCopilotOutput("");
    setSelectedActivity(null);
  };

  return (
    <div
      className="min-h-screen pb-24"
      style={{ backgroundColor: "#F9F6F0" }}
    >
      {/* ── Page Header ───────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-20 border-b"
        style={{ backgroundColor: "#F9F6F0", borderColor: "#E8DCC4", backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1
              className="text-2xl font-bold tracking-tight leading-none"
              style={{ color: "#4A1525", fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "-0.025em" }}
            >
              Extracurricular Tracker
            </h1>
            <p className="text-xs mt-0.5 opacity-50" style={{ color: "#4A1525" }}>
              {MOCK_EXTRACURRICULARS.length} activities &nbsp;·&nbsp; {upcoming.length} deadline{upcoming.length !== 1 ? "s" : ""} this month
            </p>
          </div>
          <button
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
            style={{ backgroundColor: "#4A1525", color: "white" }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Activity
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">

        {/* ── Deadline Alert Strip ──────────────────────────────────── */}
        {upcoming.length > 0 && (
          <section className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#B48C3C" }} />
              <h2 className="text-xs font-semibold uppercase tracking-widest opacity-60" style={{ color: "#4A1525" }}>
                Upcoming Deadlines
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {upcoming.map((a) => {
                const days = getDaysUntil(a.deadline);
                const urgency = getUrgency(a.deadline, a.status);
                const u = URGENCY_META[urgency];
                return (
                  <button
                    key={a.id}
                    onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-150 hover:shadow-sm active:scale-[0.99]"
                    style={{ backgroundColor: u.bg, borderColor: u.border }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold tabular-nums"
                      style={{ backgroundColor: u.border, color: u.text }}
                    >
                      {days}d
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: "#4A1525" }}>{a.title}</p>
                      <p className="text-xs opacity-50 truncate" style={{ color: "#4A1525" }}>{a.organisation}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                      style={{ backgroundColor: u.border, color: u.text }}>
                      {u.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Category Filter Chips ─────────────────────────────────── */}
        <div className="flex flex-wrap gap-2">
          {CATEGORY_FILTERS.map((cat) => {
            const active = activeFilter === cat;
            const meta = cat !== "All" ? CATEGORY_META[cat] : null;
            const Icon = meta?.icon;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 active:scale-95"
                style={{
                  borderColor: active ? "#4A1525" : "#E8DCC4",
                  backgroundColor: active ? "#4A1525" : "white",
                  color: active ? "white" : "#4A1525",
                }}
              >
                {Icon && <Icon className="w-3 h-3" />}
                {cat}
              </button>
            );
          })}
        </div>

        {/* ── Activity Cards ────────────────────────────────────────── */}
        <section className="space-y-3">
          {filtered.map((activity, index) => {
            const catMeta = CATEGORY_META[activity.category];
            const statuMeta = STATUS_META[activity.status];
            const urgency = getUrgency(activity.deadline, activity.status);
            const u = URGENCY_META[urgency];
            const CatIcon = catMeta.icon;
            const StatusIcon = statuMeta.icon;
            const completion = completionRate(activity.requirements);
            const expanded = expandedId === activity.id;

            return (
              <div
                key={activity.id}
                className="rounded-2xl border overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: "white",
                  borderColor: expanded ? "#4A1525" : "#E8DCC4",
                  boxShadow: expanded ? "0 4px 24px rgba(74,21,37,0.08)" : "none",
                }}
              >
                {/* Card Header — always visible */}
                <button
                  className="w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-black/1.5 transition-colors"
                  onClick={() => setExpandedId(expanded ? null : activity.id)}
                >
                  {/* Category Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: catMeta.bg }}
                  >
                    <span style={{color:catMeta.color}}>
                      <CatIcon className="w-4.5 h-4.5"  />
                      </span>
                  </div>

                  {/* Title block */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p
                          className="font-semibold leading-snug text-sm"
                          style={{ color: "#4A1525", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "15px" }}
                        >
                          {activity.title}
                        </p>
                        <p className="text-xs opacity-45 mt-0.5" style={{ color: "#4A1525" }}>
                          {activity.organisation}
                        </p>
                      </div>

                      {/* Deadline badge */}
                      <div
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg shrink-0 text-xs font-semibold"
                        style={{ backgroundColor: u.bg, color: u.text, border: `1px solid ${u.border}` }}
                      >
                        <CalendarDays className="w-3 h-3" />
                        {formatDeadline(activity.deadline)}
                      </div>
                    </div>

                    {/* Status + completion row */}
                    <div className="flex items-center gap-3 mt-2.5">
                      <div className="flex items-center gap-1">
                        <span style={{color: statuMeta.color}}>
                          <StatusIcon   className="w-3 h-3" />
                          </span>
                        <span className="text-xs font-medium" style={{ color: statuMeta.color }}>
                          {statuMeta.label}
                        </span>
                      </div>

                      <span className="opacity-20 text-xs" style={{ color: "#4A1525" }}>·</span>

                      <div className="flex items-center gap-2 flex-1">
                        <div className="flex-1 max-w-25 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#E8DCC4" }}>
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${completion}%`,
                              backgroundColor: completion === 100 ? "#2E7D32" : "#B48C3C",
                            }}
                          />
                        </div>
                        <span className="text-xs opacity-40 tabular-nums" style={{ color: "#4A1525" }}>
                          {completion}%
                        </span>
                      </div>

                      {/* Tags — desktop only */}
                      <div className="hidden sm:flex gap-1.5">
                        {activity.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-md"
                            style={{ backgroundColor: "#F9F6F0", color: "#4A1525", opacity: 0.6 }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <ChevronRight
                    className="shrink-0 mt-1 transition-transform duration-200"
                    style={{
                      color: "#4A1525",
                      width: "16px",
                      height: "16px",
                      opacity: 0.3,
                      transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                {/* Expanded Content */}
                {expanded && (
                  <div style={{ borderTop: "1px solid #E8DCC4" }}>
                    {/* Description + Meta */}
                    <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2 space-y-3">
                        <p className="text-xs leading-relaxed opacity-65" style={{ color: "#4A1525", lineHeight: "1.75" }}>
                          {activity.description}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs opacity-50" style={{ color: "#4A1525" }}>
                          <span>📍 {activity.location}</span>
                          {activity.stipend && <span>💰 {activity.stipend}</span>}
                        </div>
                      </div>

                      {/* Requirements checklist */}
                      <div
                        className="rounded-xl p-3.5 space-y-2"
                        style={{ backgroundColor: "#F9F6F0", border: "1px solid #E8DCC4" }}
                      >
                        <p className="text-xs font-semibold uppercase tracking-widest opacity-40 mb-2" style={{ color: "#4A1525" }}>
                          Requirements
                        </p>
                        {activity.requirements.map((req, i) => (
                          <div key={i} className="flex items-start gap-2">
                            {req.done
                              ? <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "#2E7D32" }} />
                              : <Circle className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-30" style={{ color: "#4A1525" }} />
                            }
                            <span
                              className="text-xs leading-snug"
                              style={{ color: "#4A1525", opacity: req.done ? 0.45 : 0.75, textDecoration: req.done ? "line-through" : "none" }}
                            >
                              {req.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action row */}
                    <div
                      className="px-5 py-3.5 flex items-center justify-between gap-3"
                      style={{ borderTop: "1px solid #E8DCC4", backgroundColor: "rgba(232,220,196,0.25)" }}
                    >
                      <div className="flex flex-wrap gap-1.5">
                        {activity.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-md"
                            style={{ backgroundColor: "white", color: "#4A1525", border: "1px solid #E8DCC4", opacity: 0.7 }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {activity.aiPrepAvailable ? (
                        <button
                          onClick={() => openCopilot(activity)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 shrink-0"
                          style={{ backgroundColor: "#4A1525", color: "white" }}
                        >
                          <Sparkles className="w-3.5 h-3.5" style={{ color: "#B48C3C" }} />
                          AI Prep Co-Pilot
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <div
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs opacity-40"
                          style={{ color: "#4A1525" }}
                        >
                          <Lock className="w-3 h-3" />
                          No prep needed
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* ── AI Prep Co-Pilot Panel ───────────────────────────────── */}
        {copilotOpen && selectedActivity && (
          <div ref={copilotRef}>
            <section
              className="rounded-2xl border overflow-hidden"
              style={{ borderColor: "#B48C3C", boxShadow: "0 0 0 3px rgba(180,140,60,0.12), 0 8px 40px rgba(74,21,37,0.10)" }}
            >
              {/* Copilot Header */}
              <div
                className="px-5 py-4 flex items-center justify-between"
                style={{ background: "linear-gradient(135deg, #4A1525 0%, #6B1F35 100%)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "rgba(180,140,60,0.25)" }}
                  >
                    <Sparkles className="w-4.5 h-4.5" style={{ color: "#B48C3C", width: "18px", height: "18px" }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                      AI Preparation Co-Pilot
                    </p>
                    <p className="text-xs opacity-50 text-white mt-0.5 truncate max-w-60">
                      {selectedActivity.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeCopilot}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
                >
                  <X className="w-4 h-4 text-white opacity-60" />
                </button>
              </div>

              {/* Premium badge */}
              <div
                className="px-5 py-3 flex items-center gap-2 border-b"
                style={{ backgroundColor: "rgba(180,140,60,0.06)", borderColor: "rgba(180,140,60,0.20)" }}
              >
                <Star className="w-3.5 h-3.5" style={{ color: "#B48C3C" }} />
                <span className="text-xs font-semibold" style={{ color: "#B48C3C" }}>
                  Klyrr Premium Feature
                </span>
                <span className="ml-auto text-xs opacity-50" style={{ color: "#4A1525" }}>
                  Powered by Klyrr AI
                </span>
              </div>

              <div className="p-5 space-y-4" style={{ backgroundColor: "white" }}>

                {/* Action buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      mode: "interviewPrep" as const,
                      icon: Mic,
                      title: "Generate Interview Prep",
                      desc: "Anticipated questions, frameworks, and practice prompts tailored to this programme.",
                    },
                    {
                      mode: "applicationStrategy" as const,
                      icon: Target,
                      title: "Draft Application Strategy",
                      desc: "Prioritised action plan, differentiating angles, and essay guidance.",
                    },
                  ].map(({ mode, icon: Icon, title, desc }) => {
                    const active = copilotMode === mode;
                    return (
                      <button
                        key={mode}
                        onClick={() => runCopilot(mode)}
                        disabled={copilotLoading}
                        className="flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          borderColor: active ? "#4A1525" : "#E8DCC4",
                          backgroundColor: active ? "rgba(74,21,37,0.03)" : "#F9F6F0",
                          boxShadow: active ? "0 0 0 2px rgba(74,21,37,0.12)" : undefined,
                        }}
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: active ? "#4A1525" : "#E8DCC4" }}
                        >
                          {copilotLoading && active
                            ? <RefreshCw className="w-4 h-4 animate-spin" style={{ color: active ? "#B48C3C" : "#4A1525", width: "16px", height: "16px" }} />
                            : <Icon className="w-4 h-4" style={{ color: active ? "#B48C3C" : "#4A1525", width: "16px", height: "16px" }} />
                          }
                        </div>
                        <div>
                          <p className="text-xs font-semibold" style={{ color: "#4A1525" }}>{title}</p>
                          <p className="text-xs opacity-50 mt-0.5 leading-relaxed" style={{ color: "#4A1525" }}>{desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Output area */}
                {(copilotLoading || copilotOutput) && (
                  <div
                    className="rounded-xl p-5 space-y-1"
                    style={{
                      backgroundColor: "#F9F6F0",
                      border: "1.5px solid #E8DCC4",
                      borderLeft: "3px solid #B48C3C",
                    }}
                  >
                    {copilotLoading ? (
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2 mb-3">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ color: "#B48C3C" }} />
                          <span className="text-xs font-medium opacity-50" style={{ color: "#4A1525" }}>
                            Analysing activity profile…
                          </span>
                        </div>
                        {[95, 80, 88, 70, 92, 60].map((w, i) => (
                          <div
                            key={i}
                            className="h-2 rounded-full animate-pulse"
                            style={{
                              width: `${w}%`,
                              backgroundColor: "#E8DCC4",
                              animationDelay: `${i * 80}ms`,
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div
                        className="text-xs leading-relaxed space-y-1"
                        style={{ color: "#4A1525", lineHeight: "1.8" }}
                      >
                        <div className="flex items-center gap-2 mb-3 pb-2.5" style={{ borderBottom: "1px solid #E8DCC4" }}>
                          <Zap className="w-3.5 h-3.5" style={{ color: "#B48C3C" }} />
                          <span className="text-xs font-semibold" style={{ color: "#B48C3C" }}>
                            {copilotMode === "interviewPrep" ? "Interview Preparation" : "Application Strategy"} — {selectedActivity.organisation}
                          </span>
                        </div>
                        {renderMarkdown(copilotOutput)}
                      </div>
                    )}
                  </div>
                )}

                {/* Empty state */}
                {!copilotLoading && !copilotOutput && (
                  <div
                    className="rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2 opacity-40"
                    style={{ border: "1.5px dashed #E8DCC4" }}
                  >
                    <Sparkles className="w-5 h-5" style={{ color: "#B48C3C" }} />
                    <p className="text-xs" style={{ color: "#4A1525" }}>
                      Select an action above to generate tailored AI guidance for this activity.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* ── Global Bottom Navigation ──────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t"
        style={{ backgroundColor: "#F9F6F0", borderColor: "#E8DCC4" }}
      >
        <div className="max-w-lg mx-auto flex items-stretch h-16">
          {BOTTOM_NAV_TABS.map(({ label, icon: Icon, href, active }) => (
            <Link
              key={label}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-150 relative"
              style={{ color: active ? "#4A1525" : "rgba(74,21,37,0.35)" }}
            >
              {active && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                  style={{ backgroundColor: "#B48C3C" }}
                />
              )}
              <Icon
                className="transition-transform duration-150"
                style={{
                  width: "18px",
                  height: "18px",
                  transform: active ? "scale(1.1)" : "scale(1)",
                }}
              />
              <span
                className="text-xs font-medium"
                style={{
                  fontSize: "10px",
                  fontWeight: active ? 700 : 500,
                  letterSpacing: active ? "-0.01em" : "0",
                }}
              >
                {label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
