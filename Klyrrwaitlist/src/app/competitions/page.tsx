"use client";

import { useEffect, useMemo, useState } from "react";

type Competition = {
  id: string;
  name: string;
  organizer: string;
  category: string;
  deadline: string;
  eventDate: string;
  prize: string;
  level: string;
  mode: string;
  teamSize: string;
  location: string;
  description: string;
  tags: string[];
  global: boolean;
  featured: boolean;
  url: string;
};

const CATEGORY_ICONS: Record<string, string> = {
  Coding: "fa-code",
  Design: "fa-palette",
  Science: "fa-flask",
  Business: "fa-briefcase",
  Arts: "fa-music",
  General: "fa-star",
};

const LEVEL_PILL_CLASS: Record<string, string> = {
  Advanced: "advanced",
  Beginner: "coding",
  Intermediate: "hybrid",
};

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    fetch("/api/competitions")
      .then((res) => res.json())
      .then((data) => setCompetitions(data.items || []))
      .finally(() => setLoading(false));
  }, []);

  const filters = ["All", "Coding", "Design", "Science", "Business", "Arts", "General"];

  const filtered = useMemo(() => {
    return competitions.filter((c) => {
      const matchesFilter = activeFilter === "All" || c.category === activeFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        q.length === 0 ||
        c.name?.toLowerCase().includes(q) ||
        c.organizer?.toLowerCase().includes(q) ||
        c.tags?.some((t) => t.toLowerCase().includes(q));
      return matchesFilter && matchesSearch;
    });
  }, [competitions, search, activeFilter]);

  return (
    <div className="klyrr-comp-page">
      <style>{PAGE_CSS}</style>

      <header className="dashboard-header">
        <div className="header-container">
          <div className="breadcrumbs-wrapper">
            <div className="breadcrumbs">
              <span>
                <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: 10 }} /> Klyrr
              </span>
              <span>&times;</span>
              <span className="active">Opportunities</span>
            </div>
            <a href="/" className="btn-back">
              <i className="fa-solid fa-chevron-left" /> Back
            </a>
          </div>

          <h2 className="page-title">Competitions &amp; Hackathons</h2>
          <p className="page-subtitle">
            {loading ? "Loading\u2026" : `${filtered.length} opportunities`} &middot; Local &amp; Global
          </p>

          <div className="search-wrapper">
            <i className="fa-solid fa-magnifying-glass search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search competitions, skills, or organizers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-tags-row">
            {filters.map((f) => (
              <button
                key={f}
                className={`filter-btn ${activeFilter === f ? "active" : ""}`}
                onClick={() => setActiveFilter(f)}
              >
                <i className={`fa-solid ${f === "All" ? "fa-grip" : CATEGORY_ICONS[f] || "fa-star"}`} /> {f}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="content-container">
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
            No competitions match yet. Check back soon.
          </div>
        )}

        {filtered.map((comp) => (
          <div className="opportunity-card" key={comp.id}>
            {comp.featured && (
              <div className="featured-header">
                <i className="fa-solid fa-thumbtack" /> Featured
              </div>
            )}
            <div className="card-body">
              <div className="card-top-flex">
                <div>
                  <h3 className="opportunity-title">
                    {comp.global && <i className="fa-solid fa-globe" style={{ fontSize: 12, marginRight: 6, color: "var(--gold)" }} />}
                    {comp.name}
                  </h3>
                  <p className="company-name">{comp.organizer}</p>
                </div>
                <button className="bookmark-btn" aria-label="Bookmark">
                  <i className="fa-regular fa-bookmark" />
                </button>
              </div>

              <div className="pill-tags-row">
                {comp.level && (
                  <span className={`pill-tag ${LEVEL_PILL_CLASS[comp.level] || "coding"}`}>{comp.level}</span>
                )}
                {comp.mode && <span className="pill-tag hybrid">{comp.mode}</span>}
                {comp.category && <span className="pill-tag coding">{comp.category}</span>}
              </div>

              <div className="details-grid">
                <div className="detail-item">
                  <i className="fa-regular fa-clock detail-icon" />
                  <div>
                    <div className="detail-label">Deadline</div>
                    <div className="detail-value">{comp.deadline || "\u2014"}</div>
                  </div>
                </div>
                <div className="detail-item">
                  <i className="fa-regular fa-calendar detail-icon" />
                  <div>
                    <div className="detail-label">Event</div>
                    <div className="detail-value">{comp.eventDate || "\u2014"}</div>
                  </div>
                </div>
                <div className="detail-item">
                  <i className="fa-solid fa-trophy detail-icon" />
                  <div>
                    <div className="detail-label">Prize</div>
                    <div className="detail-value">{comp.prize || "\u2014"}</div>
                  </div>
                </div>
                <div className="detail-item">
                  <i className="fa-solid fa-users detail-icon" />
                  <div>
                    <div className="detail-label">Team</div>
                    <div className="detail-value">{comp.teamSize || "\u2014"}</div>
                  </div>
                </div>
              </div>

              {comp.location && (
                <div className="location-row">
                  <i className="fa-solid fa-location-dot" /> {comp.location}
                </div>
              )}

              {comp.description && <p className="card-description">{comp.description}</p>}

              {comp.tags?.length > 0 && (
                <div className="bottom-meta-tags">
                  {comp.tags.map((tag) => (
                    <span className="meta-tag" key={tag}>
                      <i className="fa-solid fa-tag" /> {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {comp.url && (
              <div className="card-action-bar">
                <a href={comp.url} target="_blank" rel="noopener noreferrer" className="card-apply-btn">
                  Apply Now <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: 11 }} />
                </a>
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}

const PAGE_CSS = `
.klyrr-comp-page {
  --bg-light: #F9F6F0;
  --maroon-dark: #3F1522;
  --maroon-header: #4A1525;
  --gold: #C09E53;
  --text-dark: #3F1522;
  --text-muted: #7E6E65;
  --border-color: #E6E1DA;
  --tag-advanced-bg: #FFE5E5; --tag-advanced-text: #FF5C5C;
  --tag-hybrid-bg: #EAE5FF; --tag-hybrid-text: #7C5CFF;
  --tag-coding-bg: #F5EFE6; --tag-coding-text: #8A7E72;
  font-family: 'Plus Jakarta Sans', sans-serif;
  background-color: var(--bg-light);
  color: var(--text-dark);
  min-height: 100vh;
}
.dashboard-header { background-color: var(--maroon-header); color: #FFFFFF; padding: 40px 40px 30px 40px; }
.header-container { max-width: 1400px; margin: 0 auto; }
.breadcrumbs-wrapper { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.breadcrumbs { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.4); }
.breadcrumbs .active { color: var(--gold); }
.btn-back { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #FFFFFF; padding: 6px 14px; border-radius: 8px; font-family: inherit; font-size: 12px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; }
.page-title { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; margin-bottom: 4px; }
.page-subtitle { font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 24px; }
.search-wrapper { position: relative; margin-bottom: 20px; }
.search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.4); font-size: 14px; }
.search-input { width: 100%; background-color: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 16px 14px 44px; color: #FFFFFF; font-family: inherit; font-size: 14px; outline: none; box-sizing: border-box; }
.search-input::placeholder { color: rgba(255,255,255,0.35); }
.filter-tags-row { display: flex; flex-wrap: wrap; gap: 8px; }
.filter-btn { display: inline-flex; align-items: center; gap: 6px; background-color: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.filter-btn.active { background-color: var(--gold); border-color: var(--gold); color: var(--maroon-dark); font-weight: 700; }
.content-container { max-width: 1400px; margin: 24px auto; padding: 0 20px; }
.opportunity-card { background-color: #FFFFFF; border-radius: 16px; border: 1px solid var(--border-color); margin-bottom: 24px; overflow: hidden; position: relative; }
.featured-header { background-color: var(--maroon-dark); color: var(--gold); font-size: 10px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; padding: 8px 20px; display: flex; align-items: center; gap: 6px; }
.card-body { padding: 24px 24px 16px 24px; position: relative; }
.card-top-flex { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.company-name { font-size: 13px; color: var(--text-muted); margin-top: 4px; margin-bottom: 12px; }
.opportunity-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: var(--maroon-dark); }
.bookmark-btn { background: none; border: 1px solid var(--border-color); border-radius: 8px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-dark); font-size: 13px; flex-shrink: 0; }
.pill-tags-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.pill-tag { font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 20px; }
.pill-tag.advanced { background-color: var(--tag-advanced-bg); color: var(--tag-advanced-text); }
.pill-tag.hybrid { background-color: var(--tag-hybrid-bg); color: var(--tag-hybrid-text); }
.pill-tag.coding { background-color: var(--tag-coding-bg); color: var(--tag-coding-text); }
.details-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 24px; }
.detail-item { display: flex; align-items: flex-start; gap: 12px; }
.detail-icon { color: var(--text-muted); font-size: 14px; margin-top: 2px; }
.detail-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(63,21,34,0.4); margin-bottom: 2px; }
.detail-value { font-size: 14px; font-weight: 700; color: var(--maroon-dark); }
.location-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #A08E84; margin-bottom: 16px; }
.card-description { font-size: 13px; color: var(--text-muted); line-height: 1.6; margin-bottom: 16px; }
.bottom-meta-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
.meta-tag { display: inline-flex; align-items: center; gap: 4px; background-color: #F3EFF6; color: #8A7E8C; font-size: 11px; padding: 4px 10px; border-radius: 6px; }
.card-action-bar { padding: 0 16px 16px 16px; }
.card-apply-btn { display: flex; align-items: center; justify-content: center; gap: 8px; background-color: var(--maroon-dark); color: #FFFFFF; width: 100%; padding: 14px; border-radius: 12px; font-size: 14px; font-weight: 700; text-decoration: none; border: none; cursor: pointer; box-sizing: border-box; }
@media(max-width: 768px) {
  .dashboard-header { padding: 24px 20px; }
  .details-grid { grid-template-columns: 1fr; gap: 16px; }
}
`;
