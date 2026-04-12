'use client';

import { Plus } from 'lucide-react';
import { ChampionAvatar } from './ChampionAvatar';
import type { Champion } from '@/types/champion';

interface CounterBadgesProps {
  counterIds: string[];
  championMap: Record<string, Champion>;
  maxSlots?: number;
}

export function CounterBadges({ counterIds, championMap, maxSlots = 3 }: CounterBadgesProps) {
  return (
    <div className="flex gap-1 justify-center">
      {Array.from({ length: maxSlots }).map((_, i) => {
        const champion = counterIds[i] ? championMap[counterIds[i]] : undefined;

        if (champion) {
          return (
            <div
              key={i}
              className="rounded-full overflow-hidden border-2 border-blue-400"
              style={{ width: 24, height: 24 }}
            >
              <ChampionAvatar champion={champion} size="sm" className="w-full h-full" />
            </div>
          );
        }

        return (
          <div
            key={i}
            className="rounded-full border-2 border-dashed border-zinc-600 flex items-center justify-center"
            style={{ width: 24, height: 24 }}
          >
            <Plus className="text-zinc-500" style={{ width: 10, height: 10 }} />
          </div>
        );
      })}
    </div>
  );
}
