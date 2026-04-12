import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { LcuChampSelectCell, LcuStatus } from '../../electron/lcu/types';

interface LcuState {
  status: LcuStatus;
  theirTeam: LcuChampSelectCell[];
  phase: string;
  // championId > 0인 상대팀 픽 — String(championId)로 CounterMap 키와 매칭
  confirmedOpponentIds: string[];

  setStatus: (status: LcuStatus) => void;
  setChampSelect: (theirTeam: LcuChampSelectCell[], phase: string) => void;
  clearChampSelect: () => void;
}

export const useLcuStore = create<LcuState>()(
  devtools(
    (set) => ({
      status: 'disconnected',
      theirTeam: [],
      phase: '',
      confirmedOpponentIds: [],

      setStatus: (status) => set({ status }, false, 'setStatus'),

      setChampSelect: (theirTeam, phase) =>
        set(
          {
            theirTeam,
            phase,
            confirmedOpponentIds: theirTeam
              .filter((cell) => cell.championId > 0)
              .map((cell) => String(cell.championId)),
          },
          false,
          'setChampSelect',
        ),

      clearChampSelect: () =>
        set(
          { theirTeam: [], phase: '', confirmedOpponentIds: [] },
          false,
          'clearChampSelect',
        ),
    }),
    { name: 'LcuStore' },
  ),
);
