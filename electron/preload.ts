import { contextBridge, ipcRenderer } from 'electron';
import type {
  CountersFile,
  CountersIoResult,
  ElectronApi,
  LcuChampSelectEvent,
  LcuSnapshot,
  LcuStatusEvent,
} from './api-types';

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

  getSnapshot: (): Promise<LcuSnapshot> => ipcRenderer.invoke('lcu:get-snapshot'),

  readCounters: (): Promise<CountersFile> => ipcRenderer.invoke('counters:read'),
  writeCounters: (data: CountersFile): Promise<{ ok: boolean; message?: string }> =>
    ipcRenderer.invoke('counters:write', data),
  exportCounters: (data: CountersFile): Promise<CountersIoResult> =>
    ipcRenderer.invoke('counters:export', data),
  importCounters: (): Promise<CountersIoResult> => ipcRenderer.invoke('counters:import'),
  revealCountersFile: (): Promise<void> => ipcRenderer.invoke('counters:reveal'),
  getCountersPath: (): Promise<string> => ipcRenderer.invoke('counters:path'),

  getAppVersion: (): Promise<string> => ipcRenderer.invoke('app:get-version'),
} satisfies ElectronApi);
