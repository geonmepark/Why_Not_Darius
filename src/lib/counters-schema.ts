import { z } from 'zod';

const MAX_COUNTERS = 3;

/**
 * 가져오기 파일은 외부에서 온 값이다 — 모양을 검증하기 전에는 store 에 넣지 않는다.
 * 메인 프로세스도 1차로 걸러내지만, 렌더러에서 한 번 더 본다.
 */
export const countersFileSchema = z.object({
  version: z.number(),
  counters: z.record(z.string(), z.array(z.string()).max(MAX_COUNTERS)),
});

export type CountersFileInput = z.infer<typeof countersFileSchema>;

export interface SanitizeResult {
  counters: Record<string, string[]>;
  /** 챔피언 목록에 없어 버린 항목 — 조용히 사라지지 않도록 사용자에게 알린다 */
  droppedOpponents: string[];
  droppedCounters: number;
}

/** 존재하지 않는 챔피언 id 를 걸러내되, 몇 개가 빠졌는지 함께 돌려준다 */
export function sanitizeCounters(
  counters: Record<string, string[]>,
  knownIds: ReadonlySet<string>,
): SanitizeResult {
  const result: Record<string, string[]> = {};
  const droppedOpponents: string[] = [];
  let droppedCounters = 0;

  for (const [opponentId, counterIds] of Object.entries(counters)) {
    if (!knownIds.has(opponentId)) {
      droppedOpponents.push(opponentId);
      continue;
    }
    const kept = counterIds.filter((id) => knownIds.has(id));
    droppedCounters += counterIds.length - kept.length;
    if (kept.length > 0) result[opponentId] = kept.slice(0, MAX_COUNTERS);
  }

  return { counters: result, droppedOpponents, droppedCounters };
}
