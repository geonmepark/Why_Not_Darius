'use client';

import Link from 'next/link';
import { Github, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GITHUB_REPO_URL } from '@/lib/marketing/releases';

const NAV_LINKS = [
  { href: '#problem', label: '왜 필요해?' },
  { href: '#how', label: '작동 방식' },
  { href: '#features', label: '기능' },
  { href: '#faq', label: 'FAQ' },
];

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-base font-extrabold tracking-tight">
            Why Not Darius<span className="text-primary">?</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer" aria-label="GitHub">
              <Github className="size-4" />
            </a>
          </Button>
          <Button asChild className="font-semibold">
            <a href="#download">
              <Download className="size-4" />
              다운로드
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
