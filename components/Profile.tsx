'use client';

import { useApp } from '@/context/AppContext';

export default function Profile() {
  const { appState, setAppState } = useApp();

  return (
    <section className="space-y-3">
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <h2 className="font-semibold text-lg">Profile</h2>
        <p className="text-sm text-slate-600 mt-1">
          Simulate traveler, community, and operator roles.
        </p>

        <div className="mt-3 grid grid-cols-1 gap-2">
          <label className="text-xs">
            <span className="text-slate-700">Name</span>
            <input
              value={appState.profile.name}
              onChange={(e) =>
                setAppState({
                  ...appState,
                  profile: { ...appState.profile, name: e.target.value },
                })
              }
              className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="e.g., Kai Lun"
            />
          </label>

          <label className="text-xs">
            <span className="text-slate-700">Role</span>
            <select
              value={appState.profile.role}
              onChange={(e) =>
                setAppState({
                  ...appState,
                  profile: {
                    ...appState.profile,
                    role: e.target.value as 'traveler' | 'community' | 'operator',
                  },
                })
              }
              className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="traveler">Traveler</option>
              <option value="community">Local Community Lead</option>
              <option value="operator">Tourism Operator</option>
            </select>
          </label>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            <div className="font-medium">How this reduces greenwashing</div>
            <ul className="list-disc ml-5 mt-2 text-sm text-slate-700 space-y-1">
              <li>Every claim becomes a ledger entry: who, what, when, metrics.</li>
              <li>Exports to JSON so impact can be audited.</li>
              <li>Projects include "what counts" + suggested measurement.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
