'use client';

import { useApp } from '@/context/AppContext';

export default function Header() {
  const { exportData } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-emerald-600 grid place-items-center text-white font-bold">
            R
          </div>
          <div className="leading-tight">
            <div className="font-semibold">RegenTrip</div>
            <div className="text-xs text-slate-600">Mobile POC · no database</div>
          </div>
        </div>
        <button
          onClick={exportData}
          className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs"
        >
          Export
        </button>
      </div>
    </header>
  );
}
