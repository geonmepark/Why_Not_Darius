import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/marketing/site';

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
