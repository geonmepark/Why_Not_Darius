import {
  app,
  BrowserWindow,
  Tray,
  Menu,
  nativeImage,
  shell,
  ipcMain,
  dialog,
  protocol,
  net,
} from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { LcuWatcher } from './lcu/watcher';
import { getCountersPath, isCountersFile, readCounters, writeCounters } from './storage/counters';
import type { CountersFile, CountersIoResult } from './api-types';
import type { LcuChampSelectEvent, LcuSnapshot, LcuStatusEvent } from './lcu/types';

/**
 * 앱 이름을 명시하지 않으면 dev 는 Electron 기본값을, 설치본은 빌드 설정값을 쓴다.
 * 두 경로가 갈리면 저장 데이터가 따라오지 못하므로 여기서 못 박는다.
 * userData 경로에 들어가는 값이라 공백 없는 형태를 쓴다 (표시 이름은 Why Not Dari).
 */
app.setName('why-not-dari');

/**
 * 락이 없으면 다시 실행할 때마다 창·트레이·LCU 워처가 하나씩 더 생긴다.
 * 락은 userData 경로 기준이라 위의 setName 뒤에 잡아야 한다.
 * 두 번째 실행은 바로 종료하고, 먼저 떠 있던 인스턴스가 second-instance 를 받아 창을 띄운다.
 */
const hasInstanceLock = app.requestSingleInstanceLock();
if (!hasInstanceLock) app.quit();

/**
 * app.getVersion() 은 dev 에서 Electron 자체 버전(41.x)을 돌려준다 — 앱 이름과 같은 이유로
 * package.json 이 앱 패키지로 로드되지 않기 때문이다. 업데이트 비교의 기준값이므로
 * 두 모드에서 같은 값이 나오도록 package.json 에서 직접 읽는다.
 *
 * 경로는 이 파일이 out/ 과 public/ 을 찾을 때 쓰는 것과 같은 __dirname 기준이다.
 * dev 는 dist-electron/../package.json, 패키징 후는 app.asar/package.json 이 된다.
 * (app.getAppPath() 는 dev 에서 dist-electron 을 가리켜 쓸 수 없다.)
 */
function readAppVersion(): string {
  const file = path.join(__dirname, '../package.json');
  try {
    const pkg = JSON.parse(fs.readFileSync(file, 'utf-8')) as { version?: string };
    if (pkg.version) return pkg.version;
    console.error(`[app] package.json 에 version 이 없습니다: ${file}`);
  } catch (err) {
    console.error(`[app] 버전을 읽지 못했습니다: ${file}`, err);
  }
  return app.getVersion();
}

const isDev = !app.isPackaged;
const NEXT_DEV_URL = 'http://localhost:8157';

/**
 * 정적 export 된 페이지는 자산을 절대경로(/_next/...)로 참조한다. file:// 에서는
 * 그 슬래시가 드라이브 루트로 해석돼 전부 404 가 되고, 결국 JS 가 하나도 로드되지
 * 않아 앱이 껍데기만 뜬다. out/ 을 루트로 삼는 스킴을 등록해 해결한다.
 */
const APP_SCHEME = 'app';
const APP_ORIGIN = `${APP_SCHEME}://bundle`;
const OUT_DIR = path.join(__dirname, '../out');

protocol.registerSchemesAsPrivileged([
  {
    scheme: APP_SCHEME,
    privileges: { standard: true, secure: true, supportFetchAPI: true },
  },
]);

function registerAppProtocol(): void {
  protocol.handle(APP_SCHEME, (request) => {
    const { pathname } = new URL(request.url);
    let filePath = path.join(OUT_DIR, decodeURIComponent(pathname));

    // trailingSlash 로 내보낸 라우트는 디렉토리 + index.html 형태다
    if (!path.extname(filePath)) filePath = path.join(filePath, 'index.html');

    // out/ 밖을 가리키는 경로는 거부한다
    if (!filePath.startsWith(OUT_DIR)) {
      return new Response('Forbidden', { status: 403 });
    }
    return net.fetch(pathToFileURL(filePath).toString());
  });
}

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let watcher: LcuWatcher | null = null;

/**
 * 워처는 창이 뜬 직후 연결되지만, 렌더러(Next 페이지)는 몇 초 뒤에야 리스너를 등록한다.
 * 그 사이 푸시된 이벤트는 유실되므로 마지막 상태를 들고 있다가 렌더러가 요청할 때 돌려준다.
 */
const snapshot: LcuSnapshot = { status: 'disconnected', champSelect: null };

const appIconPath = path.join(__dirname, '../public/icons/app-icon.png');

function showMainWindow(): void {
  if (!mainWindow) return;
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 480,
    height: 700,
    alwaysOnTop: false, // 개발 중엔 false, 필요 시 true로 변경
    resizable: true,
    icon: appIconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL(`${NEXT_DEV_URL}/app`);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadURL(`${APP_ORIGIN}/app/index.html`);
  }

  // 창 닫기 → 트레이로 숨기기 (앱 종료 아님)
  mainWindow.on('close', (e) => {
    e.preventDefault();
    mainWindow?.hide();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

function createTray(): void {
  const icon = nativeImage.createFromPath(appIconPath);
  tray = new Tray(
    icon.isEmpty() ? nativeImage.createEmpty() : icon.resize({ width: 16, height: 16 }),
  );

  tray.setToolTip('Why Not Dari');

  const menu = Menu.buildFromTemplate([
    {
      label: '열기',
      click: showMainWindow,
    },
    { type: 'separator' },
    {
      label: '종료',
      click: () => {
        mainWindow?.removeAllListeners('close');
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(menu);

  tray.on('click', () => {
    if (mainWindow?.isVisible()) {
      mainWindow.hide();
    } else {
      showMainWindow();
    }
  });
}

function startWatcher(): void {
  watcher = new LcuWatcher((event) => {
    switch (event.type) {
      case 'connected': {
        snapshot.status = 'connected';
        const payload: LcuStatusEvent = { status: 'connected' };
        mainWindow?.webContents.send('lcu:status', payload);
        break;
      }

      case 'disconnected': {
        snapshot.status = 'disconnected';
        snapshot.champSelect = null;
        const payload: LcuStatusEvent = { status: 'disconnected' };
        mainWindow?.webContents.send('lcu:status', payload);
        break;
      }

      case 'champ-select': {
        const payload: LcuChampSelectEvent = {
          theirTeam: event.session.theirTeam,
          phase: event.session.timer?.phase ?? '',
        };
        snapshot.champSelect = payload;
        mainWindow?.webContents.send('lcu:champ-select', payload);
        break;
      }

      case 'champ-select-end': {
        // 빈 팀을 보내 렌더러가 픽 화면을 내리게 한다 (새 IPC 채널 없이 기존 경로 재사용)
        snapshot.champSelect = null;
        const payload: LcuChampSelectEvent = { theirTeam: [], phase: '' };
        mainWindow?.webContents.send('lcu:champ-select', payload);
        break;
      }

      case 'error':
        console.error('[LcuWatcher]', event.message);
        break;
    }
  });

  watcher.start();
}

function exportFileName(): string {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `why-not-dari-counters-${today}.json`;
}

function registerCountersIpc(): void {
  ipcMain.handle('counters:read', (): CountersFile => readCounters());

  ipcMain.handle('counters:path', (): string => getCountersPath());

  ipcMain.handle('counters:write', (_e, data: unknown): { ok: boolean; message?: string } => {
    if (!isCountersFile(data))
      return { ok: false, message: '저장하려는 데이터 형식이 올바르지 않습니다.' };
    try {
      writeCounters(data);
      return { ok: true };
    } catch (err) {
      console.error('[counters] 저장 실패', err);
      return { ok: false, message: String(err) };
    }
  });

  ipcMain.handle('counters:reveal', (): void => {
    shell.showItemInFolder(getCountersPath());
  });

  ipcMain.handle('counters:export', async (_e, data: unknown): Promise<CountersIoResult> => {
    if (!isCountersFile(data))
      return { status: 'error', message: '내보낼 데이터 형식이 올바르지 않습니다.' };

    const result = await dialog.showSaveDialog({
      title: '카운터픽 내보내기',
      defaultPath: exportFileName(),
      filters: [{ name: 'JSON', extensions: ['json'] }],
    });
    if (result.canceled || !result.filePath) return { status: 'canceled' };

    try {
      fs.writeFileSync(result.filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf-8');
      return { status: 'ok', filePath: result.filePath, data };
    } catch (err) {
      return { status: 'error', message: String(err) };
    }
  });

  // 파일을 읽어 돌려주기만 한다 — 적용 여부(덮어쓰기/병합)는 렌더러가 결정한다
  ipcMain.handle('counters:import', async (): Promise<CountersIoResult> => {
    const result = await dialog.showOpenDialog({
      title: '카운터픽 가져오기',
      properties: ['openFile'],
      filters: [{ name: 'JSON', extensions: ['json'] }],
    });
    const filePath = result.filePaths[0];
    if (result.canceled || !filePath) return { status: 'canceled' };

    try {
      const parsed: unknown = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (!isCountersFile(parsed)) {
        return { status: 'error', message: '카운터픽 파일 형식이 아닙니다.' };
      }
      return { status: 'ok', filePath, data: parsed };
    } catch (err) {
      return { status: 'error', message: `파일을 읽지 못했습니다: ${String(err)}` };
    }
  });
}

// 락을 못 잡은 인스턴스는 종료 중이다 — 창·트레이·워처를 만들지 않는다
if (hasInstanceLock) {
  app.on('second-instance', showMainWindow);

  app.whenReady().then(() => {
    if (!isDev) registerAppProtocol();

    ipcMain.handle('lcu:get-snapshot', (): LcuSnapshot => snapshot);
    ipcMain.handle('app:get-version', (): string => readAppVersion());
    registerCountersIpc();

    app.dock?.setIcon(appIconPath);
    createWindow();
    createTray();
    startWatcher();
  });
}

// 창이 모두 닫혀도 트레이로 상주 — 종료하지 않음
app.on('window-all-closed', () => {
  // 아무것도 하지 않음 (macOS 포함)
});

app.on('before-quit', () => {
  watcher?.stop();
});

app.on('activate', showMainWindow);
