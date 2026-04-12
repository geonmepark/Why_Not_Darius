import { contextBridge, ipcRenderer } from 'electron';
import type { ElectronApi, LcuStatusEvent, LcuChampSelectEvent } from './lcu/types';

contextBridge.exposeInMainWorld('electronApi', {
  onLcuStatus: (cb: (event: LcuStatusEvent) => void) => {
    const listener = (_: Electron.IpcRendererEvent, event: LcuStatusEvent) => cb(event);
    ipcRenderer.on('lcu:status', listener);
    return () => ipcRenderer.removeListener('lcu:status', listener);
  },

  onLcuChampSelect: (cb: (event: LcuChampSelectEvent) => void) => {
    const listener = (_: Electron.IpcRendererEvent, event: LcuChampSelectEvent) => cb(event);
    ipcRenderer.on('lcu:champ-select', listener);
    return () => ipcRenderer.removeListener('lcu:champ-select', listener);
  },
} satisfies ElectronApi);
