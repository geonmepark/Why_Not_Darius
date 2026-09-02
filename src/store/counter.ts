import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { countersStorage } from '@/lib/counters-storage';
import type { CounterMap } from '@/types/champion';

const MAX_COUNTERS = 3;

/**
 * 카운터가 하나도 없으면 키 자체를 지운다.
 * 빈 배열을 남기면 사용자가 직접 열어보는 counters.json 에 의미 없는 항목이 쌓인다.
 */
function withCounters(counters: CounterMap, opponentId: string, next: string[]): CounterMap {
  if (next.length === 0) return withoutOpponent(counters, opponentId).counters;
  return { ...counters, [opponentId]: next };
}

function withoutOpponent(counters: CounterMap, opponentId: string): { counters: CounterMap } {
  const rest = { ...counters };
  delete rest[opponentId];
  return { counters: rest };
}

interface CounterState {
  counters: CounterMap;
  setCounters: (opponentId: string, counterIds: string[]) => void;
  addCounter: (opponentId: string, counterId: string) => void;
  removeCounter: (opponentId: string, counterId: string) => void;
  clearCounters: (opponentId: string) => void;
  /** 가져오기처럼 전체를 한 번에 바꿀 때 — 항목마다 setCounters 를 부르지 않는다 */
  replaceAll: (counters: CounterMap) => void;
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
              counters: withCounters(state.counters, opponentId, counterIds.slice(0, MAX_COUNTERS)),
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
                counters: withCounters(
                  state.counters,
                  opponentId,
                  current.filter((id) => id !== counterId),
                ),
              };
            },
            false,
            'removeCounter',
          ),

        clearCounters: (opponentId) =>
          set((state) => withoutOpponent(state.counters, opponentId), false, 'clearCounters'),

        replaceAll: (counters) => set({ counters }, false, 'replaceAll'),

        resetAll: () => set({ counters: {} }, false, 'resetAll'),
      }),
      {
        name: 'wnd-counters',
        // Electron 에서는 userData/counters.json, 브라우저에서는 localStorage
        storage: createJSONStorage(() => countersStorage),
      },
    ),
    { name: 'CounterStore' },
  ),
);
