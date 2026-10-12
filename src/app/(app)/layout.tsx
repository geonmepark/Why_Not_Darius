import type { Metadata } from 'next';
import { Providers } from '@/components/common/Providers';

// 데스크톱 앱 창 제목 — 사이트(marketing)는 자기 레이아웃의 제목을 쓴다
export const metadata: Metadata = {
  title: '와낫다',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
