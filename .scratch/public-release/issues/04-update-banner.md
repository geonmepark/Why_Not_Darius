# 앱 내 새 버전 알림 배너

Type: task
Status: resolved

## Question

LCU API 는 Riot 이 예고 없이 바꿀 수 있어 언젠가 앱이 깨진다. 그때 사용자가
새 버전을 받도록 알려야 한다.

`getLatestRelease()` (`src/lib/marketing/releases.ts`) 를 렌더러에서 재사용해
`package.json` 버전과 비교하고, 새 버전이면 앱 상단에 배너와 릴리스 페이지 링크를
띄운다. 외부 링크는 `main.ts` 의 `setWindowOpenHandler` 가 이미 브라우저로 넘긴다.

앱 버전을 렌더러에 어떻게 전달할지(빌드 타임 상수 vs IPC)를 정해야 한다.

## Answer

`app:get-version` IPC 를 추가하고, `useUpdateCheck` 훅이 최신 릴리즈와 비교해
`UpdateBanner` 를 `HomePageClient` 최상단에 띄운다. 릴리즈가 없거나 최신이면
아무것도 렌더하지 않는다. 외부 링크는 기존 `setWindowOpenHandler` 가 브라우저로 넘긴다.

**앱 버전 전달 방식**: IPC 를 택했다. 다만 `app.getVersion()` 을 그대로 쓸 수 없었다 —
dev 에서 Electron 자체 버전(41.2.0)을 돌려준다. `app.getName()` 이 `Electron` 을
돌려주던 것과 같은 원인이다. `__dirname/../package.json` 에서 직접 읽어 dev 와
패키징본이 같은 값을 내도록 했다. `app.getAppPath()` 는 dev 에서 `dist-electron` 을
가리켜 쓸 수 없었다.

**버전 비교**: `src/lib/version.ts` 의 `isNewerVersion`. 13개 케이스로 검증했다.
문자열 비교로는 틀리는 `0.10.0 > 0.9.0`, 자리수가 다른 `0.2 > 0.1.5`, 그리고
프리릴리즈 처리를 포함한다. 프리릴리즈는 업데이트로 안내하지 않되(미서명 설치가
이미 번거로운데 미검증 버전을 권할 이유가 없다), 베타를 쓰던 사용자에게
정식판은 새 버전으로 알린다(`0.1.0 > 0.1.0-beta.1`).

**미검증**: 배너가 실제로 그려지는 모습은 확인하지 못했다. 릴리즈가 아직 없어
훅이 항상 null 을 돌려준다. 설치 버전보다 높은 릴리즈가 생긴 뒤에야 볼 수 있다.
현재 확인된 것은 "릴리즈가 없을 때 배너가 뜨지 않는다"까지다.
