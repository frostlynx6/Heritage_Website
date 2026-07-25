"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Compass, Award, Map, Send } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../components/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<null | { ok: boolean; error?: string }>(null);

  const remaining = 500 - message.length;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setResult({ ok: true });
        setName("");
        setEmail("");
        setMessage("");
      } else {
        const data = await res.json().catch(() => ({}));
        setResult({ ok: false, error: data?.error || "Failed to send" });
      }
    } catch (e) {
      setResult({ ok: false, error: "Network error" });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <main className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image (High-quality Singapore landscape) */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=2000&q=80')" }}
        />
        {/* Elegant Dark Overlay */}
        <div className="absolute inset-0 z-10 bg-black/40 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Hero Content */}
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto mt-16">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg"
          >
            {t.heroTitle1} <br/>
            <span className="text-emerald-400">{t.heroTitle2}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-2xl text-gray-200 mb-10 font-light drop-shadow-md max-w-2xl mx-auto"
          >
            {t.heroDesc}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <Link 
              href="/trips" 
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 shadow-[0_0_20px_rgba(5,150,105,0.4)] hover:shadow-[0_0_30px_rgba(5,150,105,0.6)] inline-flex items-center gap-2"
            >
              <Compass className="w-5 h-5" />
              {t.startExploring}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          {[
            {
              icon: <Map className="w-8 h-8 text-emerald-700" />,
              title: t.featureTrailsTitle,
              desc: t.featureTrailsDesc,
            },
            {
              icon: <Award className="w-8 h-8 text-emerald-700" />,
              title: t.featureBadgesTitle,
              desc: t.featureBadgesDesc,
            },
            {
              icon: <Compass className="w-8 h-8 text-emerald-700" />,
              title: t.featureInsightsTitle,
              desc: t.featureInsightsDesc,
            },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center p-8 rounded-3xl hover:bg-gray-50 transition-colors duration-300 border border-transparent hover:border-gray-100"
            >
              <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/80"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">{t.feedbackTitle}</h2>
                <p className="text-slate-500 mt-1">{t.feedbackDesc}</p>
              </div>
            </div>

            {result?.ok && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium">
                {t.feedbackSuccess}
              </div>
            )}
            {result && !result.ok && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-medium">
                {result.error || t.feedbackError}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{t.nameLabel}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 100))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                    placeholder={t.namePlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{t.emailLabel}</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value.slice(0, 200))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                    placeholder={t.emailPlaceholder}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-semibold text-slate-700">{t.messageLabel}</label>
                  <span className={`text-xs ${remaining < 50 ? "text-amber-600" : "text-slate-400"}`}>{remaining} {t.charsLeft}</span>
                </div>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                  maxLength={500}
                  rows={5}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                  placeholder={t.messagePlaceholder}
                />
              </div>

              <div className="pt-2">
                <button
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
                >
                  {submitting ? t.sending : t.sendFeedback}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}