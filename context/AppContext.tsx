'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, LedgerEntry, Project } from '@/types';

const seedProjects: Project[] = [
  {
    id: 'sg-mangrove',
    destination: 'Singapore',
    name: 'Mangrove Guardians (Kranji)',
    tags: ['biodiversity', 'water', 'community'],
    verified: true,
    host: 'Local NGO + Community',
    description: 'Restore mangroves, remove invasive species, and monitor biodiversity along the wetlands.',
    nextSlots: 18,
    suggestedMetrics: { hours: 2, wasteKg: 2, natureUnits: 1 },
    whatCounts: 'Seedlings planted + monitoring logs + cleanup weight.',
  },
  {
    id: 'bali-reef',
    destination: 'Bali',
    name: 'Reef Regeneration (Nusa Dua)',
    tags: ['biodiversity', 'carbon'],
    verified: true,
    host: 'Community Dive Co-op',
    description: 'Coral nursery maintenance + reef-safe education for visitors. Optional donation to fund substrate.',
    nextSlots: 10,
    suggestedMetrics: { hours: 3, wasteKg: 0, natureUnits: 1 },
    whatCounts: 'Coral fragments tended + reef-safe briefings delivered.',
  },
  {
    id: 'kyoto-culture',
    destination: 'Kyoto',
    name: 'Living Heritage Workshop (Craft Co-op)',
    tags: ['culture', 'community'],
    verified: true,
    host: 'Artisan Cooperative',
    description: 'Support local artisans through fair-pay workshops; a portion funds apprenticeships for youth.',
    nextSlots: 12,
    suggestedMetrics: { hours: 2, wasteKg: 0, natureUnits: 0 },
    whatCounts: 'Fair-pay participation + apprenticeship fund contribution.',
  },
  {
    id: 'lisbon-waste',
    destination: 'Lisbon',
    name: 'Coastal Cleanup + Microplastics Audit',
    tags: ['waste', 'water', 'community'],
    verified: false,
    host: 'Volunteer Collective',
    description: 'Beach cleanup + microplastics count to inform local policy advocacy.',
    nextSlots: 30,
    suggestedMetrics: { hours: 2, wasteKg: 5, natureUnits: 0 },
    whatCounts: 'Waste weight + microplastics count + location logs.',
  },
  {
    id: 'cairns-rainforest',
    destination: 'Cairns',
    name: 'Rainforest Regeneration (Creek Replanting)',
    tags: ['biodiversity', 'carbon', 'water'],
    verified: true,
    host: 'Ranger Program',
    description: 'Plant native species to stabilize creek banks and restore habitat corridors.',
    nextSlots: 14,
    suggestedMetrics: { hours: 3, wasteKg: 1, natureUnits: 2 },
    whatCounts: 'Trees planted + survival rate follow-ups.',
  },
];

const defaultState: AppState = {
  profile: { name: '', role: 'traveler' },
  trip: { destination: 'Singapore', start: '', end: '' },
  projects: seedProjects,
};

const LS_KEYS = {
  state: 'regenTripPOC_state_v2_mobile',
  ledger: 'regenTripPOC_ledger_v2_mobile',
};

interface AppContextType {
  appState: AppState;
  setAppState: (state: AppState) => void;
  ledger: LedgerEntry[];
  addLedgerEntry: (entry: LedgerEntry) => void;
  removeLedgerEntry: (id: string) => void;
  clearLedger: () => void;
  resetApp: () => void;
  exportData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [appState, setAppStateInternal] = useState<AppState>(defaultState);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const loadedState = loadState();
    const loadedLedger = loadLedger();
    setAppStateInternal(loadedState);
    setLedger(loadedLedger);
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem(LS_KEYS.state, JSON.stringify(appState));
    }
  }, [appState, isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem(LS_KEYS.ledger, JSON.stringify(ledger));
    }
  }, [ledger, isClient]);

  const loadState = (): AppState => {
    if (typeof window === 'undefined') return defaultState;
    const raw = localStorage.getItem(LS_KEYS.state);
    if (!raw) return defaultState;
    try {
      const parsed = JSON.parse(raw);
      return {
        ...defaultState,
        ...parsed,
        profile: { ...defaultState.profile, ...(parsed.profile || {}) },
        trip: { ...defaultState.trip, ...(parsed.trip || {}) },
        projects: parsed.projects?.length ? parsed.projects : seedProjects,
      };
    } catch {
      return defaultState;
    }
  };

  const loadLedger = (): LedgerEntry[] => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(LS_KEYS.ledger);
    if (!raw) return [];
    try {
      return JSON.parse(raw) || [];
    } catch {
      return [];
    }
  };

  const setAppState = (state: AppState) => {
    setAppStateInternal(state);
  };

  const addLedgerEntry = (entry: LedgerEntry) => {
    setLedger((prev) => [...prev, entry]);
  };

  const removeLedgerEntry = (id: string) => {
    setLedger((prev) => prev.filter((e) => e.id !== id));
  };

  const clearLedger = () => {
    setLedger([]);
  };

  const resetApp = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LS_KEYS.state);
      localStorage.removeItem(LS_KEYS.ledger);
    }
    setAppStateInternal(defaultState);
    setLedger([]);
  };

  const exportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      profile: appState.profile,
      trip: appState.trip,
      ledger,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'regenTrip_impact_export.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <AppContext.Provider
      value={{
        appState,
        setAppState,
        ledger,
        addLedgerEntry,
        removeLedgerEntry,
        clearLedger,
        resetApp,
        exportData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
