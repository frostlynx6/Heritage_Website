"use client";
import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface MarkerData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  blurb: string;
}

export default function SingaporeMapPage() {
  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);

  const markers: MarkerData[] = useMemo(() => ([
    { id: "sungei-buloh", name: "Sungei Buloh Wetland Reserve", lat: 1.445, lng: 103.729, blurb: "Mangroves & migratory birds." },
    { id: "rail-corridor", name: "Rail Corridor (Bukit Timah)", lat: 1.339, lng: 103.786, blurb: "Historic truss bridges & green trail." },
    { id: "bukit-timah", name: "Bukit Timah Nature Reserve", lat: 1.3496, lng: 103.7798, blurb: "Singapore's highest natural peak." },
    { id: "pulau-ubin", name: "Pulau Ubin", lat: 1.409, lng: 103.96, blurb: "Rustic kampong & Chek Jawa." },
    { id: "southern-islands", name: "Southern Islands (Lazarus/St John's)", lat: 1.225, lng: 103.86, blurb: "Pristine beaches & coastal heritage." },
    { id: "ntu", name: "Nanyang Technological University", lat: 1.3483, lng: 103.683, blurb: "Iconic modern campus architecture." },
    { id: "airforce-museum", name: "Air Force Museum (RSAF)", lat: 1.357, lng: 103.902, blurb: "Aviation heritage & displays." },
    { id: "navy-museum", name: "Navy Museum (Changi Naval Base)", lat: 1.341, lng: 104.02, blurb: "Maritime defence heritage." },
    { id: "coney-island", name: "Coney Island Park", lat: 1.415, lng: 103.916, blurb: "Casuarina woodlands & birdlife." },
    { id: "botanic-gardens", name: "Singapore Botanic Gardens", lat: 1.3138, lng: 103.8159, blurb: "UNESCO World Heritage Site." },
  ]), []);

  useEffect(() => {
    let destroyed = false;
    async function init() {
      const L = await import("leaflet");
      if (destroyed || !mapEl.current || mapRef.current) return;
      const center: [number, number] = [1.3521, 103.8198];
      const map = L.map(mapEl.current).setView(center, 11);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);
      markers.forEach((m) => {
        const marker = L.circleMarker([m.lat, m.lng], {
          radius: 8,
          color: "#0ea5e9",
          fillColor: "#10b981",
          fillOpacity: 0.9,
          weight: 2,
        }).addTo(map);
        marker.bindPopup(`
          <div style="font-weight:700;color:#0f172a;margin-bottom:2px;">${m.name}</div>
          <div style="color:#475569;font-size:12px;margin-bottom:6px;">${m.blurb}</div>
          <a href="/trips" style="color:#047857;font-weight:600;font-size:12px;text-decoration:underline;">View in Trips</a>
        `);
      });
      mapRef.current = map;
    }
    init();
    return () => {
      destroyed = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [markers]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <Link href="/info" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" /> Back to Information
          </Link>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-4">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-3">Singapore Interactive Map</h1>
          <p className="text-slate-500 text-sm mb-4">Explore the 10 featured locations. Click pins for details.</p>
          <div className="rounded-xl overflow-hidden">
            <div ref={mapEl} className="h-[70vh] w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
