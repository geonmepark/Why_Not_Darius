# 외부 이름 정리: darius -> dari

Type: task
Status: open

## Question

코드는 `Why Not Dari` 로 통일했지만 외부 자원은 아직 `darius` 다.
릴리스 URL 과 다운로드 페이지 주소에 그대로 노출된다.

사용자 작업: GitHub 레포명 `Why_Not_Darius` → `Why_Not_Dari`, Vercel 도메인 변경.
코드 작업: `src/lib/marketing/releases.ts` 의 `GH_REPO`,
`src/lib/marketing/site.ts` 의 기본 도메인, git remote URL.

링크가 퍼지기 전이 가장 싸므로 릴리스(06) 전에 끝내는 게 좋다. 다만 06 을
막지는 않는다 — 순서가 뒤집혀도 GitHub 이 리다이렉트를 걸어준다.
