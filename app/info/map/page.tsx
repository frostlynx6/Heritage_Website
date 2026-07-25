"use client";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then(m => m.CircleMarker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });

interface MarkerData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  blurb: string;
}

export default function SingaporeMapPage() {
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

  const center: [number, number] = [1.3521, 103.8198];

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
            <MapContainer center={center} zoom={11} scrollWheelZoom className="h-[70vh] w-full">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {markers.map(m => (
                <CircleMarker key={m.id} center={[m.lat, m.lng]} radius={8} pathOptions={{ color: '#0ea5e9', fillColor: '#10b981', fillOpacity: 0.9 }}>
                  <Popup>
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900">{m.name}</div>
                      <div className="text-slate-600 text-sm">{m.blurb}</div>
                      <Link href="/trips" className="text-emerald-700 text-sm font-semibold hover:underline">View in Trips</Link>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
