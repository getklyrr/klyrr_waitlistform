import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Code, Trophy } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F9F6F0] flex flex-col items-center justify-center px-4 font-sans">

      {/* Brand Badge */}
      <div className="flex items-center gap-2 mb-6 px-4 py-2 bg-[#4A1525]/5 border border-[#4A1525]/10 rounded-full">
        <Sparkles size={14} color="#B48C3C" />
        <span className="text-[#4A1525] text-xs font-bold uppercase tracking-widest">
          Klyrr Opportunities
        </span>
      </div>

      {/* Hero Text */}
      <div className="text-center max-w-2xl mb-8">
        <h1
          className="text-4xl md:text-5xl font-bold text-[#4A1525] mb-4"
          style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.2 }}
        >
          Build your profile. <br className="hidden md:block" />
          <span className="text-[#B48C3C]">Track your growth.</span>
        </h1>
        <p className="text-[#4A1525]/70 text-sm md:text-base leading-relaxed max-w-md mx-auto">
          Discover prestigious hackathons, track your coding consistency, and
          build a portfolio that stands out to top universities and recruiters.
        </p>
      </div>

      {/* Action Button */}
      <Link href="/competitions">
        <button className="flex items-center gap-3 px-8 py-4 bg-[#4A1525] text-white rounded-xl font-semibold shadow-lg shadow-[#4A1525]/20 hover:bg-[#6b1a35] transition-all active:scale-95">
          Open Dashboard
          <ArrowRight size={18} />
        </button>
      </Link>

      {/* Mini Feature List */}
      <div className="flex items-center gap-6 mt-12 text-xs text-[#4A1525]/50 font-medium">
        <div className="flex items-center gap-1.5">
          <Trophy size={14} /> Global Hackathons
        </div>
        <div className="flex items-center gap-1.5">
          <Code size={14} /> Activity Tracking
        </div>
      </div>
    </div>
  );
}
