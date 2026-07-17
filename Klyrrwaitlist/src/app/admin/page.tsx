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

const CATEGORIES = ["Coding", "Design", "Science", "Business", "Arts", "General"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const MODES = ["Online", "In-Person", "Hybrid"];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [tagsInput, setTagsInput] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");
  const [publishSuccess, setPublishSuccess] = useState(false);

  const [items, setItems] = useState<Competition[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

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

  function updateDraft<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    setPublishError("");
    setPublishSuccess(false);

    if (!draft.name.trim()) {
      setPublishError("Competition name is required.");
      return;
    }

    const finalDraft: Draft = {
      ...draft,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
    };

    setPublishing(true);
    try {
      const res = await fetch("/api/admin/competitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalDraft),
      });
      if (res.ok) {
        setDraft(EMPTY_DRAFT);
        setTagsInput("");
        setPublishSuccess(true);
        loadItems();
        setTimeout(() => setPublishSuccess(false), 3000);
      } else {
        const data = await res.json().catch(() => ({}));
        setPublishError(data.error || "Something went wrong publishing this.");
      }
    } catch {
      setPublishError("Network error while publishing.");
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
    return <div style={styles.centerScreen}>Loading…</div>;
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

      {/* ADD NEW COMPETITION FORM */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Add a new competition</h2>
        <form onSubmit={handlePublish}>
          <div style={styles.formGrid}>
            <Field label="Competition name *" value={draft.name} onChange={(v) => updateDraft("name", v)} placeholder="e.g. Smart India Hackathon 2026" />
            <Field label="Organized by" value={draft.organizer} onChange={(v) => updateDraft("organizer", v)} placeholder="e.g. Govt. of India / AICTE" />

            <SelectField label="Type / Category" value={draft.category} onChange={(v) => updateDraft("category", v)} options={CATEGORIES} />
            <SelectField label="Level" value={draft.level} onChange={(v) => updateDraft("level", v)} options={LEVELS} />

            <Field label="Deadline to apply" value={draft.deadline} onChange={(v) => updateDraft("deadline", v)} placeholder="e.g. Jul 30, 2026" />
            <Field label="Event date" value={draft.eventDate} onChange={(v) => updateDraft("eventDate", v)} placeholder="e.g. Aug 20-21, 2026" />

            <Field label="Prize" value={draft.prize} onChange={(v) => updateDraft("prize", v)} placeholder="e.g. \u20b91,00,000 per team" />
            <Field label="Team size" value={draft.teamSize} onChange={(v) => updateDraft("teamSize", v)} placeholder="e.g. 2-6 members" />

            <SelectField label="Mode" value={draft.mode} onChange={(v) => updateDraft("mode", v)} options={MODES} />
            <Field label="Location (type manually)" value={draft.location} onChange={(v) => updateDraft("location", v)} placeholder="e.g. Pan India / Bengaluru / Online" />

            <Field label="Apply link (URL)" value={draft.url} onChange={(v) => updateDraft("url", v)} placeholder="https://..." />
            <Field label="Tags (comma separated)" value={tagsInput} onChange={setTagsInput} placeholder="e.g. AI/ML, IoT, Social Impact" />
          </div>

          <label style={styles.textareaLabel}>About / description</label>
          <textarea
            value={draft.description}
            onChange={(e) => updateDraft("description", e.target.value)}
            style={styles.textarea}
            rows={4}
            placeholder="A couple of sentences describing the opportunity..."
          />

          <div style={styles.checkboxRow}>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" checked={draft.global} onChange={(e) => updateDraft("global", e.target.checked)} />
              Global (open outside India)
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" checked={draft.featured} onChange={(e) => updateDraft("featured", e.target.checked)} />
              Featured (pin to top)
            </label>
          </div>

          {publishError && <div style={styles.errorText}>{publishError}</div>}
          {publishSuccess && <div style={styles.successText}>Published to klyrr.qzz.io/competitions \u2713</div>}

          <button type="submit" disabled={publishing} style={styles.primaryBtn}>
            {publishing ? "Publishing\u2026" : "Publish"}
          </button>
        </form>
      </section>

      {/* EXISTING LISTINGS */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Live listings ({items.length})</h2>
        {loadingItems ? (
          <p>Loading…</p>
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
                    {item.featured && <> &middot; <span style={{ color: "#C09E53" }}>Featured</span></>}
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

function Field({
  label, value, onChange, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label style={styles.fieldLabel}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} style={styles.input} placeholder={placeholder} />
    </div>
  );
}

function SelectField({
  label, value, onChange, options,
}: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label style={styles.fieldLabel}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={styles.input}>
        <option value="">Select…</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
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
  textarea: { width: "100%", boxSizing: "border-box", border: "1px solid #E6E1DA", borderRadius: 10, padding: 12, fontFamily: "inherit", fontSize: 14, marginBottom: 16, resize: "vertical" },
  textareaLabel: { display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6, color: "#7E6E65" },
  input: { width: "100%", boxSizing: "border-box", border: "1px solid #E6E1DA", borderRadius: 8, padding: "10px 12px", fontFamily: "inherit", fontSize: 14, background: "#fff" },
  fieldLabel: { display: "block", fontSize: 11, fontWeight: 600, marginBottom: 4, color: "#7E6E65", textTransform: "uppercase", letterSpacing: 0.5 },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 },
  checkboxRow: { display: "flex", gap: 20, marginBottom: 16 },
  checkboxLabel: { display: "flex", alignItems: "center", gap: 6, fontSize: 14 },
  primaryBtn: { background: "#3F1522", color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontWeight: 700, cursor: "pointer" },
  secondaryBtn: { background: "none", border: "1px solid #E6E1DA", borderRadius: 10, padding: "12px 20px", fontWeight: 600, cursor: "pointer" },
  deleteBtn: { background: "#FFE5E5", color: "#D31D1D", border: "none", borderRadius: 8, padding: "8px 14px", fontWeight: 600, cursor: "pointer" },
  listRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", border: "1px solid #E6E1DA", borderRadius: 10 },
  errorText: { color: "#D31D1D", fontSize: 13, marginBottom: 12 },
  successText: { color: "#1D8A3D", fontSize: 13, marginBottom: 12, fontWeight: 600 },
};
