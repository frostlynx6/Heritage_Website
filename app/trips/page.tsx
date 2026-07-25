"use client";

import { useEffect, useState } from "react";
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

interface Trip {
  id: string;
  name: string;
  category: "Nature" | "Culture & Heritage" | "Museums & History";
  shortDesc: string;
  fullDesc: string;
  duration: string;
  image: string;
  highlights: string[];
}

const ALL_TRIPS: Trip[] = [
  {
    id: "sungei-buloh",
    name: "Sungei Buloh Wetland Reserve",
    category: "Nature",
    shortDesc: "Discover migratory shorebirds, mangrove forests, and native wildlife along coastal boardwalks.",
    fullDesc: "Singapore's first ASEAN Heritage Park, Sungei Buloh Wetland Reserve is a global stopover point for migratory birds. Roam through lush mangrove boardwalks where you can spot mudskippers, monitor lizards, kingfishers, and estuarine crocodiles in their natural habitat.",
    duration: "2 - 3 Hours",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Migratory Bird Watching", "Mangrove Boardwalks", "Observation Pods", "Biodiversity Trail"]
  },
  {
    id: "rail-corridor",
    name: "Rail Corridor",
    category: "Nature",
    shortDesc: "A continuous 24km green passage following the historic Keretapi Tanah Melayu railway line.",
    fullDesc: "Spanning from Tanjong Pagar in the south to Woodlands in the north, the Rail Corridor connects community spaces and lush ecological corridors. Walk along restored iron truss bridges, past heritage railway stations, and through shaded forest canopies.",
    duration: "2 - 4 Hours",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Historic Truss Bridges", "Bukit Timah Railway Station", "Clementi Forest Views", "Eco-Link Connector"]
  },
  {
    id: "bukit-timah",
    name: "Bukit Timah Nature Reserve",
    category: "Nature",
    shortDesc: "Conquer Singapore's highest hill and wander through pristine primary rainforest.",
    fullDesc: "Home to Singapore's highest natural peak (163m), Bukit Timah Nature Reserve holds one of the richest ecosystems in the world per hectare. Challenge yourself on steep stair trails surrounded by towering dipterocarp trees and ancient granite quarries.",
    duration: "2 - 3 Hours",
    image: "https://images.unsplash.com/photo-1511497584788-8767611136f6?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Summit Peak (163m)", "Hindhede Quarry", "Primary Rainforest", "Rich Flora & Fauna"]
  },
  {
    id: "pulau-ubin",
    name: "Pulau Ubin",
    category: "Culture & Heritage",
    shortDesc: "Step back in time to 1960s Singapore with rustic kampong villages and coastal wetlands.",
    fullDesc: "A short bumboat ride from Changi Point Ferry Terminal, Pulau Ubin offers a glimpse into Singapore's rural past. Cycle along dirt paths under rubber plantations, visit authentic wooden kampongs, and explore the unique intertidal eco-system at Chek Jawa Wetlands.",
    duration: "Half Day",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Chek Jawa Wetlands", "Kampong Life", "Bumboat Ride", "Pekan Quarry"]
  },
  {
    id: "southern-islands",
    name: "Southern Islands",
    category: "Nature",
    shortDesc: "Island hop across St. John's, Lazarus, and Kusu Islands for pristine beaches and coastal heritage.",
    fullDesc: "Escape the city bustle to Singapore's idyllic southern archipelago. Relax on turquoise bay beaches at Lazarus Island, explore marine conservation centers on St. John's Island, and visit historic sacred shrines and temples on Kusu Island.",
    duration: "Full Day",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Lazarus Beach Lagoon", "Marine Park Outreach", "Kusu Da Bo Gong Temple", "Island Hopping"]
  },
  {
    id: "ntu",
    name: "Nanyang Technological University",
    category: "Culture & Heritage",
    shortDesc: "Explore world-renowned modern architecture including 'The Hive' and the iconic ADM building.",
    fullDesc: "NTU is not only a top global university but also a landmark of world-class sustainable architecture. Marvel at 'The Hive' (famously nicknamed the Dim Sum Basket) designed by Heatherwick Studio, walk across the turf-roofed School of Art, Design and Media, and visit the Chinese Heritage Centre.",
    duration: "2 - 3 Hours",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
    highlights: ["The Hive (Heatherwick Studio)", "ADM Grass Roof Building", "Yunnan Garden", "Chinese Heritage Centre"]
  },
  {
    id: "airforce-museum",
    name: "Air Force Museum",
    category: "Museums & History",
    shortDesc: "Trace the history and aviation feats of the Republic of Singapore Air Force (RSAF).",
    fullDesc: "Located next to Paya Lebar Air Base, the Air Force Museum blends physical aviation heritage with interactive displays. Walk through outdoor static displays featuring historic jet fighters, tactical helicopters, and anti-aircraft missiles that defended Singapore's skies.",
    duration: "1.5 - 2 Hours",
    image: "https://images.unsplash.com/photo-1519074069444-1ba4eae287b6?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Outdoor Aircraft Gallery", "Flight Simulators", "Historic Jet Fighters", "RSAF Heritage Displays"]
  },
  {
    id: "navy-museum",
    name: "Navy Museum",
    category: "Museums & History",
    shortDesc: "Uncover Singapore's maritime defence heritage and the operational journey of the RSN.",
    fullDesc: "Situated at Changi Naval Base, the Navy Museum details how the Republic of Singapore Navy transformed from two wooden boats into a sophisticated modern maritime force. Discover submarine simulators, historic ship weaponry, and naval strategy exhibits.",
    duration: "1.5 - 2 Hours",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Submarine Simulator", "Maritime Defence Exhibits", "Naval Guns & Missiles", "Interactive Ship Deck"]
  },
  {
    id: "coney-island",
    name: "Coney Island Park",
    category: "Nature",
    shortDesc: "A rustic coastal sanctuary featuring tall Casuarina trees, hidden beaches, and bird hides.",
    fullDesc: "Nestled off the coast of Punggol, Coney Island Park retains its wild charm with coastal forests, mangroves, and grasslands. Cycle along gravel trails, spot rare migratory birds from timber hides, and discover secluded sandy beaches along the Serangoon Reservoir.",
    duration: "2 - 3 Hours",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Casuarina Woodlands", "Coastal Boardwalks", "Bird Watching Hides", "Eco-friendly Park Architecture"]
  },
  {
    id: "botanic-gardens",
    name: "Singapore Botanic Gardens",
    category: "Culture & Heritage",
    shortDesc: "Singapore's first UNESCO World Heritage Site featuring tropical flora and the National Orchid Garden.",
    fullDesc: "Established in 1859, this 82-hectare botanical sanctuary is a masterpiece of landscape design. Stroll past historic gazebos, feed swans at Symphony Lake, and marvel at thousands of rare orchid hybrids inside the famous National Orchid Garden.",
    duration: "2 - 4 Hours",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80",
    highlights: ["UNESCO Heritage Site", "National Orchid Garden", "The Bandstand Gazebo", "Symphony Lake"]
  }
];

const CATEGORIES = ["All", "Nature", "Culture & Heritage", "Museums & History"] as const;

export default function AvailableTrips() {
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
    : ALL_TRIPS.filter(t => t.category === selectedCategory);

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
              <Sparkles className="w-3.5 h-3.5" /> Curated Singapore Heritage Trails
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Available Trips
            </h1>
            <p className="text-slate-600 mt-2 text-lg font-light">
              Explore 10 signature destinations across Singapore. Mark your visits to earn unique badges!
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
              <p className="text-xs text-slate-500 font-medium">Attended Places</p>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of 10 Trip Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTrips.map((trip) => {
            const isAttended = attendedIds.includes(trip.id);

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
                    alt={trip.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    {trip.category}
                  </span>

                  {/* Attended Badge Indicator on Card */}
                  {isAttended && (
                    <span className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Attended
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
                      {trip.name}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-2 font-normal leading-relaxed">
                      {trip.shortDesc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:translate-x-1 transition-transform">
                    <span>View Details & Highlights</span>
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
                    alt={activeTrip.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {activeTrip.category}
                    </span>
                    <h2 className="text-3xl font-extrabold mt-2 drop-shadow-md">
                      {activeTrip.name}
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
                  <h3 className="text-lg font-bold text-slate-900 mb-2">About this Location</h3>
                  <p className="text-slate-600 leading-relaxed text-sm mb-6">
                    {activeTrip.fullDesc}
                  </p>

                  <h3 className="text-lg font-bold text-slate-900 mb-3">Key Highlights</h3>
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {activeTrip.highlights.map((highlight, idx) => (
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
                          ? "Marked as Attended (Click to Undo)"
                          : "Mark as Attended"
                        : "Log in to mark as attended"}
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