# 패키징된 앱 실제 동작 검증

Type: task
Status: resolved
Blocked by: 01

## Question

프로덕션 경로가 한 번도 실행된 적이 없다. `release/win-unpacked/Why Not Dari.exe`
를 실행해 다음을 확인한다.

- 창이 뜨는가 — `main.ts` 의 `loadFile('../out/app/index.html')`
- `app.asar` 에 `out/` 과 `public/` 이 포함됐는가 (`npx asar list`).
  직전 실패 빌드에서는 둘 다 빠져 있었다
- 챔피언 이미지가 로드되는가 — 프로덕션 CSP 이슈가 여기서 처음 드러난다
- `%APPDATA%/why-not-dari/data/counters.json` 의 60개를 그대로 읽는가.
  `app.setName('why-not-dari')` 로 dev 와 같은 폴더를 쓰게 해둔 결과 확인
- LCU 연결과 트레이 아이콘이 동작하는가

CSP 문제가 드러나면 별도 티켓으로 분리한다.

## Answer

**패키징본이 완전히 작동하지 않는 상태였다.** 정적 export 의 절대경로 자산이
file:// 에서 전부 404 가 나서 JS 가 하나도 로드되지 않았다. `app://` 스킴을
등록해 고쳤다 (`a5efe99`).

이 발견 자체가 이 티켓의 값이었다. 처음에 통과한 항목들(버전, 카운터, 저장 경로)은
전부 preload 스크립트가 처리하는 것이라 페이지 JS 와 무관하게 통과했다. 그것만
보고 정상이라 판단했으면 작동하지 않는 앱을 릴리즈할 뻔했다.

수정 후 실측:

| 항목 | 결과 |
|---|---|
| `_next` 요청 실패 | 0건 (이전 12/12 실패) |
| 클라이언트 라우팅 | 홈 -> `app://bundle/app/setup/` 동작 |
| 챔피언 이미지 | 339/339 로드 |
| 설정 카운터 | 파란 링 60개 |
| `getAppVersion()` | 0.1.0 |
| 저장 경로 | `%APPDATA%/why-not-dari/data/counters.json`, 60개 |
| 프로세스 생존 | 4개 (트레이 상주 정상) |

**프로덕션 CSP 는 문제가 아니었다.** DDragon/CommunityDragon 이미지가 전부
로드된다. 지도의 fog 에서 내린다.

**미검증**: LCU 연결. 롤 클라이언트가 실행 중이 아니어서 패키징본에서 확인하지
못했다. 락파일 탐색 코드는 dev 에서 검증된 것과 동일하지만, 패키징 환경에서
실제로 붙는지는 롤을 켠 상태로 한 번 확인해야 한다.
