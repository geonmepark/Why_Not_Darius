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

    // 리스너 등록 전에 이미 지나간 이벤트 복구 — 창은 뜨자마자 연결되지만
    // 이 훅은 Next 페이지가 로드된 뒤에야 실행되므로 첫 'connected'를 놓친다.
    let cancelled = false;
    void api.getSnapshot().then((snapshot) => {
      if (cancelled) return;
      setStatus(snapshot.status);
      if (snapshot.champSelect) {
        setChampSelect(snapshot.champSelect.theirTeam, snapshot.champSelect.phase);
      }
    });

    return () => {
      cancelled = true;
      unsubStatus();
      unsubChampSelect();
    };
  }, [setStatus, setChampSelect, clearChampSelect]);
}
