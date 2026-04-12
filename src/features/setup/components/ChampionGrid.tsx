'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { ChampionCard } from './ChampionCard';
import type { Champion, CounterMap } from '@/types/champion';

interface ChampionGridProps {
  champions: Champion[];
  counters: CounterMap;
  championMap: Record<string, Champion>;
  onSelectChampion: (id: string) => void;
  isLoading: boolean;
}

export function ChampionGrid({
  champions,
  counters,
  championMap,
  onSelectChampion,
  isLoading,
}: ChampionGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 p-2">
            <Skeleton className="w-16 h-16 rounded-md" />
            <Skeleton className="w-12 h-3 rounded" />
            <div className="flex gap-1">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="w-6 h-6 rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
      {champions.map((champion) => (
        <ChampionCard
          key={champion.id}
          champion={champion}
          counterIds={counters[champion.id] ?? []}
          championMap={championMap}
          onClick={() => onSelectChampion(champion.id)}
        />
      ))}
    </div>
  );
}
