"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  Search, Trophy, Calendar, Globe, Bookmark, ExternalLink, ShieldCheck, Layers 
} from "lucide-react";
import BottomNav from "../components/BottomNav";

interface Competition {
  id: string;
  title: string;
  organizer: string;
  category: string;
  deadline: string;
  prizePool: string;
  scope: "Global" | "National" | "Regional";
  tier: "Tier 1" | "Tier 2" | "Tier 3";
  description: string;
  url: string;
}

const MOCK_COMPETITIONS: Competition[] = [
  {
    id: "c1",
    title: "Regeneron Science Talent Search (STS)",
    organizer: "Society for Science",
    category: "STEM",
    deadline: "Nov 12, 2025",
    prizePool: "$1,200,000",
    scope: "National",
    tier: "Tier 1",
    description: "The nation's oldest and most prestigious science and math competition for high school seniors.",
    url: "https://www.societyforscience.org/regeneron-sts/"
  },
  {
    id: "c2",
    title: "Conrad Challenge",
    organizer: "Conrad Foundation",
    category: "Entrepreneurship",
    deadline: "Nov 21, 2025",
    prizePool: "Scholarships & Grants",
    scope: "Global",
    tier: "Tier 1",
    description: "An annual, multi-phase innovation and entrepreneurship competition for students aged 13-18.",
    url: "https://www.conradchallenge.org/"
  },
  {
    id: "c3",
    title: "Harvard Crimson Global Essay Competition",
    organizer: "Harvard Crimson",
    category: "Writing",
    deadline: "Jan 30, 2026",
    prizePool: "$5,000 + Internships",
    scope: "Global",
    tier: "Tier 2",
    description: "A prestigious global stage for high school students to showcase their critical thinking and writing skills.",
    url: "https://www.essaycomp.org/"
  },
  {
    id: "c4",
    title: "MIT THINK Scholars Program",
    organizer: "Massachusetts Institute of Technology",
    category: "STEM",
    deadline: "Jan 1, 2026",
    prizePool: "$1,000 Funding + Mentorship",
    scope: "National",
    tier: "Tier 1",
    description: "An initiative promoting STEM research and innovation by supporting student-developed project proposals.",
    url: "https://think.mit.edu/"
  },
  {
    id: "c5",
    title: "Wharton Global High School Investment Competition",
    organizer: "Wharton School, UPenn",
    category: "Business",
    deadline: "Sep 15, 2025",
    prizePool: "Global Recognition",
    scope: "Global",
    tier: "Tier 1",
    description: "An online simulation challenging students to manage a $100,000 virtual portfolio for a designated client.",
    url: "https://globalyouth.wharton.upenn.edu/"
  }
];

const CATEGORIES = ["All", "STEM", "Business", "Entrepreneurship", "Writing"];

export default function CompetitionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const toggleSave = (id: string) => {
    setSavedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredCompetitions = MOCK_COMPETITIONS.filter(comp => {
    const matchesSearch = comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          comp.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || comp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#4A1525] pb-24">
      {/* Top Sticky Filter Header View */}
      <div className="pt-12 px-6 pb-6 bg-white border-b border-[#E8DCC4] sticky top-0 z-10">
        <h1 className="text-2xl font-serif font-bold">Prestigious Competitions</h1>
        <p className="text-sm text-[#4A1525]/60 mt-1">Discover elite opportunities vetted for top-tier university profiles.</p>
        
        {/* Search Pipeline */}
        <div className="mt-5 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A1525]/40" size={18} />
          <input
            type="text"
            placeholder="Search competitions, organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F9F6F0]/50 border border-[#E8DCC4] rounded-xl text-sm focus:outline-none focus:border-[#4A1525] transition-all"
          />
        </div>

        {/* Dynamic Category Badges Filter Bar */}
        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-[#4A1525] text-white shadow-sm"
                  : "bg-[#F9F6F0] text-[#4A1525]/70 border border-[#E8DCC4] hover:bg-[#E8DCC4]/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Container Content */}
      <div className="p-6 space-y-4 max-w-2xl mx-auto">
        {filteredCompetitions.length > 0 ? (
          filteredCompetitions.map((comp) => (
            <div key={comp.id} className="bg-white border border-[#E8DCC4] rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all hover:shadow-md">
              
              {/* Context Detail Matrix Elements */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-2.5 w-full">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#4A1525]/5 text-[#4A1525]/80 border border-[#4A1525]/10">
                        {comp.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border ${
                        comp.tier === "Tier 1" 
                          ? "bg-amber-50 text-amber-700 border-amber-200" 
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
                        <ShieldCheck size={10} /> {comp.tier}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#4A1525] break-words leading-tight">
                      {comp.title || '\u00A0'}
                    </h3>
                    <p className="text-xs text-[#4A1525]/50 truncate mt-0.5">{comp.organizer || '\u00A0'}</p>
                  </div>
                  
                  <button 
                    onClick={() => toggleSave(comp.id)}
                    className="flex-shrink-0 p-2 rounded-xl border border-[#E8DCC4] bg-white transition-colors hover:bg-[#F9F6F0]"
                  >
                    <Bookmark 
                      size={16} 
                      className={savedIds.includes(comp.id) ? "fill-[#B48C3C] stroke-[#B48C3C]" : "text-[#4A1525]/60"} 
                    />
                  </button>
                </div>

                {/* Subtitle Description */}
                <p className="text-xs text-[#4A1525]/70 leading-relaxed mb-4 line-clamp-3">
                  {comp.description}
                </p>

                {/* Compact Info Badges Grid layout */}
                <div className="grid grid-cols-2 gap-2.5 border-t border-[#F9F6F0] pt-3.5 mb-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <Calendar size={14} className="text-[#4A1525]/40 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] text-[#4A1525]/40 uppercase tracking-wide">Deadline</div>
                      <div className="text-xs font-semibold text-[#4A1525] truncate">{comp.deadline || '\u00A0'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <Trophy size={14} className="text-[#B48C3C] flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] text-[#4A1525]/40 uppercase tracking-wide">Prize Pool</div>
                      <div className="text-xs font-semibold text-[#4A1525] truncate">{comp.prizePool || '\u00A0'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 min-w-0 col-span-2">
                    <Globe size={14} className="text-[#4A1525]/40 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] text-[#4A1525]/40 uppercase tracking-wide">Competition Scope</div>
                      <div className="text-xs font-semibold text-[#4A1525] truncate">{comp.scope || '\u00A0'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Redirection CTA */}
              <div className="w-full pt-1">
                <a
                  href={comp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#4A1525] hover:bg-[#5C1B2E] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Official Guidelines <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#E8DCC4] p-6">
            <Layers className="mx-auto text-[#4A1525]/20 mb-2" size={32} />
            <p className="text-sm font-medium text-[#4A1525]/70">No competitions found matching your parameters.</p>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
              className="mt-3 text-xs font-bold text-[#B48C3C] underline underline-offset-4"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Persistent App Navigation Drawer Component */}
      <BottomNav />
    </div>
  );
}
