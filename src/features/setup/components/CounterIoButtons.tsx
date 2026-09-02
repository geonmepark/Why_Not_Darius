'use client';

import { useMemo, useState } from 'react';
import { Download, FolderOpen, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useChampions } from '@/hooks/useChampions';
import { useIsElectron } from '@/hooks/useIsElectron';
import { useCounterStore } from '@/store/counter';
import { countersFileSchema, sanitizeCounters } from '@/lib/counters-schema';
import { flushCountersNow } from '@/lib/counters-storage';
import type { CounterMap } from '@/types/champion';

interface PendingImport {
  filePath: string;
  counters: CounterMap;
  droppedOpponents: string[];
  droppedCounters: number;
}

export function CounterIoButtons() {
  const counters = useCounterStore((s) => s.counters);
  const replaceAll = useCounterStore((s) => s.replaceAll);
  const { data: champions } = useChampions();

  // window.electronApi 는 SSR 에 없다
  const isElectron = useIsElectron();

  const [pending, setPending] = useState<PendingImport | null>(null);

  const knownIds = useMemo(() => new Set((champions ?? []).map((c) => c.id)), [champions]);

  if (!isElectron) return null;

  const handleExport = async () => {
    flushCountersNow(); // 디바운스 중인 변경분까지 반영하고 내보낸다
    const result = await window.electronApi!.exportCounters({ version: 1, counters });

    if (result.status === 'canceled') return;
    if (result.status === 'error') {
      toast.error('내보내기 실패', { description: result.message });
      return;
    }
    toast.success(`${Object.keys(counters).length}개를 내보냈습니다`, {
      description: result.filePath,
    });
  };

  const handleImport = async () => {
    const result = await window.electronApi!.importCounters();

    if (result.status === 'canceled') return;
    if (result.status === 'error') {
      toast.error('가져오기 실패', { description: result.message });
      return;
    }

    const parsed = countersFileSchema.safeParse(result.data);
    if (!parsed.success) {
      toast.error('카운터픽 파일 형식이 아닙니다', {
        description: '내보내기로 만든 JSON 파일인지 확인해주세요.',
      });
      return;
    }

    if (knownIds.size === 0) {
      toast.error('챔피언 목록을 아직 불러오지 못했습니다', {
        description: '잠시 후 다시 시도해주세요.',
      });
      return;
    }

    const clean = sanitizeCounters(parsed.data.counters, knownIds);
    if (Object.keys(clean.counters).length === 0) {
      toast.error('가져올 수 있는 항목이 없습니다');
      return;
    }

    setPending({
      filePath: result.filePath,
      counters: clean.counters,
      droppedOpponents: clean.droppedOpponents,
      droppedCounters: clean.droppedCounters,
    });
  };

  const applyImport = (mode: 'replace' | 'merge') => {
    if (!pending) return;

    const next = mode === 'replace' ? pending.counters : { ...counters, ...pending.counters };
    replaceAll(next);
    flushCountersNow();

    const dropped = pending.droppedOpponents.length + pending.droppedCounters;
    toast.success(
      mode === 'replace'
        ? `${Object.keys(pending.counters).length}개로 덮어썼습니다`
        : `${Object.keys(next).length}개가 되었습니다 (병합)`,
      dropped > 0 ? { description: `알 수 없는 챔피언 ${dropped}개는 제외했습니다.` } : undefined,
    );
    setPending(null);
  };

  const incomingCount = pending ? Object.keys(pending.counters).length : 0;
  const currentCount = Object.keys(counters).length;

  return (
    <>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExport}
          className="text-zinc-400 hover:text-zinc-100"
        >
          <Download className="w-4 h-4 mr-1.5" />
          내보내기
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleImport}
          className="text-zinc-400 hover:text-zinc-100"
        >
          <Upload className="w-4 h-4 mr-1.5" />
          가져오기
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="저장 폴더 열기"
          onClick={() => void window.electronApi!.revealCountersFile()}
          className="text-zinc-400 hover:text-zinc-100"
        >
          <FolderOpen className="w-4 h-4" />
        </Button>
      </div>

      <Dialog open={!!pending} onOpenChange={(open) => !open && setPending(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-zinc-100">
          <DialogHeader>
            <DialogTitle>카운터픽 가져오기</DialogTitle>
            <DialogDescription className="text-zinc-400">
              불러온 파일에 {incomingCount}개가 들어있습니다. 지금 설정은 {currentCount}개입니다.
              {pending && pending.droppedOpponents.length + pending.droppedCounters > 0 && (
                <span className="block mt-1 text-amber-400">
                  알 수 없는 챔피언 {pending.droppedOpponents.length + pending.droppedCounters}개는
                  제외됩니다.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="text-sm text-zinc-400 space-y-1.5">
            <p>
              <span className="text-zinc-200 font-medium">덮어쓰기</span> — 지금 설정을 모두 지우고
              파일 내용으로 바꿉니다.
            </p>
            <p>
              <span className="text-zinc-200 font-medium">병합</span> — 겹치는 챔피언은 파일 쪽으로
              바꾸고, 나머지 설정은 그대로 둡니다.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setPending(null)}>
              취소
            </Button>
            <Button variant="outline" onClick={() => applyImport('merge')}>
              병합
            </Button>
            <Button onClick={() => applyImport('replace')}>덮어쓰기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
