# 패키징된 앱 실제 동작 검증

Type: task
Status: open
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
