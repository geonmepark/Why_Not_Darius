'use client';

import { useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useDetectedOS, OS_LABEL } from '@/lib/marketing/os-detect';
import { AppleIcon, WindowsIcon } from './PlatformIcons';

type Target = 'mac' | 'windows';

const BUTTON_META: Record<Target, { label: string; icon: ReactNode }> = {
  mac: { label: 'Mac 다운로드', icon: <AppleIcon className="size-5" /> },
  windows: { label: 'Windows 다운로드', icon: <WindowsIcon className="size-5" /> },
};

interface DownloadCTAProps {
  className?: string;
  macUrl?: string | null;
  winUrl?: string | null;
}

export function DownloadCTA({ className, macUrl, winUrl }: DownloadCTAProps) {
  const detected = useDetectedOS();
  const primary: Target = detected === 'windows' ? 'windows' : 'mac';
  const secondary: Target = primary === 'mac' ? 'windows' : 'mac';
  const links: Record<Target, string | null> = {
    mac: macUrl ?? null,
    windows: winUrl ?? null,
  };
  const [pending, setPending] = useState<Target | null>(null);

  const handleClick = (target: Target) => (e: React.MouseEvent) => {
    if (!links[target]) {
      e.preventDefault();
      setPending(target);
      toast.info('곧 공개됩니다', {
        description: `${BUTTON_META[target].label} 링크는 첫 릴리즈와 함께 활성화돼요.`,
        duration: 3500,
      });
      setTimeout(() => setPending(null), 600);
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          asChild
          size="lg"
          className="h-12 gap-2 px-6 text-base font-semibold shadow-lg shadow-primary/20"
        >
          <a
            href={links[primary] ?? '#download'}
            onClick={handleClick(primary)}
            data-pending={pending === primary || undefined}
          >
            {BUTTON_META[primary].icon}
            {BUTTON_META[primary].label}
          </a>
        </Button>
        <Button asChild variant="ghost" size="lg" className="h-12 gap-2 px-5 text-sm">
          <a href={links[secondary] ?? '#download'} onClick={handleClick(secondary)}>
            {BUTTON_META[secondary].icon}
            {BUTTON_META[secondary].label}
          </a>
        </Button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        감지된 OS:{' '}
        <span className="font-medium text-foreground/80">{OS_LABEL[detected]}</span> · 무료 · 계정
        가입 없음
      </p>
    </div>
  );
}
