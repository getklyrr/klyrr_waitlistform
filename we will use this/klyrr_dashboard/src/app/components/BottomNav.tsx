"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MapPin, FolderOpen, Trophy, BookOpen } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { label: "Dashboard", icon: LayoutDashboard, route: "/dashboard" },
    { label: "Universities", icon: MapPin, route: "/universities" },
    { label: "Docs", icon: FolderOpen, route: "/documents" },
    { label: "Activities", icon: Trophy, route: "/extracurriculars" },
    { label: "Essays", icon: BookOpen, route: "/essays" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-warm-beige flex pb-safe z-50">
      {tabs.map((tab) => {
        const isActive = pathname === tab.route; 
        
        return (
          <Link
            key={tab.route}
            href={tab.route}
            className={`flex-1 flex flex-col items-center py-3 gap-1 min-w-0 transition-colors hover:bg-cream ${
              isActive ? "text-burgundy" : "text-burgundy/30"
            }`}
          >
            <tab.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} className="flex-shrink-0" />
            {/* Added truncate, px-1, and fallback blank space to prevent mobile overlap */}
            <span className="text-[10px] font-semibold truncate w-full text-center px-1">
              {tab.label || '\u00A0'}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
