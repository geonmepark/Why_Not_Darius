'use client';

import { useEffect } from 'react';
import { useLcuStore } from '@/store/lcu';

export function useLcuSync(): void {
  const setStatus = useLcuStore((s) => s.setStatus);
  const setChampSelect = useLcuStore((s) => s.setChampSelect);
  const clearChampSelect = useLcuStore((s) => s.clearChampSelect);

  useEffect(() => {
    const api = window.electronApi;
    if (!api) return; // 브라우저 개발 환경 (Electron 없이 next dev 실행 시)

    const unsubStatus = api.onLcuStatus((event) => {
      setStatus(event.status);
      if (event.status === 'disconnected') clearChampSelect();
    });

    const unsubChampSelect = api.onLcuChampSelect((event) => {
      setChampSelect(event.theirTeam, event.phase);
    });

    return () => {
      unsubStatus();
      unsubChampSelect();
    };
  }, [setStatus, setChampSelect, clearChampSelect]);
}
