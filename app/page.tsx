"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Compass, Award, Map } from "lucide-react";

export default function Home() {
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
            Discover Singapore's <br/>
            <span className="text-emerald-400">Living Heritage</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-2xl text-gray-200 mb-10 font-light drop-shadow-md max-w-2xl mx-auto"
          >
            Embark on curated trails, collect exclusive badges, and uncover the hidden stories behind the Lion City.
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
              Start Exploring
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
              title: "Curated Trails",
              desc: "From the lush Rail Corridor to the historic shores of Pulau Ubin, explore handpicked routes."
            },
            {
              icon: <Award className="w-8 h-8 text-emerald-700" />,
              title: "Earn Badges",
              desc: "Check in at iconic landmarks to unlock unique digital badges and build your heritage passport."
            },
            {
              icon: <Compass className="w-8 h-8 text-emerald-700" />,
              title: "Deep Insights",
              desc: "Learn the rich history, culture, and architecture that shaped modern Singapore."
            }
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
    </main>
  );
}