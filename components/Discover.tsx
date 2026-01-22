'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Project } from '@/types';
import { badge, clampNum, uuid } from '@/lib/utils';
import Modal from './Modal';

export default function Discover() {
  const { appState, setAppState, addLedgerEntry } = useApp();
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('all');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'join' | 'donate' | 'log' | null;
    project: Project | null;
  }>({ isOpen: false, type: null, project: null });

  const [modalInputs, setModalInputs] = useState({
    hours: 0,
    wasteKg: 0,
    natureUnits: 0,
    donationUSD: 0,
    note: '',
    action: '',
  });

  const destinations = useMemo(() => {
    return [...new Set(appState.projects.map((p) => p.destination))].sort();
  }, [appState.projects]);

  const filteredProjects = useMemo(() => {
    const q = search.toLowerCase().trim();
    return appState.projects.filter((p) => {
      if (p.destination !== appState.trip.destination) return false;
      if (tagFilter !== 'all' && !p.tags.includes(tagFilter)) return false;
      if (q) {
        const blob = (p.name + ' ' + p.description + ' ' + p.tags.join(' ')).toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [appState.projects, appState.trip.destination, tagFilter, search]);

  const handleDestinationChange = (dest: string) => {
    setAppState({
      ...appState,
      trip: { ...appState.trip, destination: dest },
    });
  };

  const openModal = (type: 'join' | 'donate' | 'log', project: Project) => {
    setModalInputs({
      hours: type === 'join' ? project.suggestedMetrics.hours : 0,
      wasteKg: type === 'join' ? project.suggestedMetrics.wasteKg : 0,
      natureUnits: type === 'join' ? project.suggestedMetrics.natureUnits : 0,
      donationUSD: type === 'donate' ? 10 : 0,
      note: '',
      action: type === 'log' ? 'Logged impact' : '',
    });
    setModalState({ isOpen: true, type, project });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null, project: null });
  };

  const handleSubmit = () => {
    if (!modalState.project) return;

    const actor = {
      name: appState.profile.name.trim() || 'Anonymous',
      role: appState.profile.role,
    };

    const entry = {
      id: uuid(),
      time: new Date().toISOString(),
      actorName: actor.name,
      actorRole: actor.role,
      projectId: modalState.project.id,
      projectName: modalState.project.name,
      action: '',
      metrics: {},
    };

    if (modalState.type === 'join') {
      entry.action = 'Joined activity';
      entry.metrics = {
        hours: clampNum(modalInputs.hours),
        wasteKg: clampNum(modalInputs.wasteKg),
        natureUnits: clampNum(modalInputs.natureUnits),
      };
    } else if (modalState.type === 'donate') {
      entry.action = modalInputs.note ? `Donation (${modalInputs.note})` : 'Donation';
      entry.metrics = { donationUSD: clampNum(modalInputs.donationUSD) };
    } else if (modalState.type === 'log') {
      entry.action = modalInputs.action.trim() || 'Logged impact';
      entry.metrics = {
        hours: clampNum(modalInputs.hours),
        wasteKg: clampNum(modalInputs.wasteKg),
        natureUnits: clampNum(modalInputs.natureUnits),
      };
    }

    addLedgerEntry(entry);
    closeModal();
  };

  return (
    <section className="space-y-3">
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold text-lg">Discover Projects</h2>
            <p className="text-sm text-slate-600 mt-1">
              Find regenerative actions in your destination. Tap to join, donate, or log impact.
            </p>
          </div>
          <span className="text-[11px] px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800">
            Ledger ON
          </span>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2">
          <label className="text-xs">
            <span className="text-slate-700">Destination</span>
            <select
              value={appState.trip.destination}
              onChange={(e) => handleDestinationChange(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              {destinations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label className="text-xs">
              <span className="text-slate-700">Search</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="reef, cleanup, culture..."
              />
            </label>
            <label className="text-xs">
              <span className="text-slate-700">Filter</span>
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="all">All</option>
                <option value="biodiversity">Biodiversity</option>
                <option value="waste">Waste</option>
                <option value="water">Water</option>
                <option value="culture">Culture</option>
                <option value="community">Community</option>
                <option value="carbon">Carbon</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="font-medium">No projects found</div>
            <div className="text-sm text-slate-600 mt-1">
              Try changing search/filter or pick another destination.
            </div>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <article
              key={project.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-base">{project.name}</div>
                  <div className="text-xs text-slate-600 mt-1">
                    {project.destination} · Host: {project.host}
                  </div>
                </div>
                <span
                  className={`text-[11px] px-2 py-1 rounded-lg ${
                    project.verified
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {project.verified ? 'Verified' : 'Unverified'}
                </span>
              </div>

              <div className="mt-2 text-sm text-slate-700">{project.description}</div>

              <div className="mt-3 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className={`text-[11px] px-2 py-1 rounded-lg ${badge(tag)}`}>
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-3 rounded-2xl bg-slate-50 border border-slate-200 p-3">
                <div className="text-xs text-slate-700">
                  <b>Next slots:</b> {project.nextSlots}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Suggested: {project.suggestedMetrics.hours}h · {project.suggestedMetrics.wasteKg}
                  kg · {project.suggestedMetrics.natureUnits} units
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  <b>Counts as impact:</b> {project.whatCounts}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <button
                  onClick={() => openModal('join', project)}
                  className="px-3 py-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold"
                >
                  Join
                </button>
                <button
                  onClick={() => openModal('donate', project)}
                  className="px-3 py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold"
                >
                  Donate
                </button>
                <button
                  onClick={() => openModal('log', project)}
                  className="px-3 py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold"
                >
                  Log
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={
          modalState.type === 'join'
            ? 'Join project'
            : modalState.type === 'donate'
              ? 'Donate'
              : 'Log impact'
        }
        subtitle={
          modalState.project
            ? `${modalState.project.destination} · ${modalState.project.name}`
            : ''
        }
      >
        <div className="text-sm text-slate-700">
          {modalState.type === 'join' && modalState.project && (
            <>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs">
                Suggested impact: <b>{modalState.project.suggestedMetrics.hours}h</b> ·{' '}
                <b>{modalState.project.suggestedMetrics.wasteKg}kg</b> ·{' '}
                <b>{modalState.project.suggestedMetrics.natureUnits} units</b>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <label className="text-[11px]">
                  Hours
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={modalInputs.hours}
                    onChange={(e) =>
                      setModalInputs({ ...modalInputs, hours: parseFloat(e.target.value) })
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
                    value={modalInputs.wasteKg}
                    onChange={(e) =>
                      setModalInputs({ ...modalInputs, wasteKg: parseFloat(e.target.value) })
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
                    value={modalInputs.natureUnits}
                    onChange={(e) =>
                      setModalInputs({ ...modalInputs, natureUnits: parseInt(e.target.value) })
                    }
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </label>
              </div>
            </>
          )}

          {modalState.type === 'donate' && (
            <>
              <label className="text-[11px] block">
                Donation amount (USD)
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={modalInputs.donationUSD}
                  onChange={(e) =>
                    setModalInputs({ ...modalInputs, donationUSD: parseFloat(e.target.value) })
                  }
                  className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </label>
              <label className="text-[11px] block mt-2">
                Note (optional)
                <input
                  type="text"
                  placeholder="e.g., ranger wages"
                  value={modalInputs.note}
                  onChange={(e) => setModalInputs({ ...modalInputs, note: e.target.value })}
                  className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </label>
            </>
          )}

          {modalState.type === 'log' && modalState.project && (
            <>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs">
                <b>Counts as impact:</b> {modalState.project.whatCounts}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <label className="text-[11px]">
                  Hours
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={modalInputs.hours}
                    onChange={(e) =>
                      setModalInputs({ ...modalInputs, hours: parseFloat(e.target.value) })
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
                    value={modalInputs.wasteKg}
                    onChange={(e) =>
                      setModalInputs({ ...modalInputs, wasteKg: parseFloat(e.target.value) })
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
                    value={modalInputs.natureUnits}
                    onChange={(e) =>
                      setModalInputs({ ...modalInputs, natureUnits: parseInt(e.target.value) })
                    }
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </label>
              </div>
              <label className="text-[11px] block mt-2">
                Action label
                <input
                  type="text"
                  value={modalInputs.action}
                  onChange={(e) => setModalInputs({ ...modalInputs, action: e.target.value })}
                  className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </label>
            </>
          )}

          <button
            onClick={handleSubmit}
            className="mt-3 w-full px-4 py-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-semibold"
          >
            {modalState.type === 'join'
              ? 'Confirm join'
              : modalState.type === 'donate'
                ? 'Log donation'
                : 'Add to ledger'}
          </button>
        </div>
      </Modal>
    </section>
  );
}
