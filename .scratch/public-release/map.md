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

## Not yet specified

- 프로덕션 CSP. 패키징된 앱이 `file://` 에서 DDragon/CommunityDragon 이미지를
  불러오는지 확인해야 판단 가능. 차단되면 대응 방식(메타 태그 vs 세션 헤더)을 정한다.
- 첫 릴리스 버전 번호와 릴리스 노트 형식. `package.json` 은 0.1.0.
- 사용자 문의를 어디로 받을지 (GitHub Issues vs 별도 채널). 실제 사용자가
  생긴 뒤에 판단.
- SmartScreen 안내 스크린샷. 실제 릴리스된 exe 로 캡처해야 정확하다.

## Out of scope

- macOS 빌드·공증 — 연 $99. Mac 요청이 실제로 들어오면 별도 지도.
- 코드 서명 인증서 구매 — 수익 구조가 없어 연 20~60만원은 맞지 않는다.
- GitHub Actions CI — 개발자 모드로 로컬 빌드가 뚫리면 첫 릴리스에 불필요.
- electron-updater 자동 업데이트.
- 개인정보 처리방침 페이지 — 수집하는 데이터가 없어 푸터 한 줄로 충분.
- 로그인·서버 동기화 — 이전 세션에서 이미 범위 밖으로 정리됨.
