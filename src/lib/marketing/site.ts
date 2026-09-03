/**
 * 사이트 메타. Vercel 배포 시 NEXT_PUBLIC_SITE_URL 로 본 도메인을 주입.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://why-not-dari.vercel.app';

export const SITE_NAME = 'Why Not Dari';

export const SITE_DESCRIPTION =
  '상대가 이미 픽을 보여줬는데, 왜 그걸 또 못 받아쳐? 픽창에 들어가면 자동으로 카운터를 띄워주는 LoL 탑 라인 데스크톱 도우미.';
