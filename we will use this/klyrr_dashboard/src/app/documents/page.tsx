"use client";
import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, MapPin, BookOpen, FolderOpen,
  CheckCircle2, Circle, ChevronDown, ChevronRight, UploadCloud, FileText
} from "lucide-react";
import BottomNav from "../components/BottomNav";


type DocStatus = "missing" | "uploaded" | "not_required";

interface DocumentItem {
  id: string;
  name: string;
  status: DocStatus;
}

interface DocumentCategory {
  title: string;
  items: DocumentItem[];
}

const DOCUMENT_DATA: Record<string, DocumentCategory[]> = {
  "University Applications": [
    {
      title: "Academic Records",
      items: [
        { id: "u1", name: "High school transcripts (certified)", status: "uploaded" },
        { id: "u2", name: "Secondary school certificate/diploma", status: "missing" },
        { id: "u3", name: "Standardized test scores (SAT/ACT/IB)", status: "missing" },
        { id: "u4", name: "Predicted grades", status: "not_required" },
      ]
    },
    {
      title: "Essays & Statements",
      items: [
        { id: "u5", name: "Personal statement or essay", status: "missing" },
        { id: "u6", name: "Supplemental essays", status: "missing" },
      ]
    },
    {
      title: "Recommendations",
      items: [
        { id: "u7", name: "Teacher recommendation letters (2-3)", status: "missing" },
        { id: "u8", name: "Counselor school report", status: "missing" },
      ]
    }
  ],
  "Summer Programs": [
    {
      title: "Application Materials",
      items: [
        { id: "s1", name: "Program-specific application form", status: "missing" },
        { id: "s2", name: "Personal statement (program-focused)", status: "missing" },
      ]
    }
  ],
  "Internships": [
    {
      title: "Core Documents",
      items: [
        { id: "i1", name: "Tailored CV / Résumé", status: "uploaded" },
        { id: "i2", name: "Cover Letter", status: "missing" },
      ]
    }
  ]
};

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<string>("University Applications");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Academic Records"]);

  const toggleCategory = (title: string) => {
    setExpandedCategories(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const getStatusIcon = (status: DocStatus) => {
    switch (status) {
      case "uploaded": return <CheckCircle2 className="text-green-600" size={18} />;
      case "not_required": return <Circle className="text-burgundy/20" size={18} />;
      default: return <Circle className="text-gold" size={18} />;
    }
  };

  return (
    <div className="min-h-screen bg-cream text-burgundy pb-24">
      {/* Header */}
      <div className="pt-12 px-6 pb-6 bg-white border-b border-warm-beige sticky top-0 z-10">
        <h1 className="text-2xl font-serif font-bold">Document Vault</h1>
        <p className="text-sm text-burgundy/60 mt-1">Manage your application materials.</p>
        
        {/* Horizontal Scroll Tabs */}
        <div className="flex gap-4 mt-6 overflow-x-auto no-scrollbar pb-2">
          {Object.keys(DOCUMENT_DATA).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab 
                  ? "bg-burgundy text-white shadow-md" 
                  : "bg-warm-beige/30 text-burgundy/70 hover:bg-warm-beige/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Document List */}
      <div className="p-6 space-y-4">
        {DOCUMENT_DATA[activeTab].map((category) => (
          <div key={category.title} className="bg-white border border-warm-beige rounded-2xl overflow-hidden">
            <button 
              onClick={() => toggleCategory(category.title)}
              className="w-full flex items-center justify-between p-4 bg-warm-beige/10 hover:bg-warm-beige/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FolderOpen size={18} className="text-gold" />
                <span className="font-bold text-sm">{category.title}</span>
              </div>
              {expandedCategories.includes(category.title) ? <ChevronDown size={18} className="text-burgundy/50" /> : <ChevronRight size={18} className="text-burgundy/50" />}
            </button>

            {expandedCategories.includes(category.title) && (
              <div className="divide-y divide-warm-beige/40">
                {category.items.map((doc) => (
                  <div key={doc.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      {getStatusIcon(doc.status)}
                      <span className={`text-sm ${doc.status === "not_required" ? "text-burgundy/40 line-through" : "text-burgundy"}`}>
                        {doc.name}
                      </span>
                    </div>
                    {doc.status === "missing" && (
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-burgundy/5 text-burgundy rounded-lg text-xs font-semibold hover:bg-burgundy/10 transition-colors">
                        <UploadCloud size={14} /> Upload
                      </button>
                    )}
                    {doc.status === "uploaded" && (
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-warm-beige/20 text-burgundy rounded-lg text-xs font-semibold hover:bg-warm-beige/40 transition-colors">
                        <FileText size={14} /> View
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
        <BottomNav/>
    </div>
  );
}