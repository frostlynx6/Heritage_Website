"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, ArrowLeft } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[85vh] bg-slate-50 p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 max-w-lg w-full"
      >
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">China Heritage Trails</h1>
        <p className="text-slate-500 text-lg mb-8">
          We are currently curating the best historical routes across China. This feature will be available in our next major update!
        </p>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Singapore
        </Link>
      </motion.div>
    </div>
  );
}