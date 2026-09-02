'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChampions, useChampionMap } from '@/hooks/useChampions';
import { useCounterStore } from '@/store/counter';
import { type Position } from '@/types/champion';
import { FilterBar } from './FilterBar';
import { ChampionGrid } from './ChampionGrid';
import { CounterPickerDialog } from './CounterPickerDialog';
import { CounterIoButtons } from './CounterIoButtons';

export function SetupPageClient() {
  const { data: champions, isLoading, isError } = useChampions();
  const championMap = useChampionMap();
  const { counters, setCounters } = useCounterStore();

  // SSR hydration 가드
  const [hasHydrated, setHasHydrated] = useState(false);
  useEffect(() => setHasHydrated(true), []);

  const [selectedPosition, setSelectedPosition] = useState<Position | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedOpponentId, setSelectedOpponentId] = useState<string | null>(null);

  // 포지션 변경 시 태그 필터 초기화
  const handlePositionChange = (position: Position | 'ALL') => {
    setSelectedPosition(position);
    setSelectedTags([]);
  };

  const availableTags = useMemo(() => {
    if (!champions) return [];
    const source =
      selectedPosition === 'ALL'
        ? champions
        : champions.filter((c) => c.positions.includes(selectedPosition));
    const tagSet = new Set(source.flatMap((c) => c.tags));
    return Array.from(tagSet).sort();
  }, [champions, selectedPosition]);

  const filteredChampions = useMemo(() => {
    if (!champions) return [];
    return champions.filter((c) => {
      const matchesPosition = selectedPosition === 'ALL' || c.positions.includes(selectedPosition);
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags =
        selectedTags.length === 0 || selectedTags.every((t) => c.tags.includes(t));
      return matchesPosition && matchesSearch && matchesTags;
    });
  }, [champions, selectedPosition, searchQuery, selectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const selectedOpponent = selectedOpponentId ? championMap[selectedOpponentId] : null;

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        챔피언 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3">
        <Button
          asChild
          variant="ghost"
          size="icon"
          aria-label="뒤로 가기"
          className="mt-0.5 shrink-0 text-zinc-400 hover:text-zinc-100"
        >
          <Link href="/app">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-zinc-100 mb-1">카운터 픽 설정</h1>
          <p className="text-sm text-zinc-400">
            챔피언을 클릭해서 해당 챔피언을 상대할 때 선호하는 카운터픽을 설정하세요. (최대 3개)
          </p>
        </div>
        <CounterIoButtons />
      </div>

      <FilterBar
        selectedPosition={selectedPosition}
        onPositionChange={handlePositionChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        availableTags={availableTags}
      />

      <ChampionGrid
        champions={filteredChampions}
        counters={hasHydrated ? counters : {}}
        championMap={championMap}
        onSelectChampion={setSelectedOpponentId}
        isLoading={isLoading}
      />

      <CounterPickerDialog
        open={!!selectedOpponentId}
        onOpenChange={(open) => !open && setSelectedOpponentId(null)}
        opponent={selectedOpponent}
        currentCounterIds={
          hasHydrated && selectedOpponentId ? (counters[selectedOpponentId] ?? []) : []
        }
        allChampions={champions ?? []}
        onSave={(ids) => {
          if (selectedOpponentId) setCounters(selectedOpponentId, ids);
        }}
      />
    </div>
  );
}
