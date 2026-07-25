"use client";
import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "./LanguageContext";
import { BadgesProvider } from "./BadgesContext";

// Notice the { children } here!
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <BadgesProvider>
          {children}
        </BadgesProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}