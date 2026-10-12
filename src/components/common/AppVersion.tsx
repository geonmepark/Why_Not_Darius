'use client';

import { useAppVersion } from '@/hooks/useAppVersion';
import { cn } from '@/lib/utils';

/** 화면 하단 버전 표시 — 업데이트가 됐는지 언제든 확인할 수 있게 */
export function AppVersion({ className }: { className?: string }) {
  const version = useAppVersion();
  if (!version) return null;

  return (
    <footer className={cn('py-3 text-center text-xs text-zinc-600', className)}>v{version}</footer>
  );
}
