"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Globe, UserCircle, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import AuthModal from "./AuthModal";
import { useLanguage } from "./LanguageContext";

export default function Navbar() {
  const { data: session, status } = useSession(); 
  const { lang, toggleLanguage, t } = useLanguage(); 
  const router = useRouter();
  const pathname = usePathname();
  
  const [country, setCountry] = useState("SG");
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Keep dropdown in sync if user clicks the "Back to Singapore" button
  useEffect(() => {
    if (pathname === "/coming-soon") setCountry("CN");
    else setCountry("SG");
  }, [pathname]);

  return (
    <>
      <nav className="flex justify-between items-center p-6 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-8">
          <Link className="text-2xl font-bold tracking-tighter text-emerald-900" href="/">
            Heritage
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
            <Link className="hover:text-emerald-600 transition" href="/">{t.navHome}</Link>
            <Link className="hover:text-emerald-600 transition" href="/trips">{t.navTrips}</Link>
            <Link className="hover:text-emerald-600 transition" href="/my-trips">{t.navMyTrips}</Link>
            <Link className="hover:text-emerald-600 transition" href="/info">{t.navInfo}</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <select 
            value={country} 
            onChange={(e) => {
              const val = e.target.value;
              setCountry(val);
              if (val === "CN") router.push("/coming-soon");
              else router.push("/");
            }}
            className="bg-transparent border-none text-sm font-medium cursor-pointer outline-none text-slate-700"
          >
            <option value="SG">Singapore 🇸🇬</option>
            <option value="CN">China 🇨🇳</option>
          </select>

          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-sm font-medium hover:text-emerald-600 text-slate-700 transition mr-4"
          >
            <Globe className="w-4 h-4"/> {lang}
          </button>

          {status === "loading" ? (
            <div className="w-24 h-10 bg-slate-100 animate-pulse rounded-full" />
          ) : session?.user ? (
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 py-1.5 pl-1.5 pr-4 rounded-full shadow-sm">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                {session.user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="text-sm font-semibold text-slate-700">
                {session.user.name?.split(" ")[0]}
              </span>
              <button 
                onClick={() => signOut()}
                className="ml-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-4 h-4"/>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-2 bg-emerald-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-emerald-800 transition shadow-md"
            >
              <UserCircle className="w-5 h-5"/>
              {t.navLogin}
            </button>
          )}
        </div>
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}