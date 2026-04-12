'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { POSITIONS, POSITION_LABEL, type Position } from '@/types/champion';

interface FilterBarProps {
  selectedPosition: Position | 'ALL';
  onPositionChange: (position: Position | 'ALL') => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  availableTags: string[];
}

const TAG_LABEL: Record<string, string> = {
  Fighter: '파이터',
  Tank: '탱커',
  Mage: '마법사',
  Assassin: '암살자',
  Support: '서포터',
  Marksman: '원거리딜러',
};

export function FilterBar({
  selectedPosition,
  onPositionChange,
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagToggle,
  availableTags,
}: FilterBarProps) {
  const isAllTags = selectedTags.length === 0;

  return (
    <div className="flex flex-col gap-3">
      {/* 1뎁스: 포지션 탭 */}
      <Tabs value={selectedPosition} onValueChange={(v) => onPositionChange(v as Position | 'ALL')}>
        <TabsList className="w-full bg-zinc-800 h-10">
          <TabsTrigger value="ALL" className="flex-1 text-sm">
            {POSITION_LABEL.ALL}
          </TabsTrigger>
          {POSITIONS.map((pos) => (
            <TabsTrigger key={pos} value={pos} className="flex-1 text-sm">
              {POSITION_LABEL[pos]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* 2뎁스: 검색 + 클래스 태그 */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative sm:w-56 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="챔피언 검색..."
            className="pl-9 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge
            variant={isAllTags ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer select-none',
              isAllTags
                ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                : 'border-zinc-600 text-zinc-400 hover:border-zinc-400 hover:text-zinc-200',
            )}
            onClick={() => selectedTags.forEach((t) => onTagToggle(t))}
          >
            전체
          </Badge>
          {availableTags.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <Badge
                key={tag}
                variant={active ? 'default' : 'outline'}
                className={cn(
                  'cursor-pointer select-none',
                  active
                    ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                    : 'border-zinc-600 text-zinc-400 hover:border-zinc-400 hover:text-zinc-200',
                )}
                onClick={() => onTagToggle(tag)}
              >
                {TAG_LABEL[tag] ?? tag}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}
