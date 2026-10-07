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

/**
 * Windows 설치본만 자동 업데이트한다. macOS 는 서명·공증 없이는 업데이트를 적용할 수 없어
 * 기존처럼 릴리스 페이지로 안내한다.
 * - unsupported: dev 실행이거나 macOS — 수동 안내
 * - pending: 확인·다운로드 중이거나 이미 최신
 * - downloaded: 받아둠, 앱을 종료하면 설치된다
 * - error: 자동 업데이트 실패 — 수동 안내로 되돌린다
 */
export type AutoUpdateStatus =
  | { state: 'unsupported' | 'pending' | 'error' }
  | { state: 'downloaded'; version: string };

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
  getAutoUpdateStatus: () => Promise<AutoUpdateStatus>;
  onAutoUpdateStatus: (cb: (status: AutoUpdateStatus) => void) => () => void;
};
