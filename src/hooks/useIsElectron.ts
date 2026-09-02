'use client';

import { useSyncExternalStore } from 'react';

// preload 가 주입하는 값이라 로드 후 바뀌지 않는다 — 구독할 대상이 없다
const noopSubscribe = () => () => {};
const getSnapshot = () => typeof window !== 'undefined' && !!window.electronApi;
const getServerSnapshot = () => false;

/** SSR 과 클라이언트를 안전하게 가르는 Electron 실행 여부 */
export function useIsElectron(): boolean {
  return useSyncExternalStore(noopSubscribe, getSnapshot, getServerSnapshot);
}
