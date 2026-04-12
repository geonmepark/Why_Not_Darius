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

export type ElectronApi = {
  onLcuStatus: (cb: (event: LcuStatusEvent) => void) => () => void;
  onLcuChampSelect: (cb: (event: LcuChampSelectEvent) => void) => () => void;
};
