"use client";
import { Map, Train, Info as InfoIcon } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../../components/LanguageContext";

export default function Information() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <InfoIcon className="w-10 h-10 text-emerald-600" />
          {t.visitorInfoTitle}
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Map Section */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Map className="w-6 h-6 text-emerald-600" />
              {t.overviewMapTitle}
            </h2>
            <Link href="/info/map" className="block group">
              <div className="rounded-2xl overflow-hidden bg-gray-100">
                <Image 
                  src="/images/SG-EPS-01-0001.png"
                  alt="Singapore Map Overview"
                  width={1600}
                  height={1000}
                  className="w-full h-auto object-cover group-hover:scale-105 transition duration-500"
                  priority
                />
              </div>
            </Link>
            <p className="text-gray-500 text-sm mt-4">
              {t.overviewMapDesc}
            </p>
          </motion.div>

          {/* MRT Section */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Train className="w-6 h-6 text-emerald-600" />
              {t.mrtMapTitle}
            </h2>
            <Link href="/info/mrt" className="block group">
              <div className="rounded-2xl overflow-hidden bg-gray-100">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcSVb7_zudSRvGJDa9aTg2uksJjkB_3LU6vnHnmOS07HJQjorrN46HaORrO2u2yW6oK0FB6-9ADj1h0obiM" 
                  alt="Singapore MRT Route Map" 
                  className="w-full h-auto object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
            </Link>
            <p className="text-gray-500 text-sm mt-4">
              {t.mrtMapDesc}
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}