function isPrerelease(version: string): boolean {
  return /[-+]/.test(version);
}

/** 프리릴리즈/빌드 메타데이터를 떼고 숫자 부분만 남긴다 (0.2.0-beta.1 -> 0.2.0) */
function core(version: string): number[] {
  return version
    .split(/[-+]/)[0]
    .split('.')
    .map((part) => {
      const n = Number.parseInt(part, 10);
      return Number.isNaN(n) ? 0 : n;
    });
}

/**
 * "0.2.1" 형태의 버전을 비교한다. 릴리즈 태그는 releases.ts 에서 이미 v 접두사를 뗀다.
 *
 * 프리릴리즈(0.2.0-beta.1)는 업데이트로 안내하지 않는다. 미서명 배포라 설치 과정이
 * 이미 번거로운데, 검증되지 않은 버전까지 권할 이유가 없다.
 */
export function isNewerVersion(latest: string, current: string): boolean {
  if (isPrerelease(latest)) return false;

  const a = core(latest);
  const b = core(current);
  const length = Math.max(a.length, b.length);

  for (let i = 0; i < length; i++) {
    const left = a[i] ?? 0;
    const right = b[i] ?? 0;
    if (left !== right) return left > right;
  }

  // 숫자가 같다면 정식판이 프리릴리즈보다 새 버전이다 (0.1.0 > 0.1.0-beta.1).
  // 베타를 쓰던 사용자에게 정식 출시를 알려야 한다.
  return isPrerelease(current);
}
