'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// --- LOCAL DATABASE HELPER ---
const DB_KEY = 'klyrr_competitions';
function getDB(): any[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    const seed = [
      { id: 1, status: 'approved', featured: true, title: 'Flipkart GRiD 6.0', organizer: 'Flipkart', tags: ['advanced', 'hybrid', 'coding'], deadline: 'Jun 30, 2025', timeline: 'Aug–Sep 2025', prize: '₹5,00,000 + PPO offers', teamSize: '2–3 members', location: 'Bangalore (Finals)', description: 'E-commerce and technology challenge by Flipkart. Shortlisted teams get pre-placement interview opportunities.', applyUrl: '#', metaTags: ['E-commerce', 'PPO'] },
      { id: 2, status: 'approved', featured: true, title: 'NASA Space Apps Challenge', organizer: 'NASA', tags: ['open', 'hybrid', 'science'], deadline: 'Oct 4, 2025', timeline: 'Oct 2025', prize: 'Global Recognition', teamSize: 'Up to 5', location: 'Global', description: "NASA's flagship international hackathon tackling real-world challenges on Earth and in space.", applyUrl: '#', metaTags: ['Space', 'Global'] }
    ];
    localStorage.setItem(DB_KEY, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(data);
}
function saveDB(data: any[]) { if (typeof window !== 'undefined') localStorage.setItem(DB_KEY, JSON.stringify(data)); }

// --- LOCAL PARSER ---
function localParser(text: string) {
  const r: any = { title: '', organizer: '', deadline: '', prize: '', location: '', applyUrl: '', description: '', tags: [], timeline: '', teamSize: '' };
  const urlM = text.match(/https?:\/\/[^\s<>"{}|\\^`\]]+/); if (urlM) r.applyUrl = urlM[0];
  const boldM = text.match(/\*([^*]+)\*/); if (boldM) r.title = boldM[1].replace(/[🔥💰📅📍🔗💻🏆⚡🎯📋🚀]/g, '').trim();
  const prizeM = text.match(/[💰🏆].*?[:\-]\s*(.+?)[\n|$]/i) || text.match(/prize[:\-]\s*(.+?)[\n|$]/i); if (prizeM) r.prize = prizeM[1].trim();
  const dateM = text.match(/(\d{1,2})\s*(st|nd|rd|th)?\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[,]?\s*(\d{4})/i);
  if (dateM) r.deadline = dateM[3].charAt(0).toUpperCase() + dateM[3].slice(1,3) + ' ' + dateM[1] + ', ' + dateM[4];
  const locM = text.match(/[📍].*?[:\-]\s*(.+?)[\n|$]/i); if (locM) r.location = locM[1].trim();
  const lower = text.toLowerCase();
  if (lower.match(/cod|programm|hackathon/)) r.tags.push('coding');
  if (lower.match(/design|ui|ux/)) r.tags.push('design');
  if (lower.match(/science|nasa|space/)) r.tags.push('science');
  if (lower.match(/business|startup/)) r.tags.push('business');
  if (lower.match(/online|virtual/)) r.tags.push('online');
  if (lower.match(/hybrid/)) r.tags.push('hybrid');
  if (lower.match(/advanced/)) r.tags.push('advanced');
  if (lower.match(/beginner|open/)) r.tags.push('beginner');
  if (r.tags.length === 0) r.tags = ['coding', 'open'];
  if (!r.title) r.title = 'Untitled Competition';
  r.description = r.title + (r.prize ? ` — Prize: ${r.prize}.` : '');
  return r;
}

export default function Hackathons() {
  const [db, setDb] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [password, setPassword] = useState('');
  
  // Extracted form state
  const [whatsappInput, setWhatsappInput] = useState('');
  const [exData, setExData] = useState<any>(null);
  const [adminTab, setAdminTab] = useState('paste');

  useEffect(() => { setDb(getDB()); }, []);

  const approved = db.filter(c => c.status === 'approved');
  let filtered = filter === 'all' ? approved : approved.filter(c => c.tags.includes(filter));
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(c => c.title.toLowerCase().includes(q) || c.organizer.toLowerCase().includes(q) || c.tags.some((t: string) => t.includes(q)));
  }
  filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  const handleExtract = () => {
    if (!whatsappInput.trim()) return alert('Paste a message first!');
    const extracted = localParser(whatsappInput);
    setExData(extracted);
  };

  const handleAddToQueue = () => {
    const newItem = { id: Date.now(), status: 'pending', featured: exData.featured || false, title: exData.title, organizer: exData.organizer, tags: exData.tags, deadline: exData.deadline, timeline: exData.timeline, prize: exData.prize, teamSize: exData.teamSize, location: exData.location, applyUrl: exData.applyUrl, description: exData.description, metaTags: [] };
    const newDb = [...db, newItem];
    saveDB(newDb); setDb(newDb); setWhatsappInput(''); setExData(null); alert('Added to review queue!');
  };

  const handleApprove = (id: number) => {
    const newDb = db.map(c => c.id === id ? { ...c, status: 'approved' } : c);
    saveDB(newDb); setDb(newDb);
  };

  const handleReject = (id: number) => {
    const newDb = db.filter(c => c.id !== id);
    saveDB(newDb); setDb(newDb);
  };

  const tagStyles: any = { coding: { bg: '#F5EFE6', color: '#8A7E72' }, advanced: { bg: '#FFE5E5', color: '#FF5C5C' }, hybrid: { bg: '#EAE5FF', color: '#7C5CFF' }, open: { bg: '#E2F5EA', color: '#27AE60' }, science: { bg: '#F5EFE6', color: '#8A7E72' }, design: { bg: '#FFF5E5', color: '#D4850A' }, business: { bg: '#E5F0FF', color: '#1B6BFF' }, beginner: { bg: '#E8F5E9', color: '#2E7D32' }, online: { bg: '#E5F9FF', color: '#00A5C8' } };

  return (
    <div style={{ background: '#F9F6F0', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#3F1522' }}>
      {/* HEADER */}
      <header style={{ backgroundColor: '#4A1525', color: '#FFF', padding: '40px 40px 30px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
              <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>✨ Klyrr</Link>
              <span>×</span>
              <span style={{ color: '#C09E53' }}>Opportunities</span>
            </div>
            <Link href="/" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>← Back</Link>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, marginBottom: 4 }}>Competitions & Hackathons</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>{filtered.length} opportunities · Local & Global</p>
          
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }}>🔍</span>
            <input type="text" placeholder="Search competitions, skills, or organizers..." value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 16px 14px 44px', color: '#FFF', fontSize: 14, outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['all', 'coding', 'design', 'science', 'business'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: filter === f ? '#C09E53' : 'rgba(255,255,255,0.06)', border: `1px solid ${filter === f ? '#C09E53' : 'rgba(255,255,255,0.1)'}`, color: filter === f ? '#3F1522' : 'rgba(255,255,255,0.8)', padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: filter === f ? 700 : 500, cursor: 'pointer' }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* CARDS */}
      <main style={{ maxWidth: 1400, margin: '24px auto', padding: '0 20px' }}>
        {filtered.map(c => (
          <div key={c.id} style={{ backgroundColor: '#FFF', borderRadius: 16, border: '1px solid #E6E1DA', marginBottom: 24, overflow: 'hidden' }}>
            {c.featured && <div style={{ backgroundColor: '#3F1522', color: '#C09E53', fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', padding: '8px 20px' }}>📌 Featured</div>}
            <div style={{ padding: '24px 24px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>{c.title}</h3>
                  <p style={{ fontSize: 13, color: '#7E6E65', marginTop: 4, marginBottom: 12 }}>{c.organizer}</p>
                </div>
                <button style={{ background: 'none', border: '1px solid #E6E1DA', borderRadius: 8, width: 36, height: 36, cursor: 'pointer', fontSize: 13 }}>🔖</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {c.tags.map((t: string) => <span key={t} style={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20, backgroundColor: tagStyles[t]?.bg || '#F3EFF6', color: tagStyles[t]?.color || '#8A7E8C' }}>{t.charAt(0).toUpperCase() + t.slice(1)}</span>)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 20, marginBottom: 24 }}>
                <div><div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(63,21,34,0.4)', marginBottom: 2 }}>Deadline</div><div style={{ fontSize: 14, fontWeight: 700 }}>{c.deadline || 'TBD'}</div></div>
                <div><div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(63,21,34,0.4)', marginBottom: 2 }}>Event</div><div style={{ fontSize: 14, fontWeight: 700 }}>{c.timeline || 'TBD'}</div></div>
                <div><div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(63,21,34,0.4)', marginBottom: 2 }}>Prize</div><div style={{ fontSize: 14, fontWeight: 700 }}>{c.prize || 'TBD'}</div></div>
                <div><div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(63,21,34,0.4)', marginBottom: 2 }}>Team</div><div style={{ fontSize: 14, fontWeight: 700 }}>{c.teamSize || 'TBD'}</div></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#A08E84', marginBottom: 16 }}>📍 {c.location || 'Online'}</div>
              <p style={{ fontSize: 13, color: '#7E6E65', lineHeight: 1.6, marginBottom: 8 }}>{c.description}</p>
            </div>
            <div style={{ padding: '0 16px 16px' }}>
              <a href={c.applyUrl || '#'} target="_blank" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#3F1522', color: '#FFF', width: '100%', padding: 14, borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                Apply Now ↗
              </a>
            </div>
          </div>
        ))}
      </main>

      {/* ADMIN TRIGGER */}
      <div style={{ textAlign: 'center', padding: '40px 20px', borderTop: '1px solid #E6E1DA' }}>
        <button onClick={() => setShowAdmin(true)} style={{ background: 'none', border: 'none', color: '#D0C8C0', cursor: 'pointer', fontSize: 14 }}>🔒</button>
      </div>

      {/* ADMIN MODAL */}
      {showAdmin && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#FFF', borderRadius: 16, width: '90%', maxWidth: 800, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ background: '#3F1522', color: '#FFF', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', borderRadius: '16px 16px 0 0' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20 }}>🛡️ Admin Panel</h2>
              <button onClick={() => setShowAdmin(false)} style={{ background: 'none', border: 'none', color: '#FFF', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: 24 }}>
              {!isAdmin ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <p style={{ marginBottom: 16, color: '#7E6E65' }}>Enter admin password to continue</p>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ border: '1px solid #E6E1DA', borderRadius: 8, padding: '10px 12px', fontSize: 14, outline: 'none', maxWidth: 300, width: '100%' }} />
                  <button onClick={() => password === 'klyrr2025' ? setIsAdmin(true) : alert('Wrong password!')} style={{ background: '#3F1522', color: '#FFF', border: 'none', padding: '12px 24px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', marginTop: 12, display: 'block', maxWidth: 300, width: '100%', margin: '12px auto 0' }}>Login →</button>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid #E6E1DA', marginBottom: 24 }}>
                    {['paste', 'pending', 'manage'].map(t => <button key={t} onClick={() => setAdminTab(t)} style={{ padding: '8px 0', fontWeight: 600, fontSize: 14, border: 'none', background: 'none', color: adminTab === t ? '#3F1522' : '#7E6E65', cursor: 'pointer', borderBottom: adminTab === t ? '2px solid #C09E53' : '2px solid transparent' }}>{t === 'paste' ? 'Paste & Extract' : t === 'pending' ? `Review Queue (${db.filter(c => c.status === 'pending').length})` : 'Manage Live'}</button>)}
                  </div>

                  {adminTab === 'paste' && (
                    <div>
                      <textarea value={whatsappInput} onChange={(e) => setWhatsappInput(e.target.value)} rows={5} placeholder="Paste WhatsApp message here..." style={{ width: '100%', border: '1px solid #E6E1DA', borderRadius: 8, padding: 10, fontSize: 14, marginBottom: 16, resize: 'vertical' }} />
                      <button onClick={handleExtract} style={{ background: '#3F1522', color: '#FFF', border: 'none', padding: '12px 24px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>✨ Extract with AI</button>
                      
                      {exData && (
                        <div style={{ marginTop: 24, borderTop: '1px solid #E6E1DA', paddingTop: 24 }}>
                          <p style={{ fontSize: 12, color: '#C09E53', fontWeight: 700, marginBottom: 16, letterSpacing: 1 }}>✅ AI EXTRACTED — REVIEW & EDIT</p>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <input placeholder="Title" value={exData.title} onChange={(e) => setExData({...exData, title: e.target.value})} style={{ border: '1px solid #E6E1DA', borderRadius: 8, padding: 10, fontSize: 14 }} />
                            <input placeholder="Organizer" value={exData.organizer} onChange={(e) => setExData({...exData, organizer: e.target.value})} style={{ border: '1px solid #E6E1DA', borderRadius: 8, padding: 10, fontSize: 14 }} />
                            <input placeholder="Deadline" value={exData.deadline} onChange={(e) => setExData({...exData, deadline: e.target.value})} style={{ border: '1px solid #E6E1DA', borderRadius: 8, padding: 10, fontSize: 14 }} />
                            <input placeholder="Prize" value={exData.prize} onChange={(e) => setExData({...exData, prize: e.target.value})} style={{ border: '1px solid #E6E1DA', borderRadius: 8, padding: 10, fontSize: 14 }} />
                            <input placeholder="Location" value={exData.location} onChange={(e) => setExData({...exData, location: e.target.value})} style={{ border: '1px solid #E6E1DA', borderRadius: 8, padding: 10, fontSize: 14 }} />
                            <input placeholder="Apply Link" value={exData.applyUrl} onChange={(e) => setExData({...exData, applyUrl: e.target.value})} style={{ border: '1px solid #E6E1DA', borderRadius: 8, padding: 10, fontSize: 14 }} />
                          </div>
                          <input placeholder="Tags (comma separated)" value={exData.tags.join(', ')} onChange={(e) => setExData({...exData, tags: e.target.value.split(',').map((t: string) => t.trim().toLowerCase())})} style={{ width: '100%', border: '1px solid #E6E1DA', borderRadius: 8, padding: 10, fontSize: 14, marginTop: 16 }} />
                          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, fontWeight: 600, cursor: 'pointer' }}>
                            <input type="checkbox" checked={exData.featured} onChange={(e) => setExData({...exData, featured: e.target.checked})} style={{ width: 16, height: 16, accentColor: '#C09E53' }} /> Featured
                          </label>
                          <button onClick={handleAddToQueue} style={{ background: '#27AE60', color: '#FFF', border: 'none', padding: '12px 24px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', marginTop: 20 }}>📤 Add to Review Queue</button>
                        </div>
                      )}
                    </div>
                  )}

                  {adminTab === 'pending' && (
                    <div>
                      {db.filter(c => c.status === 'pending').length === 0 ? <p style={{ textAlign: 'center', color: '#7E6E65', padding: 40 }}>No items pending review</p> : 
                       db.filter(c => c.status === 'pending').map(c => (
                        <div key={c.id} style={{ border: '1px solid #E6E1DA', borderRadius: 12, padding: 16, marginBottom: 12, background: '#FAFAFA' }}>
                          <h4 style={{ fontWeight: 700 }}>{c.title}</h4>
                          <p style={{ fontSize: 13, color: '#7E6E65', marginBottom: 12 }}>{c.organizer} · {c.prize || 'No prize'}</p>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => handleApprove(c.id)} style={{ background: '#27AE60', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>✓ Approve & Post</button>
                            <button onClick={() => handleReject(c.id)} style={{ background: '#FF5C5C', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>✕ Reject</button>
                          </div>
                        </div>
                      ))
                      }
                    </div>
                  )}

                  {adminTab === 'manage' && (
                    <div>
                      {db.filter(c => c.status === 'approved').map(c => (
                        <div key={c.id} style={{ border: '1px solid #E6E1DA', borderRadius: 12, padding: 16, marginBottom: 12, background: '#D4EDDA' }}>
                          <h4 style={{ fontWeight: 700 }}>{c.title}</h4>
                          <p style={{ fontSize: 12, color: '#155724' }}>{c.organizer} · {c.featured ? '⭐ Featured' : 'Standard'}</p>
                          <button onClick={() => handleReject(c.id)} style={{ background: '#FF5C5C', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>🗑️ Remove</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
