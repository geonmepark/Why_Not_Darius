import type { LcuChampSelectEvent, LcuSnapshot, LcuStatusEvent } from './lcu/types';

export type {
  LcuChampSelectCell,
  LcuChampSelectEvent,
  LcuSnapshot,
  LcuStatus,
  LcuStatusEvent,
} from './lcu/types';

/** 상대 챔피언 DDragon id("Aatrox") → 카운터픽 id 배열 (최대 3개) */
export type CounterMap = Record<string, string[]>;

/** userData/counters.json 의 내용 */
export interface CountersFile {
  version: number;
  counters: CounterMap;
}

/** 내보내기/가져오기 결과 — 사용자가 다이얼로그를 취소할 수 있다 */
export type CountersIoResult =
  | { status: 'ok'; filePath: string; data: CountersFile }
  | { status: 'canceled' }
  | { status: 'error'; message: string };

export type ElectronApi = {
  onLcuStatus: (cb: (event: LcuStatusEvent) => void) => () => void;
  onLcuChampSelect: (cb: (event: LcuChampSelectEvent) => void) => () => void;
  /** 푸시 이벤트를 놓친 렌더러(늦은 마운트/리로드)가 현재 상태를 복구하는 경로 */
  getSnapshot: () => Promise<LcuSnapshot>;

  readCounters: () => Promise<CountersFile>;
  writeCounters: (data: CountersFile) => Promise<{ ok: boolean; message?: string }>;
  exportCounters: (data: CountersFile) => Promise<CountersIoResult>;
  importCounters: () => Promise<CountersIoResult>;
  /** 저장 파일을 탐색기/파인더에서 보여준다 */
  revealCountersFile: () => Promise<void>;
  getCountersPath: () => Promise<string>;

  /** 설치된 앱 버전 — 최신 릴리즈와 비교해 업데이트 배너를 띄우는 데 쓴다 */
  getAppVersion: () => Promise<string>;
};
