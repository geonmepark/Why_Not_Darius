import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/marketing/site';

// Electron 빌드는 output: 'export' 라 정적 생성이 가능해야 한다.
// 값이 전부 상수이므로 프리렌더로 충분하다.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /app, /app/setup 은 Electron 렌더러용이라 검색 노출 불필요
        disallow: ['/app/', '/app'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
