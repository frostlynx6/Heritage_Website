"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Globe, UserCircle, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import AuthModal from "./AuthModal";
import { useLanguage } from "./LanguageContext";

export default function Navbar() {
  const { data: session, status } = useSession(); 
  const { lang, toggleLanguage, t } = useLanguage(); 
  const router = useRouter();
  const pathname = usePathname();
  
  const [country, setCountry] = useState("SG");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Build nav links from current language
  const navLinks = useMemo(() => ([
    { href: "/", label: t.navHome },
    { href: "/trips", label: t.navTrips },
    { href: "/my-trips", label: t.navMyTrips },
    { href: "/info", label: t.navInfo },
  ]), [t.navHome, t.navTrips, t.navMyTrips, t.navInfo]);

  // Keep dropdown in sync if user clicks the "Back to Singapore" button
  useEffect(() => {
    if (pathname === "/coming-soon") setCountry("CN");
    else setCountry("SG");
  }, [pathname]);

  // Lightly style navbar on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className={`flex justify-between items-center px-6 md:px-8 py-4 sticky top-0 z-50 backdrop-blur-md border-b transition-all ${
        scrolled ? "bg-white/90 border-slate-200 shadow-sm" : "bg-white/70 border-transparent"
      }`}>
        <div className="flex items-center gap-8">
          <Link className="text-2xl font-bold tracking-tighter text-emerald-900 hover:opacity-90 transition" href="/">
            Heritage
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-semibold text-slate-600">
            {navLinks.map(({ href, label }) => {
              const isActive = href === "/" ? pathname === "/" : pathname?.startsWith(href);
              return (
                <div key={href} className="relative">
                  <Link
                    href={href}
                    className={`px-1 pb-1 hover:text-emerald-700 transition-colors ${isActive ? "text-emerald-800" : ""}`}
                  >
                    {label}
                  </Link>
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute left-0 -bottom-0.5 h-0.5 w-full rounded-full bg-emerald-600"
                        initial={{ opacity: 0, y: 2 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -2 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
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
            className="bg-transparent border-none text-sm font-medium cursor-pointer outline-none text-slate-700 hover:text-emerald-700 transition-colors"
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
              className="flex items-center gap-2 bg-emerald-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-emerald-800 transition shadow-md active:scale-[0.98]"
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