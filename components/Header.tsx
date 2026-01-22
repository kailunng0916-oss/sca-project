'use client';

import { useApp } from '@/context/AppContext';

export default function Header() {
  const { exportData } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-lg border-b border-emerald-200/50 shadow-lg">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 grid place-items-center text-white font-bold text-lg shadow-lg">
            🌿
          </div>
          <div className="leading-tight">
            <div className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">RegenTrip</div>
            <div className="text-xs text-slate-500">Regenerative Tourism Impact</div>
          </div>
        </div>
        <button
          onClick={exportData}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          📊 Export
        </button>
      </div>
    </header>
  );
}
