import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { CounterMap } from '@/types/champion';

const MAX_COUNTERS = 3;

interface CounterState {
  counters: CounterMap;
  setCounters: (opponentId: string, counterIds: string[]) => void;
  addCounter: (opponentId: string, counterId: string) => void;
  removeCounter: (opponentId: string, counterId: string) => void;
  clearCounters: (opponentId: string) => void;
  resetAll: () => void;
}

export const useCounterStore = create<CounterState>()(
  devtools(
    persist(
      (set) => ({
        counters: {},

        setCounters: (opponentId, counterIds) =>
          set(
            (state) => ({
              counters: { ...state.counters, [opponentId]: counterIds.slice(0, MAX_COUNTERS) },
            }),
            false,
            'setCounters',
          ),

        addCounter: (opponentId, counterId) =>
          set(
            (state) => {
              const current = state.counters[opponentId] ?? [];
              if (current.includes(counterId) || current.length >= MAX_COUNTERS) return state;
              return { counters: { ...state.counters, [opponentId]: [...current, counterId] } };
            },
            false,
            'addCounter',
          ),

        removeCounter: (opponentId, counterId) =>
          set(
            (state) => {
              const current = state.counters[opponentId] ?? [];
              return {
                counters: {
                  ...state.counters,
                  [opponentId]: current.filter((id) => id !== counterId),
                },
              };
            },
            false,
            'removeCounter',
          ),

        clearCounters: (opponentId) =>
          set(
            (state) => ({ counters: { ...state.counters, [opponentId]: [] } }),
            false,
            'clearCounters',
          ),

        resetAll: () => set({ counters: {} }, false, 'resetAll'),
      }),
      { name: 'wnd-counters' },
    ),
    { name: 'CounterStore' },
  ),
);
