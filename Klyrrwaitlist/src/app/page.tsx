import { MongoClient } from "mongodb";

// ── Inline Vector Asset Pipeline (Zero External Package Dependency) ───────────
const GlobeIcon = () => (
  <svg className="flex-shrink-0 text-[#B48C3C]" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const AwardIcon = () => (
  <svg className="flex-shrink-0" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#B48C3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
);
const BookmarkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A1525" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
);
const ClockIcon = () => (
  <svg className="text-[#4A1525]/40 flex-shrink-0" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const CalendarIcon = () => (
  <svg className="text-[#4A1525]/40 flex-shrink-0" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);
const TrophyIcon = () => (
  <svg className="text-[#B48C3C] flex-shrink-0" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"/><path d="M12 2a6 6 0 0 1 6 6v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z"/></svg>
);
const UsersIcon = () => (
  <svg className="text-[#4A1525]/40 flex-shrink-0" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const MapPinIcon = () => (
  <svg className="text-[#4A1525]/40 flex-shrink-0" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
);
const TagIcon = () => (
  <svg className="flex-shrink-0" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
);
const ExternalLinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
);

// ── Strict Color Badging Configurations ──────────────────────────────────────
const LEVEL_COLORS: Record<string, string> = {
  Global: "bg-purple-50 text-purple-700 border-purple-200",
  National: "bg-blue-50 text-blue-700 border-blue-200",
  Regional: "bg-green-50 text-green-700 border-green-200",
};

const MODE_COLORS: Record<string, string> = {
  Online: "bg-cyan-50 text-cyan-700 border-cyan-200",
  "In-Person": "bg-amber-50 text-amber-700 border-amber-200",
  Hybrid: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

// ── Database Layer ────────────────────────────────────────────────────────────
async function fetchHackathons() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return [];
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("hackathon_platform");
    const rawData = await db.collection("listings").find({}).toArray();
    
    // Strict, safe mapping with zero compromise on fallbacks if data is missing
    return rawData.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name || doc.title || "",
      organizer: doc.organizer || "",
      category: doc.category || "",
      deadline: doc.deadline || "",
      eventDate: doc.eventDate || doc.date || "",
      prize: doc.prize || doc.prize_pool || "",
      level: doc.level || "",
      mode: doc.mode || "",
      teamSize: doc.teamSize || "",
      location: doc.location || "",
      description: doc.description || "",
      tags: Array.isArray(doc.tags) ? doc.tags : [],
      global: doc.global === true || String(doc.level).toLowerCase() === "global",
      featured: doc.featured === true,
      url: doc.url || doc.link || "",
    }));
  } catch (error) {
    console.error("Database error:", error);
    return [];
  } finally {
    await client.close();
  }
}

// ── Main Page Template ────────────────────────────────────────────────────────
export default async function HackathonsPage() {
  const hackathons = await fetchHackathons();

  return (
    <main className="w-full min-h-screen bg-[#fbf5ee] px-4 py-8 md:px-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Top branding layout */}
        <div className="mb-10 md:mb-14 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#6b1a2a]/30 px-4 py-1.5 mb-4 bg-white/50">
            <span className="w-2 h-2 rounded-full bg-[#c9993a] inline-block" />
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#6b1a2a] font-medium font-sans">
              Live Database Feed
            </span>
          </div>
          <h1 className="text-[#6b1a2a] text-4xl sm:text-6xl font-bold mb-4 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Active Teen <span className="text-[#c9993a] italic">Hackathons</span>
          </h1>
          <p className="text-[#6b1a2a]/70 text-base sm:text-lg max-w-xl font-sans">
            Hand-picked competitions and production-ready hackathons for builders aged 13–18.
          </p>
        </div>

        {/* Competitions Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
          {hackathons.map((comp) => (
            <div 
              key={comp.id} 
              className={`bg-white rounded-2xl border overflow-hidden transition-all flex flex-col justify-between shadow-sm h-full ${
                comp.featured ? "border-[#B48C3C]/40 shadow-md" : "border-[#E8DCC4]"
              }`}
            >
              <div>
                {/* Featured Header Badge Bar */}
                {comp.featured && (
                  <div className="px-4 py-1.5 flex items-center gap-1.5" style={{ background: "linear-gradient(90deg, #4A1525, #6b1a35)" }}>
                    <AwardIcon />
                    <span className="text-[10px] font-bold text-[#B48C3C] uppercase tracking-widest truncate">Featured</span>
                  </div>
                )}

                <div className="p-4">
                  {/* Title & Action Container */}
                  <div className="flex items-start justify-between gap-3 mb-3 w-full">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 w-full">
                        {comp.global && <GlobeIcon />}
                        <h3 className="text-[#4A1525] font-bold text-sm leading-tight truncate flex-1 min-w-0" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {comp.name || '\u00A0'}
                        </h3>
                      </div>
                      <p className="text-xs text-[#4A1525]/50 truncate w-full">{comp.organizer || '\u00A0'}</p>
                    </div>
                    <button className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border border-[#E8DCC4] bg-transparent">
                      <BookmarkIcon />
                    </button>
                  </div>

                  {/* Flexible Dynamic Badges Row */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {comp.level && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${LEVEL_COLORS[comp.level] || "border-[#E8DCC4]"}`}>
                        {comp.level}
                      </span>
                    )}
                    {comp.mode && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${MODE_COLORS[comp.mode] || "border-[#E8DCC4]"}`}>
                        {comp.mode}
                      </span>
                    )}
                    {comp.category && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full border bg-[#F9F6F0] text-[#4A1525]/60 border-[#E8DCC4]">
                        {comp.category}
                      </span>
                    )}
                  </div>

                  {/* Grid Informational Matrix (Guaranteed Not To Overlap on Mobile) */}
                  <div className="grid grid-cols-2 gap-2 mb-3 w-full">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <ClockIcon />
                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] text-[#4A1525]/40 uppercase tracking-wide">Deadline</div>
                        <div className="text-xs font-semibold text-[#4A1525] truncate">{comp.deadline || '\u00A0'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <CalendarIcon />
                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] text-[#4A1525]/40 uppercase tracking-wide">Event</div>
                        <div className="text-xs font-semibold text-[#4A1525] truncate">{comp.eventDate || '\u00A0'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <TrophyIcon />
                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] text-[#4A1525]/40 uppercase tracking-wide">Prize</div>
                        <div className="text-xs font-semibold text-[#4A1525] truncate">{comp.prize || '\u00A0'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <UsersIcon />
                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] text-[#4A1525]/40 uppercase tracking-wide">Team</div>
                        <div className="text-xs font-semibold text-[#4A1525] truncate">{comp.teamSize || '\u00A0'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Location Area */}
                  <div className="flex items-center gap-1.5 mb-3 min-w-0">
                    <MapPinIcon />
                    <span className="text-xs text-[#4A1525]/60 truncate">{comp.location || '\u00A0'}</span>
                  </div>

                  {/* Description Box */}
                  {comp.description && (
                    <div className="mb-3">
                      <p className="text-xs text-[#4A1525]/60 leading-relaxed line-clamp-3">
                        {comp.description}
                      </p>
                    </div>
                  )}

                  {/* Filterable Tag Row */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {comp.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#4A1525]/5 text-[#4A1525]/60 max-w-full truncate">
                        <TagIcon /> <span className="truncate">{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Call To Action Anchor Container */}
              <div className="p-4 pt-0 w-full">
                {comp.url ? (
                  <a
                    href={comp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98]"
                    style={{ background: "#4A1525", color: "white" }}
                  >
                    Apply Now <ExternalLinkIcon />
                  </a>
                ) : (
                  <div className="w-full h-10" />
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
