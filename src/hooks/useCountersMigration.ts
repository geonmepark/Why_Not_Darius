'use client';

import { useEffect } from 'react';
import { useCounterStore } from '@/store/counter';

const LEGACY_KEY = 'wnd-counters';

interface LegacyShape {
  state?: { counters?: Record<string, string[]> };
}

/**
 * localStorage(leveldb) 에만 있던 카운터픽을 userData/counters.json 으로 1회 이관한다.
 *
 * 파일에 이미 데이터가 있으면 건드리지 않는다. 이관 후에도 localStorage 원본은
 * 지우지 않는다 — 되돌릴 여지를 남긴다.
 *
 * dev 와 설치본은 서로 다른 leveldb 를 쓰므로 이건 dev→dev 만 커버한다.
 * dev→설치본 이전은 내보내기/가져오기로 처리한다.
 */
export function useCountersMigration(): void {
  useEffect(() => {
    const api = window.electronApi;
    if (!api) return;

    let cancelled = false;

    void (async () => {
      const file = await api.readCounters();
      if (cancelled || Object.keys(file.counters).length > 0) return;

      const raw = localStorage.getItem(LEGACY_KEY);
      if (!raw) return;

      let legacy: Record<string, string[]> = {};
      try {
        legacy = (JSON.parse(raw) as LegacyShape).state?.counters ?? {};
      } catch {
        return; // 옛 데이터가 깨져 있으면 조용히 넘어간다
      }

      const count = Object.keys(legacy).length;
      if (count === 0) return;

      const result = await api.writeCounters({ version: 1, counters: legacy });
      if (!result.ok) {
        console.error('[counters] 이관 실패:', result.message);
        return;
      }

      console.info(`[counters] localStorage 에서 ${count}개를 counters.json 으로 이관했습니다.`);
      if (!cancelled) useCounterStore.setState({ counters: legacy });
    })();

    return () => {
      cancelled = true;
    };
  }, []);
}
