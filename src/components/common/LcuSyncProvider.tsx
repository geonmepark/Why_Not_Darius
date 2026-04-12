'use client';

import { useLcuSync } from '@/hooks/useLcu';

export function LcuSyncProvider({ children }: { children: React.ReactNode }) {
  useLcuSync();
  return <>{children}</>;
}
