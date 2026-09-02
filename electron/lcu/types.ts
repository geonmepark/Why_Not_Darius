export interface LcuCredentials {
  port: number;
  password: string;
  protocol: 'https' | 'http';
}

export interface LcuChampSelectCell {
  championId: number;
  assignedPosition: string;
  cellId: number;
}

export interface LcuChampSelectSession {
  myTeam: LcuChampSelectCell[];
  theirTeam: LcuChampSelectCell[];
  localPlayerCellId: number;
  timer: { phase: string };
}

export type LcuStatus = 'disconnected' | 'connecting' | 'connected';

// IPC 메시지 shape
export interface LcuStatusEvent {
  status: LcuStatus;
}

export interface LcuChampSelectEvent {
  theirTeam: LcuChampSelectCell[];
  phase: string;
}

/** 렌더러가 마운트 시점에 현재 상태를 끌어오기 위한 스냅샷 */
export interface LcuSnapshot {
  status: LcuStatus;
  champSelect: LcuChampSelectEvent | null;
}

// ElectronApi 는 LCU 외 채널도 담게 되어 electron/api-types.ts 로 옮겼다.
