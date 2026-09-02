/* Electron 이 없을 때(브라우저에서 next dev 만 실행) localStorage 로 떨어지는지 확인한다. */
const store = new Map<string, string>();

// counters-storage 가 참조하는 브라우저 전역을 흉내낸다 (window.electronApi 는 없는 상태)
(globalThis as unknown as { window: unknown }).window = {};
(globalThis as unknown as { localStorage: unknown }).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
};

const { countersStorage } = await import('../src/lib/counters-storage.js');

let fail = 0;
const check = (label: string, ok: boolean) => {
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${label}`);
  if (!ok) fail++;
};

const payload = JSON.stringify({ state: { counters: { Aatrox: ['Kled'] } }, version: 0 });

console.log('브라우저 폴백 (window.electronApi 없음)');
check('초기값 null', (await countersStorage.getItem('wnd-counters')) === null);

await countersStorage.setItem('wnd-counters', payload);
check('localStorage 에 기록', store.get('wnd-counters') === payload);
check('읽으면 그대로 반환', (await countersStorage.getItem('wnd-counters')) === payload);

await countersStorage.removeItem('wnd-counters');
check('삭제 동작', !store.has('wnd-counters'));

console.log(fail === 0 ? '\n전체 통과' : `\n${fail}건 실패`);
process.exit(fail ? 1 : 0);
