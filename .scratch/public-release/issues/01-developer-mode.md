# 빌드 차단 해제: Windows 개발자 모드

Type: task
Status: open

## Question

`yarn electron:pack` 이 `winCodeSign` 아카이브 추출에서 실패한다. 아카이브 안의
macOS 심링크(`libcrypto.dylib`, `libssl.dylib`)를 만들 권한이 없어서다.
Windows 빌드에는 필요조차 없는 파일이지만 `7za` 가 0이 아닌 코드를 반환해
electron-builder 가 치명적 오류로 처리한다.

```
ERROR: Cannot create symbolic link : 클라이언트가 필요한 권한을 가지고 있지 않습니다.
```

사용자 작업: 설정 → 개인 정보 및 보안 → 개발자용 → 개발자 모드 켜기.

켠 뒤 `yarn electron:pack` 이 exit 0 으로 끝나고 `release/win-unpacked/` 에
완전한 산출물이 나오는지 확인한다. 실패하면 관리자 권한 터미널로 대체,
그래도 안 되면 GitHub Actions 로 우회(범위 확대).
