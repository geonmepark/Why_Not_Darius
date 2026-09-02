import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/marketing/site';

// Electron 빌드는 output: 'export' 라 정적 생성이 가능해야 한다.
// 값이 전부 상수이므로 프리렌더로 충분하다.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/download`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}
