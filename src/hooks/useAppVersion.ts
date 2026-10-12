'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

const LAST_SEEN_VERSION_KEY = 'app:last-seen-version';

/** 설치된 앱 버전. 브라우저 개발 환경(electronApi 없음)에서는 null */
export function useAppVersion(): string | null {
  const { data } = useQuery({
    queryKey: ['app', 'version'],
    queryFn: async () => (await window.electronApi?.getAppVersion()) ?? null,
    staleTime: Infinity,
    enabled: typeof window !== 'undefined',
  });
  return data ?? null;
}

/**
 * 자동 업데이트는 종료할 때 조용히 설치돼, 다시 켰을 때 바뀐 걸 알 길이 없다.
 * 마지막으로 본 버전과 다르면 한 번 알린다. 처음 켠 경우(기록 없음)는 기록만 한다.
 */
export function useUpdatedNotice(version: string | null): void {
  useEffect(() => {
    if (!version) return;
    try {
      const lastSeen = localStorage.getItem(LAST_SEEN_VERSION_KEY);
      if (lastSeen && lastSeen !== version) toast.success(`v${version} 로 업데이트됐어요`);
      localStorage.setItem(LAST_SEEN_VERSION_KEY, version);
    } catch {
      // 저장소를 못 쓰면 알림만 건너뛴다 — 버전 표시는 그대로 보인다
    }
  }, [version]);
}
