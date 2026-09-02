import fs from 'node:fs';
import path from 'node:path';

const LOCKFILE_NAME = 'lockfile';

function programData(): string {
  return process.env.ProgramData ?? 'C:/ProgramData';
}

/** %ProgramData%\Riot Games\RiotClientInstalls.json 의 associated_client 키가 롤 설치 경로 */
function fromRiotClientInstalls(): string[] {
  const file = path.join(programData(), 'Riot Games', 'RiotClientInstalls.json');
  try {
    const json = JSON.parse(fs.readFileSync(file, 'utf-8')) as {
      associated_client?: Record<string, string>;
    };
    return Object.keys(json.associated_client ?? {});
  } catch {
    return [];
  }
}

/** 메타데이터 yaml 의 product_install_full_path — RiotClientInstalls.json 이 없을 때의 대안 */
function fromProductSettings(): string[] {
  const file = path.join(
    programData(),
    'Riot Games',
    'Metadata',
    'league_of_legends.live',
    'league_of_legends.live.product_settings.yaml',
  );
  try {
    const match = fs
      .readFileSync(file, 'utf-8')
      .match(/^product_install_full_path:\s*"?([^"\r\n]+)"?/m);
    return match ? [match[1]] : [];
  } catch {
    return [];
  }
}

/** 위 두 경로가 모두 실패했을 때의 기본 설치 위치 */
function commonInstallDirs(): string[] {
  const suffix = path.join('Riot Games', 'League of Legends');
  return [
    path.join('C:/', suffix),
    path.join('D:/', suffix),
    path.join(process.env.ProgramFiles ?? 'C:/Program Files', suffix),
    path.join(process.env['ProgramFiles(x86)'] ?? 'C:/Program Files (x86)', suffix),
  ];
}

/**
 * LeagueClient(LCU) 락파일 경로를 찾는다.
 *
 * Riot Client 락파일(%LOCALAPPDATA%\Riot Games\Riot Client\Config\lockfile)은
 * RCU API 라 lol-* 엔드포인트가 없다 — 반드시 롤 설치 폴더의 락파일을 써야 한다.
 *
 * @returns 락파일이 실제로 존재하는 경로, 없으면 null
 */
export function resolveLeagueLockfilePath(): string | null {
  const candidates = [
    ...fromRiotClientInstalls(),
    ...fromProductSettings(),
    ...commonInstallDirs(),
  ];

  for (const dir of candidates) {
    if (!dir) continue;
    const lockfile = path.join(dir.replace(/\//g, path.sep), LOCKFILE_NAME);
    if (fs.existsSync(lockfile)) return lockfile;
  }

  return null;
}

/**
 * 락파일이 아직 없어도(롤 미실행) 감시할 디렉토리는 알아야 한다.
 * 존재하는 설치 디렉토리 중 첫 번째를 돌려준다.
 */
export function resolveLeagueInstallDir(): string | null {
  const candidates = [
    ...fromRiotClientInstalls(),
    ...fromProductSettings(),
    ...commonInstallDirs(),
  ];

  for (const dir of candidates) {
    if (!dir) continue;
    const normalized = dir.replace(/\//g, path.sep);
    if (fs.existsSync(normalized)) return normalized;
  }

  return null;
}
