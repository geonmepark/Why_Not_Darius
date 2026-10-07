'use client';

import { useEffect, useState } from 'react';
import type { AutoUpdateStatus } from '../../electron/api-types';

/** 메인 프로세스의 자동 업데이트 상태 — 렌더러가 늦게 떠도 현재 값을 먼저 끌어온다 */
export function useAutoUpdateStatus(): AutoUpdateStatus {
  const [status, setStatus] = useState<AutoUpdateStatus>({ state: 'unsupported' });

  useEffect(() => {
    const api = window.electronApi;
    if (!api) return;

    let cancelled = false;
    const unsubscribe = api.onAutoUpdateStatus((next) => {
      cancelled = true; // 푸시가 먼저 오면 뒤늦은 조회 결과로 덮지 않는다
      setStatus(next);
    });
    void api.getAutoUpdateStatus().then((current) => {
      if (!cancelled) setStatus(current);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return status;
}
