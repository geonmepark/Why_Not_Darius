'use client';

import { ArrowUpRight, Sparkles } from 'lucide-react';
import { useAutoUpdateStatus } from '@/hooks/useAutoUpdateStatus';
import { useUpdateCheck } from '@/hooks/useUpdateCheck';
import { RELEASES_URL } from '@/lib/marketing/releases';

export function UpdateBanner() {
  const update = useUpdateCheck();
  const autoUpdate = useAutoUpdateStatus();

  // Windows 설치본은 알아서 받아 종료 시 설치한다 — 다 받은 뒤에만 알린다
  if (autoUpdate.state === 'downloaded') {
    return (
      <div className="flex items-center gap-2 border-b border-blue-500/30 bg-blue-500/10 px-5 py-2.5 text-sm text-blue-200">
        <Sparkles className="size-4 shrink-0" />
        <span className="flex-1">
          새 버전 <span className="font-semibold">{autoUpdate.version}</span> 을 받아뒀어요.
          트레이에서 종료하면 설치돼요
        </span>
      </div>
    );
  }
  if (autoUpdate.state === 'pending') return null;

  // macOS·dev, 또는 자동 업데이트가 실패했을 때는 릴리스 페이지로 안내한다
  if (!update) return null;

  return (
    <a
      href={update.notesUrl || RELEASES_URL}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 border-b border-blue-500/30 bg-blue-500/10 px-5 py-2.5 text-sm text-blue-200 transition-colors hover:bg-blue-500/20"
    >
      <Sparkles className="size-4 shrink-0" />
      <span className="flex-1">
        새 버전 <span className="font-semibold">{update.version}</span> 이 나왔어요
      </span>
      <span className="inline-flex items-center gap-0.5 text-xs text-blue-300">
        받으러 가기
        <ArrowUpRight className="size-3.5" />
      </span>
    </a>
  );
}
