import type { ElectronApi } from '../../electron/lcu/types';

declare global {
  interface Window {
    electronApi?: ElectronApi;
  }
}
