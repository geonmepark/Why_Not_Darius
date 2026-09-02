'use client';

import { useCountersMigration } from '@/hooks/useCountersMigration';

export function CountersMigrationProvider({ children }: { children: React.ReactNode }) {
  useCountersMigration();
  return <>{children}</>;
}
