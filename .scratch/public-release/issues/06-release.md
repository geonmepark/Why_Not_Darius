# 첫 GitHub Release 발행

Type: task
Status: open
Blocked by: 02, 03, 05

## Question

`yarn electron:build` 로 NSIS 설치 파일을 만들고 GitHub Release 에 업로드한다.
릴리스가 생기는 순간 `DownloadCTA` 가 자동 활성화된다(코드 변경 불필요, ISR 1시간).

- `gh` CLI 가 설치돼 있지 않다. 웹 UI 로 하거나 `gh` 를 설치한다
- 릴리스 자산 이름이 `releases.ts` 의 `isWinAsset` (`.exe`/`.msi`) 에 걸리는지 확인
- 버전 번호와 릴리스 노트 형식을 정한다

발행 후 실제로 사이트에서 받아 설치되는지 확인한다.
