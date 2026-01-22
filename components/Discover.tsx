'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Project } from '@/types';
import { badge, clampNum, uuid } from '@/lib/utils';
import Modal from './Modal';
import Image from 'next/image';

export default function Discover() {
  const { appState, setAppState, addLedgerEntry } = useApp();
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('all');
  const [imageLoading, setImageLoading] = useState(true);
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

  const destinationImages: Record<string, string> = {
    'Singapore': 'https://images.unsplash.com/photo-1525625293386-3ba9abb01c69?w=800&h=400&fit=crop',
    'Bali': 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=400&fit=crop',
    'Kyoto': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=400&fit=crop',
    'Lisbon': 'https://images.unsplash.com/photo-1585208798174-6c3ac1da6456?w=800&h=400&fit=crop',
    'Cairns': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
  };

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
    setImageLoading(true);
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
    <section className="space-y-6">
      <div className="bg-gradient-to-r from-gray-900/80 to-black/80 rounded-3xl border border-gray-800/50 p-8 shadow-2xl backdrop-blur-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-black text-3xl bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              🌍 Discover Amazing Projects
            </h2>
            <p className="text-gray-300 text-lg">
              Find regenerative actions in your destination. Join, donate, or log your impact. 🌱
            </p>
          </div>
          <span className="text-sm px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold shadow-xl">
            📒 Ledger Active
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4">
          <label className="text-base">
            <span className="text-white font-bold flex items-center gap-2">🏝️ Destination</span>
            <select
              value={appState.trip.destination}
              onChange={(e) => handleDestinationChange(e.target.value)}
              className="mt-3 w-full px-6 py-4 rounded-2xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-800/50 text-white shadow-xl backdrop-blur-sm"
            >
              {destinations.map((d) => (
                <option key={d} value={d} className="bg-gray-800">
                  {d}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="text-base">
              <span className="text-white font-bold flex items-center gap-2">🔍 Search</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-3 w-full px-6 py-4 rounded-2xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-800/50 text-white placeholder-gray-400 shadow-xl backdrop-blur-sm"
                placeholder="reef, cleanup, culture..."
              />
            </label>
            <label className="text-base">
              <span className="text-white font-bold flex items-center gap-2">🎯 Filter</span>
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="mt-3 w-full px-6 py-4 rounded-2xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-800/50 text-white shadow-xl backdrop-blur-sm"
              >
                <option value="all" className="bg-gray-800">All Categories</option>
                <option value="biodiversity" className="bg-gray-800">🦋 Biodiversity</option>
                <option value="waste" className="bg-gray-800">♻️ Waste</option>
                <option value="water" className="bg-gray-800">💧 Water</option>
                <option value="culture" className="bg-gray-800">🎭 Culture</option>
                <option value="community" className="bg-gray-800">🤝 Community</option>
                <option value="carbon" className="bg-gray-800">🌿 Carbon</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* Destination Image */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-6 animate-fade-in">
        <div className="aspect-[2/1] relative">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center z-10">
              <div className="text-white text-xl animate-pulse-gentle">🌍 Loading destination...</div>
            </div>
          )}
          <Image
            src={destinationImages[appState.trip.destination] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop'}
            alt={`${appState.trip.destination} destination`}
            fill
            className="object-cover transition-all duration-700 ease-in-out"
            priority
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 animate-slide-up">
            <h3 className="text-3xl font-black text-white mb-2 drop-shadow-lg">
              🌟 Welcome to {appState.trip.destination}
            </h3>
            <p className="text-gray-200 text-lg drop-shadow-md">
              Discover regenerative projects that make a real impact in this beautiful destination! 🌿
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {filteredProjects.length === 0 ? (
          <div className="bg-gradient-to-r from-gray-900/80 to-black/80 rounded-3xl border border-gray-800/50 p-8 shadow-2xl text-center backdrop-blur-sm">
            <div className="text-6xl mb-4">🌊</div>
            <div className="font-bold text-2xl text-white mb-2">No Projects Found</div>
            <div className="text-gray-400 text-lg">
              Try changing your search, filter, or destination. Let's find your perfect regenerative adventure! ✨
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredProjects.map((project, index) => (
              <article
                key={project.id}
                className={`bg-gradient-to-r from-gray-900/90 to-black/90 rounded-3xl border border-gray-800/50 p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] backdrop-blur-sm animate-scale-in project-card`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-black text-2xl text-white mb-2">{project.name}</div>
                    <div className="text-gray-300 text-lg mb-4 flex items-center gap-2">
                      📍 {project.destination} · 🏢 {project.host}
                    </div>
                    <div className="text-gray-400 mb-4 line-clamp-2">{project.description}</div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium border border-emerald-500/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span
                    className={`text-sm px-4 py-2 rounded-full font-bold shadow-xl ${
                      project.verified
                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
                        : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
                    }`}
                  >
                    {project.verified ? '✅ Verified' : '⏳ Unverified'}
                  </span>
                </div>
              </div>

                </div>

                <div className="mt-6 text-gray-300 text-base">{project.description}</div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium border border-emerald-500/30">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl bg-gray-800/50 border border-gray-700/50 p-4 backdrop-blur-sm">
                  <div className="text-gray-300 text-sm">
                    <b className="text-white">Next slots:</b> {project.nextSlots}
                  </div>
                  <div className="text-gray-400 text-sm mt-2">
                    Suggested: {project.suggestedMetrics.hours}h · {project.suggestedMetrics.wasteKg}kg · {project.suggestedMetrics.natureUnits} units
                  </div>
                  <div className="text-gray-400 text-sm mt-2">
                    <b className="text-white">Counts as impact:</b> {project.whatCounts}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <button
                    onClick={() => openModal('join', project)}
                    className="px-4 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    🤝 Join
                  </button>
                  <button
                    onClick={() => openModal('donate', project)}
                    className="px-4 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    💰 Donate
                  </button>
                  <button
                    onClick={() => openModal('log', project)}
                    className="px-4 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    📝 Log
                  </button>
                </div>
              </article>
            ))}
          </div>
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
