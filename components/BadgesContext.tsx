"use client";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type AttendedEntry = { tripId: string; earnedAt?: string };

type BadgeContextType = {
  attendedIds: string[];
  attended: AttendedEntry[];
  loading: boolean;
  refresh: () => Promise<void>;
  toggle: (tripId: string) => Promise<void>;
};

const BadgesContext = createContext<BadgeContextType | undefined>(undefined);

export function BadgesProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [attended, setAttended] = useState<AttendedEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!session?.user) {
      setAttended([]);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/attendance", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const arr = Array.isArray(data.attended) ? data.attended : [];
        setAttended(arr);
      }
    } finally {
      setLoading(false);
    }
  }, [session?.user]);

  useEffect(() => {
    (async () => {
      if (!session?.user) {
        setAttended([]);
        return;
      }
      await refresh();
    })();
  }, [session?.user, refresh]);

  const toggle = useCallback(
    async (tripId: string) => {
      if (!session?.user) return;
      const isAlready = attended.some((a) => a.tripId === tripId);

      // Optimistic update for instant UI feedback
      if (isAlready) {
        setAttended((prev) => prev.filter((a) => a.tripId !== tripId));
      } else {
        setAttended((prev) => [{ tripId, earnedAt: new Date().toISOString() }, ...prev]);
      }

      try {
        const res = await fetch("/api/attendance", {
          method: isAlready ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tripId }),
        });
        if (!res.ok) {
          await refresh(); // rollback via server truth on error
        }
      } catch {
        await refresh();
      }
    },
    [session?.user, attended, refresh]
  );

  const value: BadgeContextType = {
    attendedIds: attended.map((a) => a.tripId),
    attended,
    loading,
    refresh,
    toggle,
  };

  return <BadgesContext.Provider value={value}>{children}</BadgesContext.Provider>;
}

export function useBadges() {
  const ctx = useContext(BadgesContext);
  if (!ctx) throw new Error("useBadges must be used within BadgesProvider");
  return ctx;
}
