'use client';

import { useApp } from '@/context/AppContext';

export default function Header() {
  const { exportData } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 grid place-items-center text-white font-bold text-xl shadow-2xl">
            🌿
          </div>
          <div className="leading-tight">
            <div className="font-black text-2xl bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              RegenTrip
            </div>
            <div className="text-xs text-gray-400">Regenerative Tourism Impact</div>
          </div>
        </div>
        <button
          onClick={exportData}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
          📊 Export Data
        </button>
      </div>
    </header>
  );
}
