"use client";
import { createContext, useContext, useState } from "react";

export const translations = {
  EN: {
    navHome: "Home",
    navTrips: "Available Trips",
    navMyTrips: "My Trips",
    navInfo: "Information",
    navLogin: "Log In / Sign Up",
    heroTitle1: "Discover Singapore's",
    heroTitle2: "Living Heritage",
    heroDesc: "Embark on curated trails, collect exclusive badges, and uncover the hidden stories behind the Lion City.",
    startExploring: "Start Exploring",
  },
  ZH: {
    navHome: "首页",
    navTrips: "可选行程",
    navMyTrips: "我的行程",
    navInfo: "信息",
    navLogin: "登录 / 注册",
    heroTitle1: "探索新加坡的",
    heroTitle2: "活态遗产",
    heroDesc: "踏上精心策划的路线，收集专属徽章，揭开狮城背后的隐藏故事。",
    startExploring: "开始探索",
  }
};

const LanguageContext = createContext<any>(null);

// Notice the { children } here!
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<"EN" | "ZH">("EN");
  const t = translations[lang];

  const toggleLanguage = () => setLang(lang === "EN" ? "ZH" : "EN");

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);