/* 가져오기 검증·정리 로직과 브라우저 폴백 분기를 실제로 실행해 확인한다. */
import { countersFileSchema, sanitizeCounters } from '../src/lib/counters-schema';

let fail = 0;
const check = (label: string, ok: boolean, extra = '') => {
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${label}${extra ? ' — ' + extra : ''}`);
  if (!ok) fail++;
};

console.log('가져오기 스키마 검증');
check(
  '정상 파일 통과',
  countersFileSchema.safeParse({ version: 1, counters: { Aatrox: ['Kled'] } }).success,
);
check('counters 없음 거부', !countersFileSchema.safeParse({ version: 1 }).success);
check(
  '배열이 아닌 값 거부',
  !countersFileSchema.safeParse({ version: 1, counters: { Aatrox: 'Kled' } }).success,
);
check(
  '숫자 배열 거부',
  !countersFileSchema.safeParse({ version: 1, counters: { Aatrox: [1, 2] } }).success,
);
check(
  '4개 초과 거부',
  !countersFileSchema.safeParse({ version: 1, counters: { Aatrox: ['a', 'b', 'c', 'd'] } }).success,
);
check('무관한 JSON 거부', !countersFileSchema.safeParse({ hello: 'world' }).success);
check('배열 최상위 거부', !countersFileSchema.safeParse([1, 2, 3]).success);

console.log('알 수 없는 챔피언 정리');
const known = new Set(['Aatrox', 'Kled', 'Gwen', 'Darius']);
const r = sanitizeCounters(
  { Aatrox: ['Kled', 'NotAChamp', 'Gwen'], FakeChamp: ['Kled'], Darius: ['AlsoFake'] },
  known,
);
check('알 수 없는 상대 제거', !('FakeChamp' in r.counters), JSON.stringify(r.droppedOpponents));
check(
  '알 수 없는 카운터 제거',
  JSON.stringify(r.counters.Aatrox) === '["Kled","Gwen"]',
  JSON.stringify(r.counters.Aatrox),
);
check('카운터가 모두 사라지면 항목 제외', !('Darius' in r.counters));
check(
  '버린 개수 보고',
  r.droppedOpponents.length === 1 && r.droppedCounters === 2,
  `상대 ${r.droppedOpponents.length} / 카운터 ${r.droppedCounters}`,
);

console.log(fail === 0 ? '\n전체 통과' : `\n${fail}건 실패`);
process.exit(fail ? 1 : 0);
