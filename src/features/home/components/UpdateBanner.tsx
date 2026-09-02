'use client';

import { ArrowUpRight, Sparkles } from 'lucide-react';
import { useUpdateCheck } from '@/hooks/useUpdateCheck';
import { RELEASES_URL } from '@/lib/marketing/releases';

export function UpdateBanner() {
  const update = useUpdateCheck();
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
