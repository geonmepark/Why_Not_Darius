import Link from 'next/link';
import { Github, ShieldCheck } from 'lucide-react';
import { GITHUB_REPO_URL } from '@/lib/marketing/releases';

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/40 bg-background/40">
      <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-muted-foreground">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-1 md:items-start">
            <div className="font-semibold text-foreground">
              Why Not Dari<span className="text-primary">?</span>
            </div>
            <div className="text-xs">© {new Date().getFullYear()} · 비공식 보조 도구</div>
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

        <div className="mt-8 space-y-3 border-t border-border/40 pt-6 text-xs leading-relaxed">
          {/* 서버가 없고 모든 데이터가 사용자 PC 에만 저장된다 — 사실 그대로의 진술 */}
          <p className="flex items-start gap-2 text-foreground/70">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              <span className="font-medium text-foreground/90">아무 데이터도 수집하지 않습니다.</span>{' '}
              계정도 서버도 없으며, 설정한 카운터픽은 사용자 PC 에만 파일로 저장됩니다.
            </span>
          </p>
          {/* Riot 서드파티 조건이 요구하는 고지 */}
          <p>
            Why Not Dari 는 Riot Games 의 승인을 받지 않았으며, Riot Games 또는 Riot Games 자산의
            제작·관리에 공식적으로 관여하는 이들의 견해나 의견을 반영하지 않습니다. Riot Games 및
            관련 자산은 Riot Games, Inc. 의 상표 또는 등록상표입니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
