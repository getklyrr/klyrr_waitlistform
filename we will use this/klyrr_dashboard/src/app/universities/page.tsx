"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useKlyrr, MOCK_UNIVERSITIES, University } from "@/context/KlyrrContext";
import {
  Search, Filter, BookmarkPlus, BookmarkCheck, ArrowRight,
  MapPin, TrendingUp, DollarSign, Clock, Sparkles, ChevronLeft
} from "lucide-react";

function computeMatchScore(uni: University, profile: typeof MOCK_UNIVERSITIES[0] & { major: string; financialPlan: string; targetCountries: string[] }): number {
  let score = 50;
  if (profile.targetCountries?.includes(uni.country)) score += 20;
  if (uni.programs.some((p) => p.toLowerCase().includes((profile.major || "").toLowerCase().split(" ")[0].toLowerCase()))) score += 15;
  if (profile.financialPlan === "full_aid" && uni.fullAidAvailable) score += 15;
  else if (profile.financialPlan === "partial_aid" && uni.financialAidAvailable) score += 10;
  else if (profile.financialPlan === "self_funded") score += 5;
  if (uni.acceptanceRate > 50) score += 5;
  else if (uni.acceptanceRate < 20) score -= 5;
  return Math.min(99, Math.max(40, score));
}

const TYPE_COLORS: Record<string, string> = {
  Reach: "bg-red-50 text-red-700 border-red-200",
  Target: "bg-amber-50 text-amber-700 border-amber-200",
  Safety: "bg-green-50 text-green-700 border-green-200",
};

const COUNTRY_FLAGS: Record<string, string> = {
  Canada: "🍁", UK: "🇬🇧", Germany: "🇩🇪", Australia: "🦘",
  Singapore: "🇸🇬", Netherlands: "🌷", Ireland: "☘️", USA: "🇺🇸",
};

export default function UniversitiesPage() {
  const router = useRouter();
  const { profile, shortlistedUniversities, addToShortlist, removeFromShortlist } = useKlyrr();
  const [search, setSearch] = useState("");
  const [filterCountry, setFilterCountry] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterAid, setFilterAid] = useState(false);

  const scoredUniversities = useMemo(() =>
    MOCK_UNIVERSITIES.map((u) => ({
      ...u,
      matchScore: computeMatchScore(u, profile as any),
    })).sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0)),
    [profile]
  );

  const filtered = useMemo(() =>
    scoredUniversities.filter((u) => {
      const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.city.toLowerCase().includes(search.toLowerCase());
      const matchesCountry = filterCountry === "All" || u.country === filterCountry;
      const matchesType = filterType === "All" || u.type === filterType;
      const matchesAid = !filterAid || u.financialAidAvailable;
      return matchesSearch && matchesCountry && matchesType && matchesAid;
    }),
    [scoredUniversities, search, filterCountry, filterType, filterAid]
  );

  const countries = ["All", ...Array.from(new Set(MOCK_UNIVERSITIES.map((u) => u.country)))];
  const isShortlisted = (id: string) => shortlistedUniversities.some((u) => u.id === id);

  const toggleShortlist = (uni: University) => {
    if (isShortlisted(uni.id)) removeFromShortlist(uni.id);
    else addToShortlist(uni);
  };

  return (
    <div className="min-h-screen bg-cream font-sans">
      {/* Header */}
      <div className="bg-burgundy px-5 pt-6 pb-5 sticky top-0 z-30">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => router.push("/onboarding")} className="text-white/60 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-gold" />
              <span className="text-gold text-xs font-bold uppercase tracking-widest">KLYRR</span>
            </div>
            <h1 className="text-white font-bold text-lg leading-tight font-serif">
              University Discovery
            </h1>
          </div>
          {profile.major && (
            <span className="ml-auto bg-gold/20 text-gold text-xs px-2 py-1 rounded-full">
              {profile.major}
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search universities or cities..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-gold transition-colors"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide bg-cream border-b border-warm-beige">
        {countries.map((c) => (
          <button
            key={c}
            onClick={() => setFilterCountry(c)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition-all shrink-0 ${
              filterCountry === c
                ? "bg-burgundy text-white border-burgundy"
                : "bg-white text-burgundy border-warm-beige hover:border-burgundy/30"
            }`}
          >
            {c !== "All" && COUNTRY_FLAGS[c]} {c}
          </button>
        ))}
        {["All", "Reach", "Target", "Safety"].map((t) => (
          t !== "All" && (
            <button
              key={t}
              onClick={() => setFilterType(filterType === t ? "All" : t)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition-all shrink-0 ${
                filterType === t
                  ? "bg-burgundy text-white border-burgundy"
                  : "bg-white text-burgundy border-warm-beige hover:border-burgundy/30"
              }`}
            >
              {t}
            </button>
          )
        ))}
        <button
          onClick={() => setFilterAid(!filterAid)}
          className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition-all shrink-0 ${
            filterAid ? "bg-gold text-white border-gold" : "bg-white text-burgundy border-warm-beige hover:border-burgundy/30"
          }`}
        >
          <DollarSign size={10} className="inline" /> Aid Available
        </button>
      </div>

      {/* Results Count */}
      <div className="px-5 py-2.5 flex items-center justify-between">
        <span className="text-xs text-burgundy/60">{filtered.length} universities found</span>
        {shortlistedUniversities.length > 0 && (
          <span className="text-xs text-gold font-semibold">{shortlistedUniversities.length} shortlisted</span>
        )}
      </div>

      {/* University Cards */}
      <div className="px-4 pb-32 flex flex-col gap-3">
        {filtered.map((uni) => {
          const shortlisted = isShortlisted(uni.id);
          // Calculate Match Score Ring styling cleanly
          const score = uni.matchScore ?? 0;
          const ringColor = score >= 80 ? "border-gold bg-gold/15" : score >= 65 ? "border-burgundy bg-transparent" : "border-warm-beige bg-transparent";

          return (
            <div
              key={uni.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                shortlisted ? "border-burgundy shadow-md" : "border-warm-beige"
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-cream rounded-xl flex items-center justify-center text-2xl shrink-0">
                      {uni.logo}
                    </div>
                    <div>
                      <h3 className="text-burgundy font-bold text-sm leading-tight font-serif">
                        {uni.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin size={10} className="text-burgundy/40" />
                        <span className="text-xs text-burgundy/50">{uni.city}, {uni.country}</span>
                      </div>
                    </div>
                  </div>

                  {/* Match Score */}
                  <div className="shrink-0 text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${ringColor}`}>
                      <span className="text-sm font-bold text-burgundy">{score}%</span>
                    </div>
                    <span className="text-[9px] text-burgundy/40 mt-0.5 block uppercase tracking-wider">match</span>
                  </div>
                </div>

                <p className="text-xs text-burgundy/60 mb-3 leading-relaxed">{uni.description}</p>

                {/* Stats Row */}
                <div className="flex gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    <TrendingUp size={11} className="text-burgundy/40" />
                    <span className="text-xs text-burgundy/70">{uni.acceptanceRate}% accept</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign size={11} className="text-burgundy/40" />
                    <span className="text-xs text-burgundy/70">
                      {uni.tuitionUSD < 2000 ? "Near-free" : `$${(uni.tuitionUSD / 1000).toFixed(0)}k/yr`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={11} className="text-burgundy/40" />
                    <span className="text-xs text-burgundy/70">{uni.deadline}</span>
                  </div>
                </div>

                {/* Tags Row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${TYPE_COLORS[uni.type]}`}>
                    {uni.type}
                  </span>
                  {uni.fullAidAvailable && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">
                      Full Aid
                    </span>
                  )}
                  {uni.programs.slice(0, 2).map((p) => (
                    <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-cream text-burgundy/60 border border-warm-beige">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Bar */}
              <div className="border-t border-warm-beige flex">
                <button
                  onClick={() => toggleShortlist(uni)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-all ${
                    shortlisted
                      ? "bg-burgundy text-white"
                      : "text-burgundy hover:bg-cream"
                  }`}
                >
                  {shortlisted ? (
                    <><BookmarkCheck size={14} /> Shortlisted</>
                  ) : (
                    <><BookmarkPlus size={14} /> Add to Shortlist</>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating CTA */}
      {shortlistedUniversities.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-40">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-burgundy text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-2xl active:scale-[0.98] transition-transform font-serif"
          >
            <span>Continue to Dashboard</span>
            <span className="bg-gold text-white text-xs px-2 py-0.5 rounded-full">{shortlistedUniversities.length}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}