'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { fmt, clampNum, humanTime, uuid } from '@/lib/utils';
import Modal from './Modal';

export default function Dashboard() {
  const { appState, ledger, addLedgerEntry, removeLedgerEntry, clearLedger, resetApp } = useApp();
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [quickLogInputs, setQuickLogInputs] = useState({
    projectId: '',
    hours: 1,
    wasteKg: 0,
    natureUnits: 0,
    donationUSD: 0,
    action: 'Quick log',
  });

  const sums = useMemo(() => {
    let hours = 0,
      wasteKg = 0,
      natureUnits = 0,
      donations = 0;
    for (const e of ledger) {
      hours += clampNum(e.metrics?.hours);
      wasteKg += clampNum(e.metrics?.wasteKg);
      natureUnits += clampNum(e.metrics?.natureUnits);
      donations += clampNum(e.metrics?.donationUSD);
    }
    return { hours, wasteKg, natureUnits, donations };
  }, [ledger]);

  const sortedLedger = useMemo(() => {
    return [...ledger].sort((a, b) => (b.time || '').localeCompare(a.time || ''));
  }, [ledger]);

  const handleQuickLog = () => {
    const defaultProj =
      appState.projects.find((x) => x.destination === appState.trip.destination) ||
      appState.projects[0];
    setQuickLogInputs({
      projectId: defaultProj.id,
      hours: 1,
      wasteKg: 0,
      natureUnits: 0,
      donationUSD: 0,
      action: 'Quick log',
    });
    setShowQuickLog(true);
  };

  const handleQuickLogSubmit = () => {
    const proj = appState.projects.find((p) => p.id === quickLogInputs.projectId);
    if (!proj) return;

    const actor = {
      name: appState.profile.name.trim() || 'Anonymous',
      role: appState.profile.role,
    };

    addLedgerEntry({
      id: uuid(),
      time: new Date().toISOString(),
      actorName: actor.name,
      actorRole: actor.role,
      projectId: proj.id,
      projectName: proj.name,
      action: quickLogInputs.action.trim() || 'Quick log',
      metrics: {
        hours: clampNum(quickLogInputs.hours),
        wasteKg: clampNum(quickLogInputs.wasteKg),
        natureUnits: clampNum(quickLogInputs.natureUnits),
        donationUSD: clampNum(quickLogInputs.donationUSD),
      },
    });
    setShowQuickLog(false);
  };

  return (
    <section className="space-y-3">
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-semibold text-lg">Impact Dashboard</h2>
            <p className="text-sm text-slate-600 mt-1">Your local, auditable impact ledger.</p>
          </div>
          <button
            onClick={handleQuickLog}
            className="px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-medium"
          >
            + Quick log
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-2xl border border-slate-200 p-3 bg-slate-50">
            <div className="text-[11px] text-slate-600">Volunteer hours</div>
            <div className="text-xl font-semibold mt-1">{fmt.format(sums.hours)}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 p-3 bg-slate-50">
            <div className="text-[11px] text-slate-600">Waste removed (kg)</div>
            <div className="text-xl font-semibold mt-1">{fmt.format(sums.wasteKg)}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 p-3 bg-slate-50">
            <div className="text-[11px] text-slate-600">Trees / corals</div>
            <div className="text-xl font-semibold mt-1">{fmt.format(sums.natureUnits)}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 p-3 bg-slate-50">
            <div className="text-[11px] text-slate-600">Donations ($)</div>
            <div className="text-xl font-semibold mt-1">{fmt.format(sums.donations)}</div>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={clearLedger}
            className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs"
          >
            Clear ledger
          </button>
          <button
            onClick={resetApp}
            className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs"
          >
            Reset app
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-3 border-b border-slate-200 flex items-center justify-between">
          <div className="text-sm font-medium">Ledger entries</div>
          <div className="text-xs text-slate-500">
            {ledger.length} {ledger.length === 1 ? 'entry' : 'entries'}
          </div>
        </div>
        <div className="divide-y divide-slate-200">
          {ledger.length === 0 ? (
            <div className="p-4 text-sm text-slate-600">
              No impact logged yet. Use Quick log, or join a project.
            </div>
          ) : (
            sortedLedger.map((entry) => {
              const metrics: string[] = [];
              if (clampNum(entry.metrics?.hours))
                metrics.push(`${fmt.format(entry.metrics.hours!)}h`);
              if (clampNum(entry.metrics?.wasteKg))
                metrics.push(`${fmt.format(entry.metrics.wasteKg!)}kg waste`);
              if (clampNum(entry.metrics?.natureUnits))
                metrics.push(`${fmt.format(entry.metrics.natureUnits!)} units`);
              if (clampNum(entry.metrics?.donationUSD))
                metrics.push(`$${fmt.format(entry.metrics.donationUSD!)}`);
              const metricsStr = metrics.length ? metrics.join(' · ') : '—';

              return (
                <div key={entry.id} className="p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs text-slate-500">{humanTime(entry.time)}</div>
                      <div className="text-sm font-semibold mt-1">{entry.projectName}</div>
                      <div className="text-xs text-slate-600 mt-1">
                        {entry.actorName} ({entry.actorRole}) · {entry.action}
                      </div>
                      <div className="text-sm text-slate-700 mt-1">{metricsStr}</div>
                    </div>
                    <button
                      onClick={() => removeLedgerEntry(entry.id)}
                      className="shrink-0 text-[11px] px-2 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <Modal
        isOpen={showQuickLog}
        onClose={() => setShowQuickLog(false)}
        title="Quick Log Impact"
        subtitle="Fast entry to ledger"
      >
        <div className="text-sm text-slate-700">
          <label className="text-[11px] block">
            Project
            <select
              value={quickLogInputs.projectId}
              onChange={(e) => setQuickLogInputs({ ...quickLogInputs, projectId: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
            >
              {appState.projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.destination} · {p.name}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <label className="text-[11px]">
              Hours
              <input
                type="number"
                min="0"
                step="0.5"
                value={quickLogInputs.hours}
                onChange={(e) =>
                  setQuickLogInputs({ ...quickLogInputs, hours: parseFloat(e.target.value) })
                }
                className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </label>
            <label className="text-[11px]">
              Waste (kg)
              <input
                type="number"
                min="0"
                step="0.1"
                value={quickLogInputs.wasteKg}
                onChange={(e) =>
                  setQuickLogInputs({ ...quickLogInputs, wasteKg: parseFloat(e.target.value) })
                }
                className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </label>
            <label className="text-[11px]">
              Units
              <input
                type="number"
                min="0"
                step="1"
                value={quickLogInputs.natureUnits}
                onChange={(e) =>
                  setQuickLogInputs({ ...quickLogInputs, natureUnits: parseInt(e.target.value) })
                }
                className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </label>
            <label className="text-[11px]">
              Donation (USD)
              <input
                type="number"
                min="0"
                step="1"
                value={quickLogInputs.donationUSD}
                onChange={(e) =>
                  setQuickLogInputs({ ...quickLogInputs, donationUSD: parseFloat(e.target.value) })
                }
                className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </label>
          </div>

          <label className="text-[11px] block mt-2">
            Action label
            <input
              type="text"
              value={quickLogInputs.action}
              onChange={(e) => setQuickLogInputs({ ...quickLogInputs, action: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
            />
          </label>

          <button
            onClick={handleQuickLogSubmit}
            className="mt-3 w-full px-4 py-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-semibold"
          >
            Add entry
          </button>
        </div>
      </Modal>
    </section>
  );
}
