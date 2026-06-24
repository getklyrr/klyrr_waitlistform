"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useKlyrr, Essay } from "@/context/KlyrrContext";
import {
  BookOpen, Sparkles, Plus, ChevronLeft,
  FileText, Zap, Eye, Shuffle,
  MessageSquare, LayoutDashboard, MapPin, X, Save, FolderOpen
} from "lucide-react";
import BottomNav from "../components/BottomNav";


const MOCK_PROMPTS: Record<string, { prompt: string; decoded: string; wordLimit: number }[]> = {
  "University of Toronto": [
    { prompt: "Describe how your background and experiences have prepared you for university.", decoded: "They want to see self-awareness and evidence that you've grown from real experiences — not just academics.", wordLimit: 500 },
  ],
  "University of Edinburgh": [
    { prompt: "Why do you want to study your chosen subject at university?", decoded: "This is a subject motivation essay. Be specific about intellectual curiosity — not career goals. They want to see genuine passion.", wordLimit: 4000 },
  ],
  "National University of Singapore": [
    { prompt: "Tell us about a challenge you faced and how you overcame it.", decoded: "They want to assess resilience and problem-solving. Use a real, specific story — not generic adversity. Show what you learned.", wordLimit: 600 },
  ],
  "TU Munich": [
    { prompt: "Why do you want to study at TUM and what are your academic goals?", decoded: "Be specific about TUM's research labs, professors, or programs. Generic answers fail here. Show you've done research.", wordLimit: 500 },
  ],
  default: [
    { prompt: "Why are you interested in this university and program?", decoded: "Show specific knowledge of this institution. Generic answers get rejected immediately.", wordLimit: 500 },
  ],
};

const AI_ACTIONS = [
  { id: "decode", icon: Eye, label: "Decode Prompt", desc: "Understand what they're really asking" },
  { id: "stories", icon: Shuffle, label: "Find My Story", desc: "Answer 5 questions to find your angle" },
  { id: "feedback", icon: MessageSquare, label: "Review Draft", desc: "Clarity, authenticity & prompt alignment" },
  { id: "structure", icon: LayoutDashboard, label: "Structure Guide", desc: "Build your thinking scaffold" },
];

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function EssaysPage() {
  const router = useRouter();
  const { shortlistedUniversities, essays, addEssay, updateEssay } = useKlyrr();
  const [selectedEssay, setSelectedEssay] = useState<Essay | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newUniId, setNewUniId] = useState("");
  const [newPromptIdx, setNewPromptIdx] = useState(0);
  const [aiPanel, setAiPanel] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  const selectedUni = shortlistedUniversities.find(u => u.id === newUniId);
  const availablePrompts = selectedUni
    ? MOCK_PROMPTS[selectedUni.name] ?? MOCK_PROMPTS.default
    : [];

  const createEssay = () => {
    if (!selectedUni) return;
    const promptData = availablePrompts[newPromptIdx] ?? availablePrompts[0];
    const essay: Essay = {
      id: Date.now().toString(),
      universityId: selectedUni.id,
      universityName: selectedUni.name,
      prompt: promptData.prompt,
      promptDecoded: promptData.decoded,
      content: "",
      wordCount: 0,
      wordLimit: promptData.wordLimit,
      status: "Draft",
      lastEdited: new Date().toLocaleDateString(),
    };
    addEssay(essay);
    setSelectedEssay(essay);
    setShowNewModal(false);
    setNewUniId("");
    setNewPromptIdx(0);
  };

  const handleContentChange = (content: string) => {
    if (!selectedEssay) return;
    const updated = { ...selectedEssay, content, wordCount: wordCount(content), lastEdited: new Date().toLocaleDateString() };
    setSelectedEssay(updated);
    updateEssay(selectedEssay.id, { content });
  };

  const simulateAI = async (action: string) => {
    setAiLoading(true);
    setAiResponse("");
    await new Promise(r => setTimeout(r, 1200));
    const responses: Record<string, string> = {
      decode: selectedEssay?.promptDecoded || "Select an essay to decode its prompt.",
      feedback: selectedEssay?.content
        ? `**Clarity:** Your essay is clear but the opening could be stronger. Lead with a specific moment, not a statement.\n\n**Authenticity:** The middle section feels genuine. The ending rushes — expand on what you learned.\n\n**Prompt Alignment:** Good, but make sure you explicitly connect back to why this university specifically.`
        : "Write some content first so I can review it.",
      stories: "**Story Finder — Question 1 of 5**\n\nDescribe a moment where you had to figure something out completely on your own. It can be small or big. What was the situation?",
      structure: `**Thinking Scaffold for this Essay:**\n\n1. **Hook (50 words):** Open with a specific scene or moment\n2. **Context (100 words):** Briefly explain the background\n3. **Core Narrative (250 words):** What happened, what you did\n4. **Reflection (100 words):** What you genuinely learned\n5. **Bridge (50 words):** Connect to your university goals`,
    };
    setAiResponse(responses[action] || "");
    setAiLoading(false);
  };

  const wc = selectedEssay ? wordCount(selectedEssay.content) : 0;
  const wcPercent = selectedEssay ? Math.min(100, (wc / selectedEssay.wordLimit) * 100) : 0;
  const wcColor = wcPercent > 100 ? "text-red-500" : wcPercent > 85 ? "text-amber-500" : "text-burgundy";

  return (
    <div className="min-h-screen bg-cream flex flex-col font-sans">
      {/* Header */}
      <div className="bg-burgundy px-5 pt-8 pb-4 sticky top-0 z-30">
        <div className="flex items-center gap-3 mb-1">
          {selectedEssay ? (
            <button onClick={() => { setSelectedEssay(null); setAiPanel(null); }} className="text-white/60 hover:text-white">
              <ChevronLeft size={20} />
            </button>
          ) : (
            <div className="w-7 h-7 bg-gold/20 rounded-lg flex items-center justify-center">
              <BookOpen size={14} className="text-gold" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Sparkles size={12} className="text-gold" />
              <span className="text-gold text-[10px] font-bold uppercase tracking-widest">KLYRR Essays</span>
            </div>
            <h1 className="text-white font-bold text-base leading-tight font-serif">
              {selectedEssay ? selectedEssay.universityName : "Essay Manager"}
            </h1>
          </div>
          {!selectedEssay && shortlistedUniversities.length > 0 && (
            <button
              onClick={() => setShowNewModal(true)}
              className="bg-gold text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
            >
              <Plus size={13} /> New Essay
            </button>
          )}
        </div>
      </div>

      {/* Essay List */}
      {!selectedEssay && (
        <div className="flex-1 px-4 py-5 flex flex-col gap-3">
          {essays.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-white border border-warm-beige rounded-2xl flex items-center justify-center mb-4">
                <FileText size={28} className="text-burgundy" strokeWidth={1.5} />
              </div>
              <h3 className="text-burgundy font-bold text-lg mb-2 font-serif">
                No essays yet
              </h3>
              <p className="text-burgundy/50 text-sm mb-6 max-w-60 leading-relaxed">
                {shortlistedUniversities.length === 0
                  ? "Shortlist universities first, then start your essays."
                  : "Start writing for your shortlisted universities."}
              </p>
              {shortlistedUniversities.length === 0 ? (
                <button
                  onClick={() => router.push("/universities")}
                  className="bg-burgundy text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md"
                >
                  <MapPin size={15} /> Find Universities
                </button>
              ) : (
                <button
                  onClick={() => setShowNewModal(true)}
                  className="bg-burgundy text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md"
                >
                  <Plus size={15} /> Start First Essay
                </button>
              )}
            </div>
          ) : (
            essays.map((essay) => {
              const essayWc = wordCount(essay.content);
              const pct = Math.min(100, (essayWc / essay.wordLimit) * 100);
              return (
                <button
                  key={essay.id}
                  onClick={() => setSelectedEssay(essay)}
                  className="bg-white border border-warm-beige rounded-2xl p-4 text-left w-full active:scale-[0.98] transition-transform shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="text-burgundy font-bold text-sm font-serif">{essay.universityName}</div>
                      <div className="text-burgundy/50 text-xs mt-0.5 line-clamp-2 leading-relaxed">{essay.prompt}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${
                      essay.status === "Final" ? "bg-green-50 text-green-700" :
                      essay.status === "In Review" ? "bg-amber-50 text-amber-700" :
                      "bg-cream text-burgundy/50"
                    }`}>{essay.status}</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-burgundy/40">Progress</span>
                      <span className={pct > 100 ? "text-red-500 font-semibold" : "text-burgundy/60"}>
                        {essayWc} / {essay.wordLimit} words
                      </span>
                    </div>
                    <div className="h-1 bg-cream rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${pct > 100 ? "bg-red-500" : pct > 85 ? "bg-gold" : "bg-burgundy"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}

      {/* Essay Editor */}
      {selectedEssay && (
        <div className="flex-1 flex flex-col">
          {/* Prompt Card */}
          <div className="mx-4 mt-4 bg-burgundy/5 border border-burgundy/10 rounded-xl p-3.5">
            <div className="text-[10px] text-gold font-bold uppercase tracking-widest mb-1">Essay Prompt</div>
            <p className="text-burgundy text-xs leading-relaxed">{selectedEssay.prompt}</p>
          </div>

          {/* Word Count Bar */}
          <div className="mx-4 mt-2 flex items-center justify-between">
            <div className="h-1 flex-1 bg-warm-beige rounded-full overflow-hidden mr-3">
              <div
                className={`h-full rounded-full transition-all ${wcPercent > 100 ? "bg-red-500" : wcPercent > 85 ? "bg-gold" : "bg-burgundy"}`}
                style={{ width: `${wcPercent}%` }}
              />
            </div>
            <span className={`text-xs font-semibold shrink-0 ${wcColor}`}>
              {wc} / {selectedEssay.wordLimit}
            </span>
          </div>

          {/* Editor */}
          <div className="mx-4 mt-3 flex-1">
            <textarea
              value={selectedEssay.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Start writing your essay here. Your thoughts, your story — KLYRR's AI will help you shape it."
              className="w-full h-52 p-4 bg-white border border-warm-beige rounded-xl text-burgundy text-sm leading-relaxed placeholder-burgundy/25 focus:outline-none focus:border-gold resize-none"
            />
          </div>

          {/* Save Status */}
          <div className="mx-4 mt-1.5 flex items-center gap-1.5">
            <Save size={11} className="text-burgundy/30" />
            <span className="text-[11px] text-burgundy/40">Last edited {selectedEssay.lastEdited}</span>
          </div>

          {/* AI Co-Pilot */}
          <div className="mx-4 mt-4 mb-20">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={13} className="text-gold" />
              <span className="text-xs font-bold text-burgundy uppercase tracking-widest">AI Essay Co-Pilot</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {AI_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  onClick={() => {
                    setAiPanel(action.id);
                    simulateAI(action.id);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all active:scale-[0.97] ${
                    aiPanel === action.id
                      ? "bg-burgundy border-burgundy shadow-md"
                      : "bg-white border-warm-beige hover:border-burgundy/30 shadow-sm"
                  }`}
                >
                  <action.icon size={15} className={aiPanel === action.id ? "text-gold mb-1" : "text-burgundy mb-1"} />
                  <div className={`text-xs font-bold ${aiPanel === action.id ? "text-white" : "text-burgundy"}`}>
                    {action.label}
                  </div>
                  <div className={`text-[10px] mt-0.5 leading-tight ${aiPanel === action.id ? "text-white/60" : "text-burgundy/40"}`}>
                    {action.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* AI Response Panel */}
            {aiPanel && (
              <div className="mt-3 bg-burgundy rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles size={13} className="text-gold" />
                    <span className="text-gold text-xs font-bold">KLYRR AI</span>
                  </div>
                  <button onClick={() => { setAiPanel(null); setAiResponse(""); }}>
                    <X size={14} className="text-white/40 hover:text-white" />
                  </button>
                </div>
                {aiLoading ? (
                  <div className="flex gap-1 py-2">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                ) : (
                  <p className="text-white/80 text-xs leading-relaxed whitespace-pre-line">{aiResponse}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Essay Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end">
          <div className="bg-cream w-full rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-burgundy font-bold text-lg font-serif">
                New Essay
              </h3>
              <button onClick={() => setShowNewModal(false)}>
                <X size={20} className="text-burgundy/50 hover:text-burgundy transition-colors" />
              </button>
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold text-burgundy/50 uppercase tracking-widest mb-2 block">
                Select University
              </label>
              <div className="flex flex-col gap-2">
                {shortlistedUniversities.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => { setNewUniId(u.id); setNewPromptIdx(0); }}
                    className={`px-4 py-3 rounded-xl border text-left text-sm font-semibold transition-all ${
                      newUniId === u.id
                        ? "bg-burgundy text-white border-burgundy shadow-md"
                        : "bg-white text-burgundy border-warm-beige hover:border-burgundy/50"
                    }`}
                  >
                    <span className="mr-2">{u.logo}</span> {u.name}
                  </button>
                ))}
              </div>
            </div>

            {newUniId && availablePrompts.length > 0 && (
              <div className="mb-5">
                <label className="text-xs font-bold text-burgundy/50 uppercase tracking-widest mb-2 block">
                  Select Prompt
                </label>
                {availablePrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setNewPromptIdx(i)}
                    className={`w-full px-4 py-3 rounded-xl border text-left text-xs leading-relaxed mb-2 transition-all ${
                      newPromptIdx === i
                        ? "bg-burgundy text-white border-burgundy shadow-md"
                        : "bg-white text-burgundy/70 border-warm-beige hover:border-burgundy/50"
                    }`}
                  >
                    {p.prompt}
                    <span className={`block mt-1 text-[10px] font-semibold ${newPromptIdx === i ? "text-gold" : "text-burgundy/40"}`}>
                      {p.wordLimit} word limit
                    </span>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={createEssay}
              disabled={!newUniId}
              className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                newUniId
                  ? "bg-burgundy text-white shadow-lg active:scale-[0.98]"
                  : "bg-warm-beige text-burgundy/40 cursor-not-allowed"
              }`}
            >
              <Sparkles size={15} /> Start Writing
            </button>
          </div>
        </div>
      )}
      <BottomNav/>
    </div>
  );
}