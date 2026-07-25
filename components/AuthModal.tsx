"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLanguage } from "./LanguageContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const { t } = useLanguage();
  
  // State to toggle between Login and Sign Up
  const [isLogin, setIsLogin] = useState(true);
  
  // Form input states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // UI states for loading and error messages
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isLogin) {
        // --- LOG IN LOGIC ---
        const res = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (res?.error) {
          setError(t.invalidCreds);
        } else {
          // Success! Refresh page to update the Navbar and close modal
          router.refresh();
          onClose();
        }
      } else {
        // --- SIGN UP LOGIC ---
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || t.somethingWrong);
        } else {
          // Success! Automatically log them in after signing up
          await signIn("credentials", {
            redirect: false,
            email,
            password,
          });
          router.refresh();
          onClose();
        }
      }
    } catch (err) {
      setError(t.unexpectedError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl z-10 border border-slate-100"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 text-slate-400 hover:text-slate-900 bg-slate-100/50 hover:bg-slate-100 rounded-full p-2 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 sm:p-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {isLogin ? t.welcomeBack : t.createAccount}
                </h2>
                <p className="text-slate-500 mt-2 text-sm">
                  {isLogin ? t.loginDesc : t.signupDesc}
                </p>
              </div>

              {/* Error Message Display */}
              {error && (
                <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 text-center">
                  {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                      type="text" 
                      placeholder={t.fullName}
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    />
                  </div>
                )}
                
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="email" 
                    placeholder={t.email}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="password" 
                    placeholder={t.password}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  />
                </div>

                <button 
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-white font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 mt-6"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {isLogin ? t.login : t.signup}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-slate-500">
                  {isLogin ? t.noAccount : t.haveAccount}{" "}
                  <button 
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError(""); // Clear errors when switching
                    }}
                    className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
                  >
                    {isLogin ? t.switchToSignup : t.switchToLogin}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}