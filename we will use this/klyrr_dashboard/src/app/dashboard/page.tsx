"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useKlyrr } from "@/context/KlyrrContext";
import {
  LayoutDashboard, BookOpen, MapPin, Clock, CheckCircle2,
  Circle, FileText, ChevronRight, Plus, Sparkles, Bell,
  TrendingUp,FolderOpen
} from "lucide-react";
import BottomNav from "../components/BottomNav";


const STATUS_CONFIG = {
  "Not Started": { icon: Circle, color: "text-burgundy/30", bg: "bg-cream", label: "Not Started" },
  "In Progress": { icon: TrendingUp, color: "text-gold", bg: "bg-gold/10", label: "In Progress" },
  "Submitted": { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", label: "Submitted" },
};

function daysUntil(dateStr: string): number {
  const deadline = new Date(dateStr + ", 2025");
  const today = new Date();
  const diff = deadline.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getUrgencyColor(days: number): string {
  if (days <= 30) return "text-red-500";
  if (days <= 60) return "text-amber-500";
  return "text-green-600";
}

export default function DashboardPage() {
  const router = useRouter();
  const { profile, shortlistedUniversities, essays } = useKlyrr();

  const totalApps = shortlistedUniversities.length;
  const submitted = 0;
  const inProgress = essays.length > 0 ? shortlistedUniversities.filter(u => essays.some(e => e.universityId === u.id)).length : 0;

  const upcomingDeadlines = [...shortlistedUniversities]
    .map(u => ({ ...u, days: daysUntil(u.deadline) }))
    .sort((a, b) => a.days - b.days)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-cream font-sans">
      {/* Header */}
      <div className="bg-burgundy px-5 pt-8 pb-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
           <img src="/logo.svg" alt="Klyrr Logo" className="w-4 h-4 object-contain" />
            <span className="text-gold text-xs font-bold uppercase tracking-widest">KLYRR</span>
          </div>
          <button className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
            <Bell size={15} className="text-white" />
          </button>
        </div>
        <h1 className="text-white text-xl font-bold leading-tight font-serif">
          {profile.name ? `Welcome, ${profile.name.split(" ")[0]}` : "Your Dashboard"}
        </h1>
        <p className="text-white/50 text-sm mt-0.5">
          {totalApps} universities tracked
        </p>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { label: "Total", value: totalApps, sub: "applications" },
            { label: "Active", value: inProgress, sub: "in progress" },
            { label: "Submitted", value: submitted, sub: "complete" },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-white font-bold text-xl">{s.value}</div>
              <div className="text-white/50 text-[10px] uppercase tracking-wide">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-5 flex flex-col gap-5">
        {/* Quick Actions */}
        <div>
          <h2 className="text-burgundy font-bold text-xs uppercase tracking-widest mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => router.push("/essays")}
              className="bg-burgundy rounded-xl p-4 flex items-center gap-3 active:scale-[0.97] transition-transform"
            >
              <div className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center">
                <BookOpen size={16} className="text-gold" />
              </div>
              <div className="text-left">
                <div className="text-white text-xs font-bold">Essays</div>
                <div className="text-white/50 text-[10px]">{essays.length} drafts</div>
              </div>
            </button>
            <button
              onClick={() => router.push("/universities")}
              className="bg-white border border-warm-beige rounded-xl p-4 flex items-center gap-3 active:scale-[0.97] transition-transform shadow-sm"
            >
              <div className="w-8 h-8 bg-cream rounded-lg flex items-center justify-center">
                <Plus size={16} className="text-burgundy" />
              </div>
              <div className="text-left">
                <div className="text-burgundy text-xs font-bold">Add More</div>
                <div className="text-burgundy/40 text-[10px]">Universities</div>
              </div>
            </button>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        {upcomingDeadlines.length > 0 && (
          <div>
            <h2 className="text-burgundy font-bold text-xs uppercase tracking-widest mb-3">
              Upcoming Deadlines
            </h2>
            <div className="flex flex-col gap-2">
              {upcomingDeadlines.map((uni) => (
                <div key={uni.id} className="bg-white border border-warm-beige shadow-sm rounded-xl p-3.5 flex items-center gap-3">
                  <div className="text-2xl">{uni.logo}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-burgundy font-semibold text-sm truncate font-serif">
                      {uni.name}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock size={10} className="text-burgundy/40" />
                      <span className="text-xs text-burgundy/50">{uni.deadline}</span>
                    </div>
                  </div>
                  <div className={`text-right shrink-0 ${getUrgencyColor(uni.days)}`}>
                    <div className="font-bold text-base leading-none">{uni.days}</div>
                    <div className="text-[10px] opacity-70">days</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Application Cards */}
        {shortlistedUniversities.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-burgundy font-bold text-xs uppercase tracking-widest">
                Your Applications
              </h2>
              <span className="text-xs text-burgundy/50">{totalApps} schools</span>
            </div>
            <div className="flex flex-col gap-3">
              {shortlistedUniversities.map((uni) => {
                const uniEssays = essays.filter((e) => e.universityId === uni.id);
                const appStatus = uniEssays.length === 0 ? "Not Started" : "In Progress";
                const StatusIcon = STATUS_CONFIG[appStatus].icon;
                const days = daysUntil(uni.deadline);

                return (
                  <div key={uni.id} className="bg-white border border-warm-beige shadow-sm rounded-2xl overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center text-xl shrink-0">
                          {uni.logo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-burgundy font-bold text-sm leading-tight font-serif">
                              {uni.name}
                            </h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${STATUS_CONFIG[appStatus].bg} ${STATUS_CONFIG[appStatus].color}`}>
                              {appStatus}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1">
                              <MapPin size={10} className="text-burgundy/40" />
                              <span className="text-[11px] text-burgundy/50">{uni.country}</span>
                            </div>
                            <div className={`flex items-center gap-1 ${getUrgencyColor(days)}`}>
                              <Clock size={10} />
                              <span className="text-[11px] font-semibold">{days}d left</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Checklist Mini */}
                      <div className="mt-3 pt-3 border-t border-cream">
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: "Documents", done: false },
                            { label: "Essays", done: uniEssays.length > 0 },
                            { label: "Submitted", done: false },
                          ].map((item) => (
                            <div key={item.label} className="flex items-center gap-1.5">
                              {item.done ? (
                                <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                              ) : (
                                <Circle size={12} className="text-burgundy/20 shrink-0" />
                              )}
                              <span className={`text-[10px] ${item.done ? "text-green-600 font-semibold" : "text-burgundy/40"}`}>
                                {item.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="border-t border-warm-beige bg-cream flex">
                      <button
                        onClick={() => router.push("/essays")}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-burgundy hover:bg-warm-beige transition-colors"
                      >
                        <FileText size={13} />
                        {uniEssays.length > 0 ? `${uniEssays.length} Essay${uniEssays.length > 1 ? "s" : ""}` : "Start Essays"}
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white border border-warm-beige shadow-sm rounded-2xl p-8 text-center">
            <div className="w-14 h-14 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
              <LayoutDashboard size={24} className="text-burgundy" strokeWidth={1.5} />
            </div>
            <h3 className="text-burgundy font-bold text-base mb-2 font-serif">
              No applications yet
            </h3>
            <p className="text-burgundy/50 text-sm mb-5 leading-relaxed">
              Discover universities and shortlist the ones that match your profile.
            </p>
            <button
              onClick={() => router.push("/universities")}
              className="bg-burgundy text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 mx-auto active:scale-[0.98] transition-transform shadow-md"
            >
              <Plus size={15} /> Find Universities
            </button>
          </div>
        )}

        {/* AI Insight Banner */}
        {shortlistedUniversities.length > 0 && (
          <div className="bg-burgundy rounded-2xl p-4 flex items-start gap-3 shadow-md">
            <div className="w-9 h-9 bg-gold/20 rounded-xl flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-gold" />
            </div>
            <div>
              <div className="text-white font-bold text-sm mb-1 font-serif">
                KLYRR Insight
              </div>
              <p className="text-white/60 text-xs leading-relaxed">
                {profile.financialPlan === "full_aid"
                  ? "You have 2 full-aid universities on your list. NUS Singapore & TU Munich have the highest scholarship probability for your profile."
                  : "Start your essays early — schools like University of Edinburgh require highly personal statements that take 3–4 drafts to get right."}
              </p>
            </div>
          </div>
        )}
      </div>

     <BottomNav/>
      <div className="h-20" />
    </div>
  );
}