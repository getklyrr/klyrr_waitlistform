"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy, Globe, MapPin, Calendar, Clock, ExternalLink,
  Search, Filter, Bookmark, BookmarkCheck, Zap, Users,
  Code, Palette, FlaskConical, Briefcase, Music, Sparkles,
  ChevronDown, Tag, Award, TrendingUp, Star
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
type Level = "Beginner" | "Intermediate" | "Advanced" | "Open";
type Mode = "Online" | "Offline" | "Hybrid";
type Category = "Coding" | "Design" | "Science" | "Business" | "Arts" | "General";

interface Competition {
  id: string;
  name: string;
  organizer: string;
  category: Category;
  level: Level;
  mode: Mode;
  location: string;
  deadline: string;
  eventDate: string;
  prize: string;
  teamSize: string;
  description: string;
  tags: string[];
  url: string;
  featured: boolean;
  global: boolean;
}

// ── Mock Data ────────────────────────────────────────────────────────────────
const COMPETITIONS: Competition[] = [
  {
    id: "1", name: "Smart India Hackathon 2025", organizer: "Govt. of India / AICTE",
    category: "Coding", level: "Open", mode: "Hybrid", location: "Pan India",
    deadline: "Jul 15, 2025", eventDate: "Aug 20–21, 2025",
    prize: "₹1,00,000 per team", teamSize: "6 members",
    description: "India's biggest hackathon. Solve real problems posed by government ministries and PSUs. Software + Hardware editions both available.",
    tags: ["Government", "AI/ML", "IoT", "Social Impact"], url: "https://sih.gov.in", featured: true, global: false,
  },
  {
    id: "2", name: "Google Solution Challenge", organizer: "Google Developer Student Clubs",
    category: "Coding", level: "Intermediate", mode: "Online", location: "Global",
    deadline: "Mar 28, 2025", eventDate: "Apr–May 2025",
    prize: "Global recognition + mentorship", teamSize: "1–4 members",
    description: "Build solutions using Google technologies that address UN Sustainable Development Goals. Top 100 teams get mentorship from Googlers.",
    tags: ["Google", "UN SDGs", "Android", "Cloud"], url: "https://developers.google.com/community/gdsc-solution-challenge", featured: true, global: true,
  },
  {
    id: "3", name: "MLH Global Hack Week", organizer: "Major League Hacking",
    category: "Coding", level: "Beginner", mode: "Online", location: "Global",
    deadline: "Rolling", eventDate: "Weekly",
    prize: "Swag + certificates + points", teamSize: "1–4 members",
    description: "Weekly themed hacking events open to all students. Great entry point for hackathon experience with a supportive global community.",
    tags: ["Beginner Friendly", "Weekly", "Networking"], url: "https://mlh.io", featured: false, global: true,
  },
  {
    id: "4", name: "Flipkart GRiD 6.0", organizer: "Flipkart",
    category: "Coding", level: "Advanced", mode: "Hybrid", location: "Bangalore (Finals)",
    deadline: "Jun 30, 2025", eventDate: "Aug–Sep 2025",
    prize: "₹5,00,000 + PPO offers", teamSize: "2–3 members",
    description: "E-commerce and technology challenge by Flipkart. Shortlisted teams get pre-placement interview opportunities. Highly competitive.",
    tags: ["E-commerce", "PPO", "Industry"], url: "https://dare2compete.com/flipkart-grid", featured: true, global: false,
  },
  {
    id: "5", name: "Adobe GenSolve Hackathon", organizer: "Adobe India",
    category: "Design", level: "Intermediate", mode: "Online", location: "India",
    deadline: "Jul 5, 2025", eventDate: "Jul–Aug 2025",
    prize: "₹75,000 + Adobe products", teamSize: "2–4 members",
    description: "Solve creative design challenges using generative AI and Adobe tools. Great for design + tech hybrid profiles.",
    tags: ["Design", "GenAI", "Creative Tech"], url: "https://dare2compete.com/adobe", featured: false, global: false,
  },
  {
    id: "6", name: "NASA Space Apps Challenge", organizer: "NASA",
    category: "Science", level: "Open", mode: "Hybrid", location: "Global (100+ cities)",
    deadline: "Sep 20, 2025", eventDate: "Oct 4–5, 2025",
    prize: "Global recognition + NASA review", teamSize: "2–6 members",
    description: "World's largest hackathon. Build solutions for Earth and space challenges using open NASA data. Multiple local hubs across India.",
    tags: ["Space", "NASA", "Open Data", "Science"], url: "https://www.spaceappschallenge.org", featured: true, global: true,
  },
  {
    id: "7", name: "IIM Ahmedabad Confluence", organizer: "IIM Ahmedabad",
    category: "Business", level: "Intermediate", mode: "Hybrid", location: "Ahmedabad",
    deadline: "Aug 10, 2025", eventDate: "Sep 2025",
    prize: "₹2,00,000 + mentorship", teamSize: "2–3 members",
    description: "India's premier business fest case competition. Includes marketing, consulting, finance, and entrepreneurship tracks.",
    tags: ["Case Study", "Strategy", "MBA prep"], url: "https://confluence.iima.ac.in", featured: false, global: false,
  },
  {
    id: "8", name: "Toycathon", organizer: "Govt. of India / AICTE",
    category: "General", level: "Open", mode: "Online", location: "India",
    deadline: "Jun 15, 2025", eventDate: "Jul 2025",
    prize: "₹50,000 + incubation support", teamSize: "2–5 members",
    description: "Design indigenous toys and games rooted in Indian culture. Open to all disciplines — engineering, design, arts, and social sciences.",
    tags: ["Innovation", "Culture", "Product Design"], url: "https://toycathon.mic.gov.in", featured: false, global: false,
  },
  {
    id: "9", name: "Devfolio ETHIndia", organizer: "Devfolio",
    category: "Coding", level: "Advanced", mode: "Offline", location: "Bangalore",
    deadline: "Oct 1, 2025", eventDate: "Nov 2025",
    prize: "$50,000+ in prizes", teamSize: "2–4 members",
    description: "India's largest Ethereum hackathon. Build Web3, DeFi, NFT, and blockchain solutions. Strong ecosystem of protocols sponsoring bounties.",
    tags: ["Web3", "Blockchain", "Ethereum", "DeFi"], url: "https://ethindia.co", featured: false, global: true,
  },
  {
    id: "10", name: "Microsoft Imagine Cup", organizer: "Microsoft",
    category: "Coding", level: "Intermediate", mode: "Online", location: "Global",
    deadline: "Feb 15, 2026", eventDate: "Apr 2026",
    prize: "$85,000 USD + Azure credits", teamSize: "1–3 members",
    description: "One of the world's most prestigious student tech competitions. AI, mixed reality, and game development tracks. Global finals in Seattle.",
    tags: ["Microsoft", "AI", "Global", "Prestigious"], url: "https://imaginecup.microsoft.com", featured: true, global: true,
  },
  {
    id: "11", name: "Inter IIT Tech Meet", organizer: "IIT Organizing Committee",
    category: "Coding", level: "Advanced", mode: "Offline", location: "Rotates (IITs)",
    deadline: "Oct 2025", eventDate: "Dec 2025",
    prize: "Trophies + industry recognition", teamSize: "Varies",
    description: "Annual technical championship across IITs. External student participation varies by edition. Strong signal on resume.",
    tags: ["IIT", "Technical", "Competitive"], url: "https://interiit-tech.org", featured: false, global: false,
  },
  {
    id: "12", name: "GirlScript Summer of Code", organizer: "GirlScript Foundation",
    category: "Coding", level: "Beginner", mode: "Online", location: "Global",
    deadline: "Rolling", eventDate: "May–Aug 2025",
    prize: "Certificates + swag + stipends", teamSize: "Individual",
    description: "Open source contribution program. Contribute to real projects, earn points, and get recognized. Great first open source experience.",
    tags: ["Open Source", "Beginner", "Remote"], url: "https://gssoc.girlscript.tech", featured: false, global: true,
  },
];

// ── Config ────────────────────────────────────────────────────────────────────
const CATEGORIES: { value: Category | "All"; label: string; icon: any }[] = [
  { value: "All", label: "All", icon: Trophy },
  { value: "Coding", label: "Coding", icon: Code },
  { value: "Design", label: "Design", icon: Palette },
  { value: "Science", label: "Science", icon: FlaskConical },
  { value: "Business", label: "Business", icon: Briefcase },
  { value: "Arts", label: "Arts", icon: Music },
  { value: "General", label: "General", icon: Star },
];

const LEVEL_COLORS: Record<Level, string> = {
  Beginner: "bg-green-500/10 text-green-400 border-green-500/20",
  Intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Advanced: "bg-red-500/10 text-red-400 border-red-500/20",
  Open: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const MODE_COLORS: Record<Mode, string> = {
  Online: "bg-[#B48C3C]/10 text-[#B48C3C] border-[#B48C3C]/20",
  Offline: "bg-[#4A1525]/20 text-[#c4778a] border-[#4A1525]/30",
  Hybrid: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

// ── Component ────────────────────────────────────────────────────────────────
export default function CompetitionsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [level, setLevel] = useState<Level | "All">("All");
  const [mode, setMode] = useState<Mode | "All">("All");
  const [globalOnly, setGlobalOnly] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return COMPETITIONS.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.organizer.toLowerCase().includes(search.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchCategory = category === "All" || c.category === category;
      const matchLevel = level === "All" || c.level === level;
      const matchMode = mode === "All" || c.mode === mode;
      const matchGlobal = !globalOnly || c.global;
      return matchSearch && matchCategory && matchLevel && matchMode && matchGlobal;
    });
  }, [search, category, level, mode, globalOnly]);

  const featured = filtered.filter(c => c.featured);
  const regular = filtered.filter(c => !c.featured);

  const toggleSave = (id: string) => {
    setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0]" style={{ fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <div className="bg-[#4A1525] px-5 pt-8 pb-5 sticky top-0 z-30">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={13} color="#B48C3C" />
          <span className="text-[#B48C3C] text-[10px] font-bold uppercase tracking-widest">KLYRR</span>
          <span className="text-[#B48C3C]/40 text-[10px]">×</span>
          <span className="text-[#B48C3C]/70 text-[10px] font-bold uppercase tracking-widest">Opportunities</span>
        </div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h1 className="text-white font-bold text-xl leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Competitions & Hackathons
            </h1>
            <p className="text-white/50 text-xs mt-0.5">{COMPETITIONS.length} opportunities · Local & Global</p>
          </div>
          {saved.length > 0 && (
            <div className="flex-shrink-0 bg-[#B48C3C]/20 border border-[#B48C3C]/30 rounded-xl px-3 py-2 text-center">
              <div className="text-[#B48C3C] font-bold text-base leading-none">{saved.length}</div>
              <div className="text-[#B48C3C]/70 text-[9px] mt-0.5">Saved</div>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search competitions, skills, or organizers..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#B48C3C]/60"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value as any)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  category === cat.value
                    ? "bg-[#B48C3C] text-white border-[#B48C3C]"
                    : "bg-white/10 text-white/60 border-white/15"
                }`}
              >
                <Icon size={11} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-4 py-2.5 flex items-center gap-2 bg-white border-b border-[#E8DCC4]">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            showFilters ? "bg-[#4A1525] text-white border-[#4A1525]" : "bg-white text-[#4A1525] border-[#E8DCC4]"
          }`}
        >
          <Filter size={11} /> Filters
          <ChevronDown size={11} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>

        <button
          onClick={() => setGlobalOnly(!globalOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            globalOnly ? "bg-[#4A1525] text-white border-[#4A1525]" : "bg-white text-[#4A1525] border-[#E8DCC4]"
          }`}
        >
          <Globe size={11} /> Global Only
        </button>

        <span className="ml-auto text-xs text-[#4A1525]/50">{filtered.length} results</span>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="px-4 py-3 bg-[#F9F6F0] border-b border-[#E8DCC4] flex flex-wrap gap-2">
          <div className="flex flex-wrap gap-1.5">
            {(["All", "Beginner", "Intermediate", "Advanced", "Open"] as const).map(l => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                  level === l ? "bg-[#4A1525] text-white border-[#4A1525]" : "bg-white text-[#4A1525] border-[#E8DCC4]"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["All", "Online", "Offline", "Hybrid"] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                  mode === m ? "bg-[#4A1525] text-white border-[#4A1525]" : "bg-white text-[#4A1525] border-[#E8DCC4]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 py-5 pb-24 flex flex-col gap-5">

        {/* Featured */}
        {featured.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap size={13} color="#B48C3C" />
              <span className="text-xs font-bold text-[#4A1525] uppercase tracking-widest">Featured Opportunities</span>
            </div>
            <div className="flex flex-col gap-3">
              {featured.map(comp => (
                <CompCard key={comp.id} comp={comp} saved={saved.includes(comp.id)} onSave={() => toggleSave(comp.id)} featured />
              ))}
            </div>
          </div>
        )}

        {/* All Results */}
        {regular.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy size={13} color="#4A1525" />
              <span className="text-xs font-bold text-[#4A1525] uppercase tracking-widest">All Competitions</span>
            </div>
            <div className="flex flex-col gap-3">
              {regular.map(comp => (
                <CompCard key={comp.id} comp={comp} saved={saved.includes(comp.id)} onSave={() => toggleSave(comp.id)} />
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Trophy size={32} className="mx-auto mb-3 opacity-20" color="#4A1525" />
            <p className="text-[#4A1525]/50 text-sm">No competitions found. Try adjusting filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Card Component ────────────────────────────────────────────────────────────
// ── Card Component ────────────────────────────────────────────────────────────
function CompCard({ comp, saved, onSave, featured }: {
  comp: Competition;
  saved: boolean;
  onSave: () => void;
  featured?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all ${
      featured ? "border-[#B48C3C]/40 shadow-sm" : "border-[#E8DCC4]"
    }`}>
      {featured && (
        <div className="px-4 py-1.5 flex items-center gap-1.5" style={{ background: "linear-gradient(90deg, #4A1525, #6b1a35)" }}>
          <Award size={11} color="#B48C3C" className="flex-shrink-0" />
          <span className="text-[10px] font-bold text-[#B48C3C] uppercase tracking-widest truncate">Featured</span>
        </div>
      )}

      <div className="p-4">
        {/* Top Row */}
        <div className="flex items-start justify-between gap-3 mb-3 w-full">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 w-full">
              {comp.global && (
                <Globe size={11} className="flex-shrink-0 text-[#B48C3C]" />
              )}
              {/* Added min-w-0 and strict fallbacks for missing names */}
              <h3 className="text-[#4A1525] font-bold text-sm leading-tight truncate flex-1 min-w-0" style={{ fontFamily: "'Playfair Display', serif" }}>
                {comp.name || '\u00A0'}
              </h3>
            </div>
            <p className="text-xs text-[#4A1525]/50 truncate w-full">{comp.organizer || '\u00A0'}</p>
          </div>
          <button
            onClick={onSave}
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border transition-all"
            style={{
              background: saved ? "#4A1525" : "transparent",
              borderColor: saved ? "#4A1525" : "#E8DCC4"
            }}
          >
            {saved
              ? <BookmarkCheck size={14} color="white" />
              : <Bookmark size={14} color="#4A1525" />
            }
          </button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {comp.level && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${LEVEL_COLORS[comp.level]}`}>
              {comp.level}
            </span>
          )}
          {comp.mode && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${MODE_COLORS[comp.mode]}`}>
              {comp.mode}
            </span>
          )}
          {comp.category && (
            <span className="text-[10px] px-2 py-0.5 rounded-full border bg-[#F9F6F0] text-[#4A1525]/60 border-[#E8DCC4]">
              {comp.category}
            </span>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <Clock size={11} className="text-[#4A1525]/40 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[9px] text-[#4A1525]/40 uppercase tracking-wide">Deadline</div>
              <div className="text-xs font-semibold text-[#4A1525] truncate">{comp.deadline || '\u00A0'}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <Calendar size={11} className="text-[#4A1525]/40 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[9px] text-[#4A1525]/40 uppercase tracking-wide">Event</div>
              <div className="text-xs font-semibold text-[#4A1525] truncate">{comp.eventDate || '\u00A0'}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <Trophy size={11} className="text-[#B48C3C] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[9px] text-[#4A1525]/40 uppercase tracking-wide">Prize</div>
              <div className="text-xs font-semibold text-[#4A1525] truncate">{comp.prize || '\u00A0'}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <Users size={11} className="text-[#4A1525]/40 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[9px] text-[#4A1525]/40 uppercase tracking-wide">Team</div>
              <div className="text-xs font-semibold text-[#4A1525] truncate">{comp.teamSize || '\u00A0'}</div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 mb-3 min-w-0">
          <MapPin size={11} className="text-[#4A1525]/40 flex-shrink-0" />
          <span className="text-xs text-[#4A1525]/60 truncate">{comp.location || '\u00A0'}</span>
        </div>

        {/* Description (expandable) */}
        {comp.description && (
          <div className="mb-3">
            <p className={`text-xs text-[#4A1525]/60 leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
              {comp.description}
            </p>
            {comp.description.length > 100 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-[11px] font-semibold mt-1"
                style={{ color: "#B48C3C" }}
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(comp.tags || []).map(tag => (
            <span key={tag} className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#4A1525]/5 text-[#4A1525]/60 max-w-full truncate">
              <Tag size={8} className="flex-shrink-0" /> <span className="truncate">{tag}</span>
            </span>
          ))}
        </div>

        {/* CTA */}
        {comp.url && (
          <a
            href={comp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98]"
            style={{ background: "#4A1525", color: "white" }}
          >
            Apply Now <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}  
