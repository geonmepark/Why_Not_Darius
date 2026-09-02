'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChampionAvatar } from './ChampionAvatar';
import { CounterPickerGrid } from './CounterPickerGrid';
import type { Champion } from '@/types/champion';
import { cn } from '@/lib/utils';

const MAX_COUNTERS = 3;

interface CounterPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opponent: Champion | null;
  currentCounterIds: string[];
  allChampions: Champion[];
  onSave: (counterIds: string[]) => void;
}

export function CounterPickerDialog({
  open,
  onOpenChange,
  opponent,
  currentCounterIds,
  allChampions,
  onSave,
}: CounterPickerDialogProps) {
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (open) setPendingIds(currentCounterIds);
  }, [open, currentCounterIds]);

  const handleToggle = (id: string) => {
    setPendingIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COUNTERS) {
        setShake(true);
        setTimeout(() => setShake(false), 400);
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleSave = () => {
    onSave(pendingIds);
    onOpenChange(false);
  };

  const championMap = Object.fromEntries(allChampions.map((c) => [c.id, c]));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-700 text-zinc-100 max-w-lg">
        {/* Radix 는 DialogContent 에 Title/Description 이 항상 있어야 aria 연결을 걸 수 있다 */}
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            {opponent && <ChampionAvatar champion={opponent} size="lg" className="rounded-md" />}
            <div>
              <DialogTitle className="text-lg font-bold text-zinc-100">
                {opponent?.name ?? '카운터 픽 설정'}
              </DialogTitle>
              <DialogDescription className="text-sm text-zinc-400">
                {opponent ? '의 카운터 픽 설정' : `카운터픽을 최대 ${MAX_COUNTERS}개 고르세요.`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* 선택된 카운터 슬롯 */}
        <div
          className={cn(
            'flex gap-3 justify-center py-3 px-4 bg-zinc-800 rounded-lg',
            shake && 'animate-[shake_0.4s_ease-in-out]',
          )}
        >
          {Array.from({ length: MAX_COUNTERS }).map((_, i) => {
            const champion = pendingIds[i] ? championMap[pendingIds[i]] : undefined;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                {champion ? (
                  <div className="relative">
                    <ChampionAvatar champion={champion} size="md" className="rounded-md" />
                    <button
                      onClick={() => handleToggle(champion.id)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-zinc-600 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-md border-2 border-dashed border-zinc-600 flex items-center justify-center">
                    <span className="text-zinc-600 text-lg">+</span>
                  </div>
                )}
                <span className="text-[10px] text-zinc-500 truncate w-12 text-center">
                  {champion?.name ?? `슬롯 ${i + 1}`}
                </span>
              </div>
            );
          })}
        </div>

        {/* 챔피언 선택 그리드 */}
        <CounterPickerGrid
          champions={allChampions}
          selectedIds={pendingIds}
          disabledIds={opponent ? [opponent.id] : []}
          onToggle={handleToggle}
        />

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
          >
            취소
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
