'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { getQueryClient } from '@/lib/query-client';
import { LcuSyncProvider } from './LcuSyncProvider';
import { CountersMigrationProvider } from './CountersMigrationProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const queryClient = getQueryClient();

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CountersMigrationProvider>
            <LcuSyncProvider>{children}</LcuSyncProvider>
          </CountersMigrationProvider>
        </TooltipProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
