"use client";
import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "./LanguageContext";

// Notice the { children } here!
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </SessionProvider>
  );
}