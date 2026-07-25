"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  X, 
  CheckCircle, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Compass, 
  Award 
} from "lucide-react";
import { useSession } from "next-auth/react";
import AuthModal from "../../components/AuthModal";
import { useLanguage } from "../../components/LanguageContext";

type Lang = "EN" | "ZH";

interface Trip {
  id: string;
  // Category as an id; display localized via t
  category: "Nature" | "Culture" | "Museums";
  name: Record<Lang, string>;
  shortDesc: Record<Lang, string>;
  fullDesc: Record<Lang, string>;
  duration: string;
  image: string;
  highlights: Record<Lang, string[]>;
}

const ALL_TRIPS: Trip[] = [
  {
    id: "sungei-buloh",
    name: { EN: "Sungei Buloh Wetland Reserve", ZH: "双溪布洛湿地保护区" },
    category: "Nature",
    shortDesc: {
      EN: "Discover migratory shorebirds, mangrove forests, and native wildlife along coastal boardwalks.",
      ZH: "在海岸栈道上邂逅候鸟、红树林与本土野生动物。",
    },
    fullDesc: {
      EN: "Singapore's first ASEAN Heritage Park, Sungei Buloh Wetland Reserve is a global stopover point for migratory birds. Roam through lush mangrove boardwalks where you can spot mudskippers, monitor lizards, kingfishers, and estuarine crocodiles in their natural habitat.",
      ZH: "作为新加坡首个东盟遗产公园，双溪布洛湿地保护区是候鸟的重要中转站。漫步在郁郁葱葱的红树林栈道上，可观赏弹涂鱼、巨蜥、翠鸟及河口鳄等野生动物。",
    },
    duration: "2 - 3 Hours",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    highlights: {
      EN: ["Migratory Bird Watching", "Mangrove Boardwalks", "Observation Pods", "Biodiversity Trail"],
      ZH: ["观赏候鸟", "红树林栈道", "观景舱", "生物多样性步道"],
    }
  },
  {
    id: "rail-corridor",
    name: { EN: "Rail Corridor", ZH: "铁路走廊" },
    category: "Nature",
    shortDesc: {
      EN: "A continuous 24km green passage following the historic Keretapi Tanah Melayu railway line.",
      ZH: "沿着历史铁路延伸 24 公里的连续绿带。",
    },
    fullDesc: {
      EN: "Spanning from Tanjong Pagar in the south to Woodlands in the north, the Rail Corridor connects community spaces and lush ecological corridors. Walk along restored iron truss bridges, past heritage railway stations, and through shaded forest canopies.",
      ZH: "铁路走廊北起兀兰，南至丹戎巴葛，串联起社区空间与生态绿廊。徜徉于修复的钢桁架桥，漫步旧时车站与林荫步道。",
    },
    duration: "2 - 4 Hours",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    highlights: {
      EN: ["Historic Truss Bridges", "Bukit Timah Railway Station", "Clementi Forest Views", "Eco-Link Connector"],
      ZH: ["历史钢桁架桥", "武吉知马火车站", "金文泰森林景观", "生态连桥"],
    }
  },
  {
    id: "bukit-timah",
    name: { EN: "Bukit Timah Nature Reserve", ZH: "武吉知马自然保护区" },
    category: "Nature",
    shortDesc: { EN: "Conquer Singapore's highest hill and wander through pristine primary rainforest.", ZH: "攀登新加坡最高丘陵，漫步原始热带雨林。" },
    fullDesc: { EN: "Home to Singapore's highest natural peak (163m), Bukit Timah Nature Reserve holds one of the richest ecosystems in the world per hectare. Challenge yourself on steep stair trails surrounded by towering dipterocarp trees and ancient granite quarries.", ZH: "这里拥有新加坡最高的自然坡峰（163 米），单位面积生态多样性位居前列。沿陡峭阶梯穿越高大龙脑香科树林与古老花岗岩采石场。" },
    duration: "2 - 3 Hours",
    image: "https://images.unsplash.com/photo-1511497584788-8767611136f6?auto=format&fit=crop&w=1200&q=80",
    highlights: { EN: ["Summit Peak (163m)", "Hindhede Quarry", "Primary Rainforest", "Rich Flora & Fauna"], ZH: ["山顶（163 米）", "欣德希德采石场", "原始雨林", "丰富动植物"] }
  },
  {
    id: "pulau-ubin",
    name: { EN: "Pulau Ubin", ZH: "乌敏岛" },
    category: "Culture",
    shortDesc: { EN: "Step back in time to 1960s Singapore with rustic kampong villages and coastal wetlands.", ZH: "回到 20 世纪 60 年代的新加坡，感受朴实甘榜与海岸湿地。" },
    fullDesc: { EN: "A short bumboat ride from Changi Point Ferry Terminal, Pulau Ubin offers a glimpse into Singapore's rural past. Cycle along dirt paths under rubber plantations, visit authentic wooden kampongs, and explore the unique intertidal eco-system at Chek Jawa Wetlands.", ZH: "从樟宜码头乘舢板片刻即达，这里展现新加坡的乡野旧貌。骑行穿过橡胶林土路，走进传统木屋甘榜，并探访切爪哇独特的潮间带生态。" },
    duration: "Half Day",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    highlights: { EN: ["Chek Jawa Wetlands", "Kampong Life", "Bumboat Ride", "Pekan Quarry"], ZH: ["切爪哇湿地", "甘榜生活", "舢板船", "碧江采石场"] }
  },
  {
    id: "southern-islands",
    name: { EN: "Southern Islands", ZH: "南部海岛" },
    category: "Nature",
    shortDesc: { EN: "Island hop across St. John's, Lazarus, and Kusu Islands for pristine beaches and coastal heritage.", ZH: "穿梭圣约翰、拉撒路与龟屿，享受原生态海滩与海岸遗产。" },
    fullDesc: { EN: "Escape the city bustle to Singapore's idyllic southern archipelago. Relax on turquoise bay beaches at Lazarus Island, explore marine conservation centers on St. John's Island, and visit historic sacred shrines and temples on Kusu Island.", ZH: "远离闹市，走进恬静的南部海岛。拉撒路岛碧湾沙滩适合休憩，圣约翰岛可了解海洋保育，龟屿则有历史悠久的庙宇与圣地。" },
    duration: "Full Day",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    highlights: { EN: ["Lazarus Beach Lagoon", "Marine Park Outreach", "Kusu Da Bo Gong Temple", "Island Hopping"], ZH: ["拉撒路泻湖海滩", "海洋公园教育", "龟屿大伯公庙", "跳岛之旅"] }
  },
  {
    id: "ntu",
    name: { EN: "Nanyang Technological University", ZH: "南洋理工大学" },
    category: "Culture",
    shortDesc: { EN: "Explore world-renowned modern architecture including 'The Hive' and the iconic ADM building.", ZH: "探索世界知名的现代建筑，包括“蜂巢”与标志性的 ADM 大楼。" },
    fullDesc: { EN: "NTU is not only a top global university but also a landmark of world-class sustainable architecture. Marvel at 'The Hive' (famously nicknamed the Dim Sum Basket) designed by Heatherwick Studio, walk across the turf-roofed School of Art, Design and Media, and visit the Chinese Heritage Centre.", ZH: "南大既是顶尖学府，也以可持续建筑著称。欣赏赫斯维克工作室设计的“蜂巢”，漫步草皮屋顶的艺术设计与媒体学院，并参观华裔馆。" },
    duration: "2 - 3 Hours",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
    highlights: { EN: ["The Hive (Heatherwick Studio)", "ADM Grass Roof Building", "Yunnan Garden", "Chinese Heritage Centre"], ZH: ["蜂巢（赫斯维克）", "ADM 草皮屋顶", "云南园", "华裔馆"] }
  },
  {
    id: "airforce-museum",
    name: { EN: "Air Force Museum", ZH: "空军博物馆" },
    category: "Museums",
    shortDesc: { EN: "Trace the history and aviation feats of the Republic of Singapore Air Force (RSAF).", ZH: "探索新加坡空军（RSAF）的历史与飞航成就。" },
    fullDesc: { EN: "Located next to Paya Lebar Air Base, the Air Force Museum blends physical aviation heritage with interactive displays. Walk through outdoor static displays featuring historic jet fighters, tactical helicopters, and anti-aircraft missiles that defended Singapore's skies.", ZH: "毗邻巴耶利峇空军基地，博物馆结合实物航空遗产与互动展陈。室外静态展出多款历史战机、直升机与防空导弹。" },
    duration: "1.5 - 2 Hours",
    image: "https://images.unsplash.com/photo-1519074069444-1ba4eae287b6?auto=format&fit=crop&w=1200&q=80",
    highlights: { EN: ["Outdoor Aircraft Gallery", "Flight Simulators", "Historic Jet Fighters", "RSAF Heritage Displays"], ZH: ["室外飞机展区", "飞行模拟", "历史喷气战机", "空军遗产展示"] }
  },
  {
    id: "navy-museum",
    name: { EN: "Navy Museum", ZH: "海军博物馆" },
    category: "Museums",
    shortDesc: { EN: "Uncover Singapore's maritime defence heritage and the operational journey of the RSN.", ZH: "了解新加坡海军的发展历程与海防遗产。" },
    fullDesc: { EN: "Situated at Changi Naval Base, the Navy Museum details how the Republic of Singapore Navy transformed from two wooden boats into a sophisticated modern maritime force. Discover submarine simulators, historic ship weaponry, and naval strategy exhibits.", ZH: "位于樟宜海军基地，博物馆讲述新加坡海军从两艘木船成长为现代海上力量的历程。可体验潜艇模拟、了解舰艇武器与海军战略。" },
    duration: "1.5 - 2 Hours",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    highlights: { EN: ["Submarine Simulator", "Maritime Defence Exhibits", "Naval Guns & Missiles", "Interactive Ship Deck"], ZH: ["潜艇模拟", "海防展陈", "舰炮与导弹", "互动甲板"] }
  },
  {
    id: "coney-island",
    name: { EN: "Coney Island Park", ZH: "康尼岛公园" },
    category: "Nature",
    shortDesc: { EN: "A rustic coastal sanctuary featuring tall Casuarina trees, hidden beaches, and bird hides.", ZH: "质朴的海岸净地，高大的木麻黄林、隐秘海滩与观鸟屋。" },
    fullDesc: { EN: "Nestled off the coast of Punggol, Coney Island Park retains its wild charm with coastal forests, mangroves, and grasslands. Cycle along gravel trails, spot rare migratory birds from timber hides, and discover secluded sandy beaches along the Serangoon Reservoir.", ZH: "位于榜鹅海岸外，康尼岛保留了野趣：有海岸林、红树林与草地。骑行碎石道、在木质隐蔽处观赏候鸟，并探访宁静沙滩。" },
    duration: "2 - 3 Hours",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    highlights: { EN: ["Casuarina Woodlands", "Coastal Boardwalks", "Bird Watching Hides", "Eco-friendly Park Architecture"], ZH: ["木麻黄林地", "海岸步道", "观鸟屋", "生态友好公园建筑"] }
  },
  {
    id: "botanic-gardens",
    name: { EN: "Singapore Botanic Gardens", ZH: "新加坡植物园" },
    category: "Culture",
    shortDesc: { EN: "Singapore's first UNESCO World Heritage Site featuring tropical flora and the National Orchid Garden.", ZH: "新加坡首个联合国教科文组织世界遗产，热带植物与国家胡姬园闻名遐迩。" },
    fullDesc: { EN: "Established in 1859, this 82-hectare botanical sanctuary is a masterpiece of landscape design. Stroll past historic gazebos, feed swans at Symphony Lake, and marvel at thousands of rare orchid hybrids inside the famous National Orchid Garden.", ZH: "始建于 1859 年，占地 82 公顷，是园林设计杰作。漫步历史凉亭、在交响乐湖观赏天鹅，并于胡姬园欣赏成千上万的珍稀兰花。" },
    duration: "2 - 4 Hours",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80",
    highlights: { EN: ["UNESCO Heritage Site", "National Orchid Garden", "The Bandstand Gazebo", "Symphony Lake"], ZH: ["联合国教科文组织世界遗产", "国家胡姬园", "乐台凉亭", "交响乐湖"] }
  }
];

const CATEGORY_IDS = ["All", "Nature", "Culture", "Museums"] as const;

export default function AvailableTrips() {
  const { t, lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  
  // Track attended trip IDs in state
  const [attendedIds, setAttendedIds] = useState<string[]>([]);
  const { data: session } = useSession();
  const [showAuth, setShowAuth] = useState(false);

  // Load attended trips for logged-in user
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!session?.user) return;
      try {
        const res = await fetch("/api/attendance", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setAttendedIds((data.attended as { tripId: string }[]).map((b) => b.tripId));
        }
      } catch {}
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [session?.user]);

  // Filter trips based on selected tab
  const filteredTrips = selectedCategory === "All" 
    ? ALL_TRIPS 
    : ALL_TRIPS.filter(tr => tr.category === selectedCategory);

  const toggleAttended = async (tripId: string) => {
    if (!session?.user) {
      setShowAuth(true);
      return;
    }
    const isAlready = attendedIds.includes(tripId);
    try {
      const res = await fetch("/api/attendance", {
        method: isAlready ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId }),
      });
      if (res.ok) {
        setAttendedIds((prev) =>
          isAlready ? prev.filter((id) => id !== tripId) : [...prev, tripId]
        );
      }
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" /> {t.curatedPill}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              {t.tripsTitle}
            </h1>
            <p className="text-slate-600 mt-2 text-lg font-light">
              {t.tripsSubtitle}
            </p>
          </div>

          {/* Attended Badge Counter */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {attendedIds.length} <span className="text-slate-400 text-sm font-normal">/ 10</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{t.attendedCounterLabel}</p>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-4">
          {CATEGORY_IDS.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat === "All" ? t.catAll : cat === "Nature" ? t.catNature : cat === "Culture" ? t.catCulture : t.catMuseums}
            </button>
          ))}
        </div>

        {/* Grid of 10 Trip Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTrips.map((trip) => {
            const isAttended = attendedIds.includes(trip.id);
            const displayName = trip.name[lang as Lang];
            const displayShort = trip.shortDesc[lang as Lang];
            const displayCategory = trip.category === "Nature" ? t.catNature : trip.category === "Culture" ? t.catCulture : t.catMuseums;

            return (
              <motion.div
                key={trip.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                onClick={() => setActiveTrip(trip)}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col group relative"
              >
                {/* Image Container */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={trip.image}
                    alt={displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    {displayCategory}
                  </span>

                  {/* Attended Badge Indicator on Card */}
                  {isAttended && (
                    <span className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> {t.attendedPill}
                    </span>
                  )}

                  {/* Duration Tag */}
                  <div className="absolute bottom-3 left-4 text-white text-xs font-medium flex items-center gap-1.5 drop-shadow">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    {trip.duration}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors duration-200 mb-2">
                      {displayName}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-2 font-normal leading-relaxed">
                      {displayShort}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:translate-x-1 transition-transform">
                    <span>{t.viewDetails}</span>
                    <Compass className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Modal Popup */}
        <AnimatePresence>
          {activeTrip && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              {/* Dark Glass Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveTrip(null)}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
              />

              {/* Modal Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.25 }}
                className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl z-10 my-8 border border-slate-100"
              >
                {/* Close Button */}
                <button
                  onClick={() => setActiveTrip(null)}
                  className="absolute top-4 right-4 z-20 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full p-2 backdrop-blur-md transition"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Modal Header Image */}
                <div className="relative h-72 w-full bg-slate-200">
                  <img
                    src={activeTrip.image}
                    alt={activeTrip.name[lang as Lang]}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {activeTrip.category}
                    </span>
                    <h2 className="text-3xl font-extrabold mt-2 drop-shadow-md">
                      {activeTrip.name[lang as Lang]}
                    </h2>
                    <div className="flex items-center gap-4 mt-2 text-xs font-medium text-slate-300">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" /> {activeTrip.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Singapore
                      </span>
                    </div>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 sm:p-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{t.aboutThisLocation}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm mb-6">
                    {activeTrip.fullDesc[lang as Lang]}
                  </p>

                  <h3 className="text-lg font-bold text-slate-900 mb-3">{t.keyHighlights}</h3>
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {activeTrip.highlights[lang as Lang].map((highlight, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs font-medium text-slate-700"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Mark as Attended Toggle Button */}
                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={() => toggleAttended(activeTrip.id)}
                      className={`w-full py-4 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                        attendedIds.includes(activeTrip.id)
                          ? "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20"
                          : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
                      }`}
                    >
                      <CheckCircle className="w-5 h-5" />
                      {session?.user
                        ? attendedIds.includes(activeTrip.id)
                          ? t.markedAsAttendedUndo
                          : t.markAsAttended
                        : t.loginToMark}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        {/* Auth popup for gating actions when logged out */}
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      </div>
    </div>
  );
}