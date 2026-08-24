import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import { MarketingNav } from '@/features/marketing/components/MarketingNav';
import { MarketingFooter } from '@/features/marketing/components/MarketingFooter';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/marketing/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — LoL 카운터픽 자동 추천`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ['리그 오브 레전드', 'LoL', '카운터픽', '탑 라인', '데스크톱 앱', 'LCU'],
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — LoL 카운터픽 자동 추천`,
    description: SITE_DESCRIPTION,
    locale: 'ko_KR',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — LoL 카운터픽 자동 추천`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <MarketingNav />
        <main className="flex-1">{children}</main>
        <MarketingFooter />
      </div>
    </ThemeProvider>
  );
}
