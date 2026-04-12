'use client';

import { ChampionAvatar } from './ChampionAvatar';
import { CounterBadges } from './CounterBadges';
import type { Champion } from '@/types/champion';
import { cn } from '@/lib/utils';

interface ChampionCardProps {
  champion: Champion;
  counterIds: string[];
  championMap: Record<string, Champion>;
  onClick: () => void;
}

export function ChampionCard({ champion, counterIds, championMap, onClick }: ChampionCardProps) {
  const isConfigured = counterIds.length > 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1.5 p-2 rounded-lg cursor-pointer transition-all',
        'bg-zinc-800 hover:bg-zinc-700 hover:scale-105',
        isConfigured && 'ring-2 ring-blue-500',
      )}
    >
      <ChampionAvatar champion={champion} size="lg" className="rounded-md" />
      <span className="text-xs text-zinc-300 text-center leading-tight w-full truncate">
        {champion.name}
      </span>
      <CounterBadges counterIds={counterIds} championMap={championMap} />
    </button>
  );
}
