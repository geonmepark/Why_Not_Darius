'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ChampionAvatar } from './ChampionAvatar';
import type { Champion } from '@/types/champion';
import { cn } from '@/lib/utils';

interface CounterPickerGridProps {
  champions: Champion[];
  selectedIds: string[];
  disabledIds?: string[];
  onToggle: (id: string) => void;
}

export function CounterPickerGrid({
  champions,
  selectedIds,
  disabledIds = [],
  onToggle,
}: CounterPickerGridProps) {
  const [localSearch, setLocalSearch] = useState('');

  const filtered = champions.filter((c) =>
    c.name.toLowerCase().includes(localSearch.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
        <Input
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="챔피언 검색..."
          className="pl-9 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
        />
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-7 gap-1.5 max-h-[360px] overflow-y-auto pr-1">
        {filtered.map((champion) => {
          const isSelected = selectedIds.includes(champion.id);
          const isDisabled = disabledIds.includes(champion.id);

          return (
            <button
              key={champion.id}
              disabled={isDisabled}
              onClick={() => !isDisabled && onToggle(champion.id)}
              className={cn(
                'flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all text-left',
                isDisabled && 'opacity-30 cursor-not-allowed',
                !isDisabled && 'cursor-pointer hover:bg-zinc-700',
                isSelected && 'bg-blue-900 ring-2 ring-blue-500',
                !isSelected && !isDisabled && 'bg-zinc-800',
              )}
            >
              <ChampionAvatar champion={champion} size="md" className="rounded-md" />
              <span className="text-[10px] text-zinc-300 text-center leading-tight w-full truncate">
                {champion.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
