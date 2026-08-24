import Link from 'next/link';
import { Github } from 'lucide-react';
import { GITHUB_REPO_URL } from '@/lib/marketing/releases';

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/40 bg-background/40">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-muted-foreground md:flex-row">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <div className="font-semibold text-foreground">
            Why Not Darius<span className="text-primary">?</span>
          </div>
          <div className="text-xs">
            © {new Date().getFullYear()} · 비공식 보조 도구. League of Legends는 Riot Games의
            상표입니다.
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/download" className="transition-colors hover:text-foreground">
            다운로드
          </Link>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Github className="size-4" />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
