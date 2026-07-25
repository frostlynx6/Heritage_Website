"use client";
import Link from "next/link";
import { ArrowLeft, ZoomIn, ZoomOut } from "lucide-react";
import { useRef, useState } from "react";

export default function MRTMapPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [zoom, setZoom] = useState(125);

  const src = `/pdf/SM_Eng_(Ver280225)_Hume.pdf#zoom=${zoom}`;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link href="/info" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" /> Back to Information
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"><ZoomOut className="w-4 h-4"/></button>
            <span className="text-sm text-slate-600 w-12 text-center">{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(300, z + 10))} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"><ZoomIn className="w-4 h-4"/></button>
          </div>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <iframe ref={iframeRef} src={src} className="w-full h-[80vh]" title="Singapore MRT System Map" />
        </div>
        <div className="mt-3 text-xs text-slate-500">If the PDF viewer controls are hidden, you can open it directly <a className="underline" href="/pdf/SM_Eng_(Ver280225)_Hume.pdf" target="_blank" rel="noreferrer">in a new tab</a>.</div>
      </div>
    </div>
  );
}
