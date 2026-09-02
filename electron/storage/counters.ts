import { app } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import type { CountersFile } from '../api-types';

const FILE_NAME = 'counters.json';
/**
 * userData 루트는 Chromium 이 Cache, Preferences, Local State 등을 만드는 자리다.
 * 앱 데이터는 하위 폴더로 분리해 이름 충돌을 막고, 폴더째 백업할 수 있게 한다.
 */
const DATA_DIR = 'data';
export const CURRENT_VERSION = 1;

/**
 * 저장 위치는 OS 가 유저별로 정해둔 자리다 — 앱을 어느 드라이브에 설치했는지와 무관하다.
 *   Windows: %APPDATA%/<앱이름>/data/counters.json
 *   macOS  : ~/Library/Application Support/<앱이름>/data/counters.json
 */
export function getCountersPath(): string {
  return path.join(app.getPath('userData'), DATA_DIR, FILE_NAME);
}

/** data/ 하위로 옮기기 전에 쓰던 자리 */
function getLegacyCountersPath(): string {
  return path.join(app.getPath('userData'), FILE_NAME);
}

/** 루트에 있던 파일을 data/ 로 한 번만 이사시킨다 */
function moveLegacyFileIfNeeded(): void {
  const target = getCountersPath();
  const legacy = getLegacyCountersPath();
  if (fs.existsSync(target) || !fs.existsSync(legacy)) return;

  try {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.renameSync(legacy, target);
    console.info(`[counters] 저장 위치를 옮겼습니다: ${legacy} -> ${target}`);
  } catch (err) {
    console.error('[counters] 저장 위치 이동 실패', err);
  }
}

export function emptyFile(): CountersFile {
  return { version: CURRENT_VERSION, counters: {} };
}

/** 파싱된 값이 CountersFile 모양인지 — 손상 파일을 store 에 그대로 흘리지 않는다 */
export function isCountersFile(value: unknown): value is CountersFile {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<CountersFile>;
  if (typeof candidate.counters !== 'object' || candidate.counters === null) return false;
  return Object.values(candidate.counters).every(
    (list) => Array.isArray(list) && list.every((id) => typeof id === 'string'),
  );
}

/**
 * 읽기 실패 시 원본을 counters.corrupt-<시각>.json 으로 격리한다.
 * 조용히 빈 값으로 덮어쓰면 사용자가 손으로 넣은 데이터가 영영 사라진다.
 */
function quarantine(file: string, reason: unknown): void {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const target = path.join(path.dirname(file), `counters.corrupt-${stamp}.json`);
  try {
    fs.renameSync(file, target);
    console.error(`[counters] 읽기 실패, 원본을 보존했습니다: ${target}`, reason);
  } catch (err) {
    console.error('[counters] 손상 파일 격리 실패', err);
  }
}

export function readCounters(): CountersFile {
  moveLegacyFileIfNeeded();

  const file = getCountersPath();
  if (!fs.existsSync(file)) return emptyFile();

  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(file, 'utf-8'));
    if (!isCountersFile(parsed)) throw new Error('예상과 다른 형식');
    // 알 수 없는 버전이어도 counters 는 그대로 통과시킨다 — 임의로 버리지 않는다
    return { version: parsed.version ?? CURRENT_VERSION, counters: parsed.counters };
  } catch (reason) {
    quarantine(file, reason);
    return emptyFile();
  }
}

/** 임시 파일에 쓰고 rename 으로 교체 — 쓰다 만 파일이 남지 않게 한다 */
export function writeCounters(data: CountersFile): void {
  const file = getCountersPath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(data, null, 2)}\n`, 'utf-8');
  fs.renameSync(tmp, file);
}
