import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchLatestVersion, fetchChampions, fetchChampionPositions } from '@/lib/ddragon';
import type { Champion } from '@/types/champion';

export function useDDragonVersion() {
  return useQuery({
    queryKey: ['ddragon', 'version'],
    queryFn: fetchLatestVersion,
    staleTime: Infinity,
  });
}

export function useChampions(): {
  data: Champion[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data: version } = useDDragonVersion();

  const champQuery = useQuery({
    queryKey: ['ddragon', 'champions', version],
    queryFn: () => fetchChampions(version!),
    enabled: !!version,
    staleTime: Infinity,
  });

  const posQuery = useQuery({
    queryKey: ['cdragon', 'champion-positions'],
    queryFn: fetchChampionPositions,
    staleTime: Infinity,
  });

  const data = useMemo(() => {
    if (!champQuery.data || !posQuery.data) return undefined;
    return champQuery.data.map((c) => ({
      ...c,
      positions: posQuery.data[c.key] ?? [],
    }));
  }, [champQuery.data, posQuery.data]);

  return {
    data,
    isLoading: champQuery.isLoading || posQuery.isLoading,
    isError: champQuery.isError || posQuery.isError,
  };
}

export function useChampionMap(): Record<string, Champion> {
  const { data: champions } = useChampions();

  return useMemo(() => {
    if (!champions) return {};
    return Object.fromEntries(champions.map((c) => [c.id, c]));
  }, [champions]);
}
