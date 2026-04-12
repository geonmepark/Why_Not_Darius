import { app, BrowserWindow, Tray, Menu, nativeImage, shell } from 'electron';
import path from 'node:path';
import { LcuWatcher } from './lcu/watcher';
import type { LcuChampSelectEvent, LcuStatusEvent } from './lcu/types';

const isDev = !app.isPackaged;
const NEXT_DEV_URL = 'http://localhost:8157';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let watcher: LcuWatcher | null = null;

const appIconPath = path.join(__dirname, '../public/icons/app-icon.png');

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
    mainWindow.loadURL(NEXT_DEV_URL);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../out/index.html'));
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
  tray = new Tray(icon.isEmpty() ? nativeImage.createEmpty() : icon.resize({ width: 16, height: 16 }));

  tray.setToolTip('Why Not Dari');

  const menu = Menu.buildFromTemplate([
    {
      label: '열기',
      click: () => {
        mainWindow?.show();
        mainWindow?.focus();
      },
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
      mainWindow?.show();
      mainWindow?.focus();
    }
  });
}

function startWatcher(): void {
  watcher = new LcuWatcher((event) => {
    if (!mainWindow) return;

    switch (event.type) {
      case 'connected':
        mainWindow.webContents.send('lcu:status', {
          status: 'connected',
        } satisfies LcuStatusEvent);
        break;

      case 'disconnected':
        mainWindow.webContents.send('lcu:status', {
          status: 'disconnected',
        } satisfies LcuStatusEvent);
        break;

      case 'champ-select':
        mainWindow.webContents.send('lcu:champ-select', {
          theirTeam: event.session.theirTeam,
          phase: event.session.timer?.phase ?? '',
        } satisfies LcuChampSelectEvent);
        break;

      case 'error':
        console.error('[LcuWatcher]', event.message);
        break;
    }
  });

  watcher.start();
}

app.whenReady().then(() => {
  app.dock?.setIcon(appIconPath);
  createWindow();
  createTray();
  startWatcher();
});

// 창이 모두 닫혀도 트레이로 상주 — 종료하지 않음
app.on('window-all-closed', () => {
  // 아무것도 하지 않음 (macOS 포함)
});

app.on('before-quit', () => {
  watcher?.stop();
});

app.on('activate', () => {
  mainWindow?.show();
});
