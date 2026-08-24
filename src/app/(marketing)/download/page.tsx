import type { Metadata } from 'next';
import { Download } from '@/features/marketing/components/Download';
import { SITE_NAME } from '@/lib/marketing/site';

export const metadata: Metadata = {
  title: `다운로드 — ${SITE_NAME}`,
  description: 'macOS · Windows용 데스크톱 앱 다운로드. 무료, 계정 가입 없음.',
};

export default function DownloadPage() {
  return (
    <div className="border-t border-border/40">
      <Download />
    </div>
  );
}
