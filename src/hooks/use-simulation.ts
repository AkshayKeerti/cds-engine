'use client';

import { create } from 'zustand';

interface SimulationStore {
  currentHour: number;
  isPlaying: boolean;
  speed: number;
  selectedPatientId: string | null;
  setCurrentHour: (hour: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  setSelectedPatientId: (id: string | null) => void;
  advanceStep: () => Promise<void>;
  reset: () => Promise<void>;
}

const SCENARIO_HOURS = [0, 8, 16, 24, 32, 40];

export const useSimulation = create<SimulationStore>((set, get) => ({
  currentHour: 0,
  isPlaying: false,
  speed: 3,
  selectedPatientId: 'patient-1',

  setCurrentHour: (hour) => set({ currentHour: hour }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setSpeed: (speed) => set({ speed }),
  setSelectedPatientId: (id) => set({ selectedPatientId: id }),

  advanceStep: async () => {
    const { currentHour } = get();
    const currentIndex = SCENARIO_HOURS.indexOf(currentHour);
    const nextIndex = currentIndex + 1;

    if (nextIndex >= SCENARIO_HOURS.length) {
      set({ isPlaying: false });
      return;
    }

    const targetHour = SCENARIO_HOURS[nextIndex];

    await fetch('/api/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'advance', targetHour }),
    });

    set({ currentHour: targetHour });
  },

  reset: async () => {
    await fetch('/api/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset' }),
    });

    set({ currentHour: 0, isPlaying: false });
  },
}));

export function getScenarioHours() {
  return SCENARIO_HOURS;
}
