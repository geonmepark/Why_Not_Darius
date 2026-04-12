import fs from 'node:fs';
import path from 'node:path';
import WebSocket from 'ws';
import type { LcuCredentials, LcuChampSelectSession } from './types';

type WatcherEvent =
  | { type: 'connected'; credentials: LcuCredentials }
  | { type: 'disconnected' }
  | { type: 'champ-select'; session: LcuChampSelectSession }
  | { type: 'error'; message: string };

const CHAMP_SELECT_EVENT = 'OnJsonApiEvent_lol-champ-select_v1_session';

export class LcuWatcher {
  private readonly lockfilePath: string;
  private fsWatcher: fs.FSWatcher | null = null;
  private pollTimer: NodeJS.Timeout | null = null;
  private ws: WebSocket | null = null;
  private stopped = false;

  constructor(private readonly emit: (event: WatcherEvent) => void, lockfilePath?: string) {
    this.lockfilePath =
      lockfilePath ??
      path.join(
        process.env.LOCALAPPDATA ?? path.join(process.env.HOME ?? '', 'AppData', 'Local'),
        'Riot Games',
        'Riot Client',
        'Config',
        'lockfile',
      );
  }

  start(): void {
    this.stopped = false;
    this.checkAndConnect();

    // 디렉토리 감시 — rename 이벤트로 락파일 생성/삭제 감지
    const dir = path.dirname(this.lockfilePath);
    try {
      this.fsWatcher = fs.watch(dir, (event) => {
        if (event === 'rename') this.checkAndConnect();
      });
    } catch {
      // 디렉토리가 없으면(롤 미설치) 폴링만 사용
    }

    // 10초 폴백 폴링 — fs.watch 누락 방어
    this.pollTimer = setInterval(() => this.checkAndConnect(), 10_000);
  }

  stop(): void {
    this.stopped = true;
    this.fsWatcher?.close();
    this.fsWatcher = null;
    if (this.pollTimer) clearInterval(this.pollTimer);
    this.pollTimer = null;
    this.disconnectWs();
  }

  private checkAndConnect(): void {
    if (this.stopped) return;

    if (fs.existsSync(this.lockfilePath)) {
      // 이미 연결 중이면 재연결 불필요
      if (this.ws && this.ws.readyState === WebSocket.OPEN) return;
      try {
        const content = fs.readFileSync(this.lockfilePath, 'utf-8');
        const credentials = this.parseLockfile(content);
        this.connectWs(credentials);
      } catch (err) {
        this.emit({ type: 'error', message: String(err) });
      }
    } else {
      if (this.ws) {
        this.disconnectWs();
        this.emit({ type: 'disconnected' });
      }
    }
  }

  private parseLockfile(content: string): LcuCredentials {
    const parts = content.trim().split(':');
    return {
      port: parseInt(parts[2], 10),
      password: parts[3],
      protocol: parts[4] as 'https' | 'http',
    };
  }

  private connectWs(credentials: LcuCredentials): void {
    this.disconnectWs();
    this.emit({ type: 'disconnected' }); // 연결 시도 전 상태 초기화

    const { port, password } = credentials;
    const auth = Buffer.from(`riot:${password}`).toString('base64');

    this.ws = new WebSocket(`wss://127.0.0.1:${port}/`, {
      headers: { Authorization: `Basic ${auth}` },
      rejectUnauthorized: false, // LCU 자체 서명 인증서
    });

    this.ws.on('open', () => {
      this.ws!.send(JSON.stringify([5, CHAMP_SELECT_EVENT]));
      this.emit({ type: 'connected', credentials });
    });

    this.ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString()) as unknown[];
        if (msg[0] === 8 && msg[1] === CHAMP_SELECT_EVENT) {
          const payload = msg[2] as { data: LcuChampSelectSession };
          this.emit({ type: 'champ-select', session: payload.data });
        }
      } catch {
        // 파싱 실패 무시
      }
    });

    this.ws.on('close', () => {
      this.emit({ type: 'disconnected' });
      // 락파일이 아직 있으면 5초 후 재연결 시도
      setTimeout(() => this.checkAndConnect(), 5_000);
    });

    this.ws.on('error', (err) => {
      this.emit({ type: 'error', message: err.message });
    });
  }

  private disconnectWs(): void {
    if (this.ws) {
      this.ws.removeAllListeners();
      this.ws.terminate();
      this.ws = null;
    }
  }
}
