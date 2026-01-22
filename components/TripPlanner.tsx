'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function TripPlanner() {
  const { appState, setAppState } = useApp();
  const [planSummary, setPlanSummary] = useState<string | null>(null);

  const handlePlan = () => {
    const dest = appState.trip.destination;
    const start = appState.trip.start;
    const end = appState.trip.end;

    const projects = appState.projects.filter((p) => p.destination === dest);
    const best = projects
      .slice()
      .sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0) || b.nextSlots - a.nextSlots)
      .slice(0, 3);

    const rangeText = start && end ? `${start} → ${end}` : 'dates not set';
    const summary = `
      <div>Destination: <b>${dest}</b></div>
      <div>Dates: <b>${rangeText}</b></div>
      <div class="mt-2">Suggested:</div>
      <ul class="list-disc ml-5 mt-1">
        ${best.map((p) => `<li><b>${p.name}</b> (${p.tags.join(', ')})</li>`).join('')}
      </ul>
    `;
    setPlanSummary(summary);
  };

  return (
    <section className="space-y-3">
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <h2 className="font-semibold text-lg">Trip Planner</h2>
        <p className="text-sm text-slate-600 mt-1">
          Set dates. The app suggests regenerative activities for your destination.
        </p>

        <div className="mt-3 grid grid-cols-1 gap-2">
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs">
              <span className="text-slate-700">Start</span>
              <input
                type="date"
                value={appState.trip.start}
                onChange={(e) =>
                  setAppState({
                    ...appState,
                    trip: { ...appState.trip, start: e.target.value },
                  })
                }
                className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
            <label className="text-xs">
              <span className="text-slate-700">End</span>
              <input
                type="date"
                value={appState.trip.end}
                onChange={(e) =>
                  setAppState({
                    ...appState,
                    trip: { ...appState.trip, end: e.target.value },
                  })
                }
                className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
          </div>

          <button
            onClick={handlePlan}
            className="mt-1 px-4 py-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-semibold"
          >
            Suggest activities
          </button>

          {planSummary && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-sm font-medium">Plan Summary</div>
              <div
                className="text-sm text-slate-700 mt-1"
                dangerouslySetInnerHTML={{ __html: planSummary }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-slate-500 px-1">
        Tip: after planning, go to <b>Discover</b> to join/log suggested activities.
      </div>
    </section>
  );
}
