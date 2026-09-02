import fs from 'node:fs';
import path from 'node:path';
import WebSocket from 'ws';
import { resolveLeagueInstallDir, resolveLeagueLockfilePath } from './resolve-lockfile';
import type { LcuCredentials, LcuChampSelectSession } from './types';

type WatcherEvent =
  | { type: 'connected'; credentials: LcuCredentials }
  | { type: 'disconnected' }
  | { type: 'champ-select'; session: LcuChampSelectSession }
  | { type: 'error'; message: string };

const CHAMP_SELECT_EVENT = 'OnJsonApiEvent_lol-champ-select_v1_session';

export class LcuWatcher {
  /** 생성자로 넘어온 고정 경로 — 테스트/수동 지정용. 없으면 매번 자동 탐색한다. */
  private readonly lockfileOverride: string | null;
  private fsWatcher: fs.FSWatcher | null = null;
  private pollTimer: NodeJS.Timeout | null = null;
  private ws: WebSocket | null = null;
  private stopped = false;

  constructor(
    private readonly emit: (event: WatcherEvent) => void,
    lockfilePath?: string,
  ) {
    this.lockfileOverride = lockfilePath ?? null;
  }

  /** 롤이 실행 중일 때만 락파일이 존재한다 — 매 확인마다 새로 찾는다(설치 경로 변경 대응) */
  private currentLockfilePath(): string | null {
    if (this.lockfileOverride) {
      return fs.existsSync(this.lockfileOverride) ? this.lockfileOverride : null;
    }
    return resolveLeagueLockfilePath();
  }

  start(): void {
    this.stopped = false;
    this.checkAndConnect();
    this.watchInstallDir();

    // 10초 폴백 폴링 — fs.watch 누락 방어 + 설치 디렉토리 재탐색
    this.pollTimer = setInterval(() => {
      this.checkAndConnect();
      if (!this.fsWatcher) this.watchInstallDir();
    }, 10_000);
  }

  /** 락파일이 생성/삭제되는 롤 설치 디렉토리를 감시 */
  private watchInstallDir(): void {
    const dir = this.lockfileOverride
      ? path.dirname(this.lockfileOverride)
      : resolveLeagueInstallDir();
    if (!dir) return; // 롤 미설치 — 폴링만 사용

    try {
      this.fsWatcher = fs.watch(dir, (event) => {
        if (event === 'rename') this.checkAndConnect();
      });
    } catch {
      this.fsWatcher = null;
    }
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

    const lockfilePath = this.currentLockfilePath();

    if (lockfilePath) {
      // 이미 연결됐거나 연결 시도 중이면 재연결 불필요
      if (
        this.ws &&
        (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)
      ) {
        return;
      }
      try {
        const content = fs.readFileSync(lockfilePath, 'utf-8');
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
