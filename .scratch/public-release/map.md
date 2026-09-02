# 공개 배포: 첫 Windows 릴리스

## Destination

모르는 사람이 Vercel 마케팅 사이트에서 설치 파일을 받아, 설치하고, 롤 챔프 선택에서
카운터픽을 볼 수 있는 상태. Windows 한정, 미서명, 비용 0원.

여기 도달하면 이 지도는 닫힌다.

## Notes

- 도메인: Electron 데스크톱 앱 + Next.js 마케팅 사이트가 한 리포에 있다.
  라우트 그룹 `(app)` 은 Electron 렌더러용, `(marketing)` 은 Vercel 배포용.
- 매 세션 참고할 스킬: 없음. 필요 시 grilling / domain-modeling.
- 비용 제약이 이 지도의 뼈대다. 돈이 드는 선택지는 기본적으로 범위 밖.
- 사용자가 손으로 지정한 카운터픽 60개가 `%APPDATA%/why-not-dari/data/counters.json`
  에 있다. 어떤 작업도 이걸 날리면 안 된다. 백업은 리포 루트의
  `my-counters.backup.json` / `.md` (gitignore).

## Decisions so far

- [빌드 차단 요인 제거](../../.git) — `f98aeb7`. static export 충돌 3건과 electron
  의존성 위치를 고쳐 Next 빌드와 asar 패키징까지 진행되게 했다.
- 대상 OS는 Windows만. macOS 는 공증에 연 $99 가 필요하고 미서명 시 Gatekeeper 가
  사실상 차단하므로 범위 밖.
- 코드 서명은 하지 않는다. 무료 경로(SignPath Foundation)는 OSS 라이선스·공개 레포·CI 가
  전제라 첫 릴리스 전에는 불가능하다. 설치 가이드로 보완한다.
- 업데이트는 앱 내 "새 버전 있음" 배너. electron-updater 는 미서명 상태에서
  설치 경고를 다시 만나 경험이 더 나빠진다.
- [푸터 법적 고지](issues/05-legal-notice.md): Riot 미승인 고지 + 데이터 수집 없음.
  수집 데이터가 없어 개인정보 처리방침 페이지는 만들지 않는다.
- [앱 내 새 버전 알림 배너](issues/04-update-banner.md): `app:get-version` IPC 추가.
  `app.getVersion()`·`app.getAppPath()` 는 dev 에서 엉뚱한 값을 줘서 쓸 수 없었고,
  `__dirname/../package.json` 을 직접 읽는다.
- [미서명 설치 안내 섹션](issues/03-install-guide.md): `/download` 페이지 전용 3단계 가이드.
  SmartScreen 단계만 강조. FAQ 도 실제 동작에 맞게 갱신.
- [빌드 차단 해제](issues/01-developer-mode.md): 관리자 터미널로 1회 통과.
  캐시가 풀린 뒤로는 권한 없이도 빌드된다.
- [패키징본 검증](issues/02-verify-packaged-app.md): 정적 export 의 절대경로 자산이
  file:// 에서 전부 404 라 JS 가 하나도 로드되지 않았다. `app://` 스킴으로 해결.
  프로덕션 CSP 는 문제가 아니었다 — 챔피언 이미지 339/339 로드.

## Not yet specified

- 패키징본에서의 LCU 연결. 롤 클라이언트를 켠 상태로 한 번 확인해야 한다.
- 첫 릴리스 버전 번호와 릴리스 노트 형식. `package.json` 은 0.1.0.
- 사용자 문의를 어디로 받을지 (GitHub Issues vs 별도 채널). 실제 사용자가
  생긴 뒤에 판단.
- SmartScreen 안내 스크린샷. 실제 릴리스된 exe 로 캡처해야 문구가 정확하다.
  `InstallGuide.tsx` 의 각 단계에 넣을 자리는 이미 있다.
- 업데이트 배너의 실제 렌더 확인. 릴리즈가 없어 훅이 항상 null 이라, 설치 버전보다
  높은 릴리즈가 생긴 뒤에야 볼 수 있다.

## Out of scope

- macOS 빌드·공증 — 연 $99. Mac 요청이 실제로 들어오면 별도 지도.
- 코드 서명 인증서 구매 — 수익 구조가 없어 연 20~60만원은 맞지 않는다.
- GitHub Actions CI — 개발자 모드로 로컬 빌드가 뚫리면 첫 릴리스에 불필요.
- electron-updater 자동 업데이트.
- 개인정보 처리방침 페이지 — 수집하는 데이터가 없어 푸터 한 줄로 충분.
- 로그인·서버 동기화 — 이전 세션에서 이미 범위 밖으로 정리됨.
