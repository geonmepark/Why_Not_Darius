import type { StateStorage } from 'zustand/middleware';
import type { CountersFile } from '../../electron/api-types';

/**
 * zustand persist 의 저장소를 Electron 파일(userData/counters.json)로 돌린다.
 *
 * persist 는 { state: {...}, version: n } 형태의 문자열을 주고받는데, 파일에는
 * 사람이 읽기 좋은 { version, counters } 형태로 남겨야 하므로 여기서 변환한다.
 * Electron 이 없을 때(브라우저에서 next dev 만 실행)는 localStorage 로 떨어진다.
 */

const WRITE_DEBOUNCE_MS = 300;

interface PersistedShape {
  state?: { counters?: Record<string, string[]> };
  version?: number;
}

function toPersisted(file: CountersFile): string {
  return JSON.stringify({ state: { counters: file.counters }, version: 0 });
}

function toFile(raw: string): CountersFile {
  const parsed = JSON.parse(raw) as PersistedShape;
  return { version: 1, counters: parsed.state?.counters ?? {} };
}

let writeTimer: ReturnType<typeof setTimeout> | null = null;
let queued: CountersFile | null = null;

function flush(): void {
  const api = window.electronApi;
  if (!api || !queued) return;
  const payload = queued;
  queued = null;
  void api.writeCounters(payload).then((res) => {
    if (!res.ok) console.error('[counters] 저장 실패:', res.message);
  });
}

export const countersStorage: StateStorage = {
  getItem: async (name) => {
    const api = window.electronApi;
    if (!api) return localStorage.getItem(name);

    const file = await api.readCounters();
    return toPersisted(file);
  },

  setItem: async (name, value) => {
    const api = window.electronApi;
    if (!api) {
      localStorage.setItem(name, value);
      return;
    }

    // 카운터를 토글할 때마다 파일을 쓰지 않도록 묶어서 내보낸다
    queued = toFile(value);
    if (writeTimer) clearTimeout(writeTimer);
    writeTimer = setTimeout(flush, WRITE_DEBOUNCE_MS);
  },

  removeItem: async (name) => {
    const api = window.electronApi;
    if (!api) {
      localStorage.removeItem(name);
      return;
    }
    await api.writeCounters({ version: 1, counters: {} });
  },
};

/** 앱 종료 직전 등, 디바운스를 기다리지 않고 즉시 반영해야 할 때 */
export function flushCountersNow(): void {
  if (writeTimer) clearTimeout(writeTimer);
  writeTimer = null;
  flush();
}
