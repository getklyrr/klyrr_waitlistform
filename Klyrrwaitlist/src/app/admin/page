"use client";

import { useEffect, useState } from "react";

type Draft = {
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

type Competition = Draft & { id: string; published: boolean };

const EMPTY_DRAFT: Draft = {
  name: "", organizer: "", category: "", deadline: "", eventDate: "",
  prize: "", level: "", mode: "", teamSize: "", location: "",
  description: "", tags: [], global: false, featured: false, url: "",
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  const [rawText, setRawText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [publishing, setPublishing] = useState(false);

  const [items, setItems] = useState<Competition[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  // A logged-in session is proven the first time any admin API call succeeds.
  useEffect(() => {
    loadItems(true);
  }, []);

  async function loadItems(isInitialCheck = false) {
    setLoadingItems(true);
    const res = await fetch("/api/admin/competitions");
    if (res.status === 401) {
      setAuthed(false);
      if (isInitialCheck) setCheckingSession(false);
      setLoadingItems(false);
      return;
    }
    setAuthed(true);
    if (isInitialCheck) setCheckingSession(false);
    const data = await res.json();
    setItems(data.items || []);
    setLoadingItems(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
      setPassword("");
      loadItems();
    } else {
      setLoginError("Incorrect password");
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
  }

  async function handleParse() {
    setParseError("");
    setParsing(true);
    setDraft(null);
    try {
      const res = await fetch("/api/admin/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setParseError(data.error || "Parsing failed");
        return;
      }
      setDraft({ ...EMPTY_DRAFT, ...data.result });
    } catch {
      setParseError("Network error while parsing");
    } finally {
      setParsing(false);
    }
  }

  async function handlePublish() {
    if (!draft) return;
    setPublishing(true);
    try {
      const res = await fetch("/api/admin/competitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (res.ok) {
        setDraft(null);
        setRawText("");
        loadItems();
      }
    } finally {
      setPublishing(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this listing? This can't be undone.")) return;
    await fetch(`/api/admin/competitions/${id}`, { method: "DELETE" });
    loadItems();
  }

  if (checkingSession) {
    return <div style={styles.centerScreen}>Loading\u2026</div>;
  }

  if (!authed) {
    return (
      <div style={styles.centerScreen}>
        <form onSubmit={handleLogin} style={styles.loginCard}>
          <h1 style={styles.loginTitle}>Klyrr Admin</h1>
          <p style={styles.loginSubtitle}>get.klyrr@gmail.com only</p>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            autoFocus
          />
          {loginError && <div style={styles.errorText}>{loginError}</div>}
          <button type="submit" style={styles.primaryBtn}>Log in</button>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <h1 style={styles.pageTitle}>Klyrr Admin</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>Log out</button>
      </div>

      {/* PASTE & PARSE */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>1. Paste a WhatsApp message</h2>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste the raw forwarded WhatsApp message here..."
          style={styles.textarea}
          rows={8}
        />
        <button
          onClick={handleParse}
          disabled={parsing || rawText.trim().length === 0}
          style={styles.primaryBtn}
        >
          {parsing ? "Parsing\u2026" : "Parse with AI"}
        </button>
        {parseError && <div style={styles.errorText}>{parseError}</div>}
      </section>

      {/* EDITABLE PREVIEW */}
      {draft && (
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>2. Review &amp; edit before publishing</h2>
          <div style={styles.formGrid}>
            <Field label="Name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
            <Field label="Organizer" value={draft.organizer} onChange={(v) => setDraft({ ...draft, organizer: v })} />
            <Field label="Category" value={draft.category} onChange={(v) => setDraft({ ...draft, category: v })} />
            <Field label="Level" value={draft.level} onChange={(v) => setDraft({ ...draft, level: v })} />
            <Field label="Mode" value={draft.mode} onChange={(v) => setDraft({ ...draft, mode: v })} />
            <Field label="Deadline" value={draft.deadline} onChange={(v) => setDraft({ ...draft, deadline: v })} />
            <Field label="Event Date" value={draft.eventDate} onChange={(v) => setDraft({ ...draft, eventDate: v })} />
            <Field label="Prize" value={draft.prize} onChange={(v) => setDraft({ ...draft, prize: v })} />
            <Field label="Team Size" value={draft.teamSize} onChange={(v) => setDraft({ ...draft, teamSize: v })} />
            <Field label="Location" value={draft.location} onChange={(v) => setDraft({ ...draft, location: v })} />
            <Field label="Apply URL" value={draft.url} onChange={(v) => setDraft({ ...draft, url: v })} />
            <Field
              label="Tags (comma separated)"
              value={draft.tags.join(", ")}
              onChange={(v) => setDraft({ ...draft, tags: v.split(",").map((t) => t.trim()).filter(Boolean) })}
            />
          </div>
          <label style={styles.textareaLabel}>Description</label>
          <textarea
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            style={styles.textarea}
            rows={3}
          />
          <div style={styles.checkboxRow}>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" checked={draft.global} onChange={(e) => setDraft({ ...draft, global: e.target.checked })} />
              Global
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" checked={draft.featured} onChange={(e) => setDraft({ ...draft, featured: e.target.checked })} />
              Featured
            </label>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handlePublish} disabled={publishing} style={styles.primaryBtn}>
              {publishing ? "Publishing\u2026" : "Publish to klyrr.qzz.io/competitions"}
            </button>
            <button onClick={() => setDraft(null)} style={styles.secondaryBtn}>Discard</button>
          </div>
        </section>
      )}

      {/* EXISTING LISTINGS */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Live listings ({items.length})</h2>
        {loadingItems ? (
          <p>Loading\u2026</p>
        ) : items.length === 0 ? (
          <p style={{ color: "#7E6E65" }}>Nothing published yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((item) => (
              <div key={item.id} style={styles.listRow}>
                <div>
                  <strong>{item.name || "(untitled)"}</strong>
                  <div style={{ fontSize: 12, color: "#7E6E65" }}>
                    {item.organizer} &middot; {item.deadline}
                  </div>
                </div>
                <button onClick={() => handleDelete(item.id)} style={styles.deleteBtn}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={styles.fieldLabel}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} style={styles.input} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  centerScreen: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9F6F0", fontFamily: "sans-serif" },
  loginCard: { background: "#fff", padding: 32, borderRadius: 16, border: "1px solid #E6E1DA", width: 320, display: "flex", flexDirection: "column", gap: 12 },
  loginTitle: { fontSize: 22, fontWeight: 700, color: "#3F1522", margin: 0 },
  loginSubtitle: { fontSize: 12, color: "#7E6E65", margin: "0 0 8px 0" },
  page: { maxWidth: 900, margin: "0 auto", padding: "40px 20px", fontFamily: "sans-serif", color: "#3F1522" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  pageTitle: { fontSize: 26, fontWeight: 700, margin: 0 },
  logoutBtn: { background: "none", border: "1px solid #E6E1DA", borderRadius: 8, padding: "8px 14px", cursor: "pointer" },
  card: { background: "#fff", border: "1px solid #E6E1DA", borderRadius: 16, padding: 24, marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 16 },
  textarea: { width: "100%", boxSizing: "border-box", border: "1px solid #E6E1DA", borderRadius: 10, padding: 12, fontFamily: "inherit", fontSize: 14, marginBottom: 12, resize: "vertical" },
  textareaLabel: { display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6, color: "#7E6E65" },
  input: { width: "100%", boxSizing: "border-box", border: "1px solid #E6E1DA", borderRadius: 8, padding: "10px 12px", fontFamily: "inherit", fontSize: 14 },
  fieldLabel: { display: "block", fontSize: 11, fontWeight: 600, marginBottom: 4, color: "#7E6E65", textTransform: "uppercase", letterSpacing: 0.5 },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 },
  checkboxRow: { display: "flex", gap: 20, marginBottom: 16 },
  checkboxLabel: { display: "flex", alignItems: "center", gap: 6, fontSize: 14 },
  primaryBtn: { background: "#3F1522", color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontWeight: 700, cursor: "pointer" },
  secondaryBtn: { background: "none", border: "1px solid #E6E1DA", borderRadius: 10, padding: "12px 20px", fontWeight: 600, cursor: "pointer" },
  deleteBtn: { background: "#FFE5E5", color: "#D31D1D", border: "none", borderRadius: 8, padding: "8px 14px", fontWeight: 600, cursor: "pointer" },
  listRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", border: "1px solid #E6E1DA", borderRadius: 10 },
  errorText: { color: "#D31D1D", fontSize: 13, marginBottom: 8 },
};
