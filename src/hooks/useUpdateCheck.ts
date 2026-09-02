'use client';

import { useQuery } from '@tanstack/react-query';
import { getLatestRelease } from '@/lib/marketing/releases';
import { isNewerVersion } from '@/lib/version';

interface UpdateInfo {
  version: string;
  notesUrl: string;
}

/**
 * 설치된 버전과 최신 GitHub Release 를 비교한다.
 *
 * LCU API 는 Riot 이 예고 없이 바꿀 수 있어 앱이 언젠가 깨진다. 자동 업데이트는
 * 미서명 상태에서 설치 경고를 다시 만나 경험이 더 나빠지므로, 알림만 띄우고
 * 내려받기는 브라우저로 넘긴다.
 */
export function useUpdateCheck(): UpdateInfo | null {
  const { data } = useQuery({
    queryKey: ['app', 'update-check'],
    queryFn: async (): Promise<UpdateInfo | null> => {
      const api = window.electronApi;
      if (!api) return null;

      const [current, release] = await Promise.all([api.getAppVersion(), getLatestRelease()]);
      if (!release || !isNewerVersion(release.version, current)) return null;

      return { version: release.version, notesUrl: release.notesUrl };
    },
    // 실행 중 계속 물어볼 이유가 없다. 앱을 다시 켜면 다시 확인한다.
    staleTime: Infinity,
    retry: false,
    // 브라우저 개발 환경에서는 electronApi 가 없어 항상 null 이다
    enabled: typeof window !== 'undefined',
  });

  return data ?? null;
}
