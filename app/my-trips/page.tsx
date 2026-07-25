"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Award, Lock, CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";

// All 10 badges matching your available trips, defaulting to 0 earned.
const ALL_BADGES = [
  { id: "sungei-buloh", name: "Sungei Buloh", earned: false, date: "", icon: "🦅" },
  { id: "rail-corridor", name: "Rail Corridor", earned: false, date: "", icon: "🛤️" },
  { id: "bukit-timah", name: "Bukit Timah", earned: false, date: "", icon: "⛰️" },
  { id: "pulau-ubin", name: "Pulau Ubin", earned: false, date: "", icon: "🛶" },
  { id: "southern-islands", name: "Southern Islands", earned: false, date: "", icon: "🏝️" },
  { id: "ntu", name: "NTU Heritage", earned: false, date: "", icon: "🏛️" },
  { id: "airforce-museum", name: "Air Force Museum", earned: false, date: "", icon: "✈️" },
  { id: "navy-museum", name: "Navy Museum", earned: false, date: "", icon: "⚓" },
  { id: "coney-island", name: "Coney Island", earned: false, date: "", icon: "🌲" },
  { id: "botanic-gardens", name: "Botanic Gardens", earned: false, date: "", icon: "🌸" },
];

export default function MyTrips() {
  const { data: session } = useSession();
  const [attended, setAttended] = useState<{ tripId: string; earnedAt: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!session?.user) {
        setAttended([]);
        return;
      }
      try {
        const res = await fetch("/api/attendance", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setAttended(data.attended ?? []);
      } catch {}
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [session?.user]);

  const BADGES = useMemo(() => {
    const earnedMap = new Map(attended.map((a) => [a.tripId, a.earnedAt]));
    return ALL_BADGES.map((b) => {
      const date = earnedMap.get(b.id);
      return {
        ...b,
        earned: Boolean(date),
        date: date ? new Date(date).toLocaleDateString() : "",
      };
    });
  }, [attended]);

  const earnedCount = BADGES.filter((b) => b.earned).length;

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header & Progress */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/80 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">My Explorer Passport</h1>
            <p className="text-slate-500 text-lg">
              You have unlocked <strong className="text-slate-900">{earnedCount}</strong> out of <strong className="text-slate-900">{BADGES.length}</strong> badges.
            </p>
            
            {/* Simple Progress Bar */}
            <div className="w-full max-w-md h-3 bg-slate-100 rounded-full mt-4 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ width: `${(earnedCount / BADGES.length) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center border-4 border-slate-200 shadow-inner flex-shrink-0">
            <Award className="w-10 h-10" />
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {BADGES.map((badge, i) => (
            <motion.div 
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`relative rounded-3xl p-6 flex flex-col items-center text-center border-2 transition-all duration-300 ${
                badge.earned 
                  ? "bg-white border-emerald-500 shadow-md hover:shadow-lg hover:-translate-y-1" 
                  : "bg-slate-100/50 border-slate-200 grayscale opacity-80"
              }`}
            >
              {/* Earned Checkmark */}
              {badge.earned && (
                <div className="absolute top-4 right-4 text-emerald-500">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              )}

              {/* Icon / Badge Graphic */}
              <div className={`text-6xl mb-4 drop-shadow-sm ${!badge.earned && "opacity-40"}`}>
                {badge.icon}
              </div>
              
              <h3 className="font-bold text-slate-800 mb-1 leading-tight">{badge.name}</h3>
              
              {badge.earned ? (
                <p className="text-xs text-emerald-700 font-bold bg-emerald-100 px-3 py-1 rounded-full mt-3">
                  Earned {badge.date}
                </p>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mt-3 bg-slate-200/70 px-3 py-1 rounded-full">
                  <Lock className="w-3.5 h-3.5" /> Locked
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}