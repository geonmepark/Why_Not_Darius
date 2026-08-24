'use client';

import { useSyncExternalStore } from 'react';

export type DetectedOS = 'mac' | 'windows' | 'linux' | 'other' | 'unknown';

export const OS_LABEL: Record<DetectedOS, string> = {
  mac: 'macOS',
  windows: 'Windows',
  linux: 'Linux',
  other: '기타',
  unknown: '감지 중',
};

function detectOS(): DetectedOS {
  if (typeof window === 'undefined') return 'unknown';
  const ua = window.navigator.userAgent.toLowerCase();
  const platform = (window.navigator.platform || '').toLowerCase();
  const haystack = `${ua} ${platform}`;
  if (haystack.includes('mac')) return 'mac';
  if (haystack.includes('win')) return 'windows';
  if (haystack.includes('linux')) return 'linux';
  return 'other';
}

// 결과는 한 번 결정되면 바뀌지 않음 — 빈 구독자
const noopSubscribe = () => () => {};
const serverSnapshot = (): DetectedOS => 'unknown';

export function useDetectedOS(): DetectedOS {
  return useSyncExternalStore(noopSubscribe, detectOS, serverSnapshot);
}
