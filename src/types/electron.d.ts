import type { ElectronApi } from '../../electron/api-types';

declare global {
  interface Window {
    electronApi?: ElectronApi;
  }
}
