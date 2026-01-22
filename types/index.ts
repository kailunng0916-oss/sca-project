export interface Project {
  id: string;
  destination: string;
  name: string;
  tags: string[];
  verified: boolean;
  host: string;
  description: string;
  nextSlots: number;
  suggestedMetrics: {
    hours: number;
    wasteKg: number;
    natureUnits: number;
  };
  whatCounts: string;
}

export interface Profile {
  name: string;
  role: 'traveler' | 'community' | 'operator';
}

export interface Trip {
  destination: string;
  start: string;
  end: string;
}

export interface AppState {
  profile: Profile;
  trip: Trip;
  projects: Project[];
}

export interface LedgerEntry {
  id: string;
  time: string;
  actorName: string;
  actorRole: string;
  projectId: string;
  projectName: string;
  action: string;
  metrics: {
    hours?: number;
    wasteKg?: number;
    natureUnits?: number;
    donationUSD?: number;
  };
}
