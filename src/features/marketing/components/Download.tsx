import { Download as DownloadIcon, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  formatBytes,
  formatPublishedDate,
  getLatestRelease,
  RELEASES_URL,
  type ReleaseAsset,
} from '@/lib/marketing/releases';
import { AppleIcon, WindowsIcon } from './PlatformIcons';
import { SectionHeader } from './SectionHeader';

export async function Download() {
  const release = await getLatestRelease();

  return (
    <section id="download" className="border-b border-border/40 py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeader
          eyebrow="download"
          title="지금 받기"
          description={
            release ? (
              <>
                v{release.version} · {formatPublishedDate(release.publishedAt)}
              </>
            ) : (
              <>곧 첫 릴리즈가 올라옵니다.</>
            )
          }
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <PlatformCard
            label="macOS"
            icon={<AppleIcon className="size-6" />}
            asset={release?.mac ?? null}
            sub="Apple Silicon · Intel 모두 지원"
          />
          <PlatformCard
            label="Windows"
            icon={<WindowsIcon className="size-6" />}
            asset={release?.windows ?? null}
            sub="Windows 10 / 11 (64-bit)"
          />
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 text-sm text-muted-foreground">
          {release && (
            <a
              href={release.notesUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              릴리즈 노트 보기 <ExternalLink className="size-3.5" />
            </a>
          )}
          <a
            href={RELEASES_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            모든 버전 · 변경사항 <ExternalLink className="size-3.5" />
          </a>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground/70">
          설치할 때 보안 경고가 뜹니다 —{' '}
          <a href="#install-guide" className="underline-offset-2 hover:underline">
            넘어가는 방법
          </a>
          을 먼저 읽어보세요.
        </p>
      </div>
    </section>
  );
}

function PlatformCard({
  label,
  icon,
  asset,
  sub,
}: {
  label: string;
  icon: React.ReactNode;
  asset: ReleaseAsset | null;
  sub: string;
}) {
  return (
    <div className="group flex flex-col rounded-2xl border border-border bg-card/50 p-6 transition-all hover:border-primary/40 hover:bg-card hover:shadow-lg hover:shadow-primary/10">
      <div className="flex items-center gap-3">
        <div className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-base font-bold">{label}</p>
          <p className="truncate text-xs text-muted-foreground">{sub}</p>
        </div>
      </div>

      <div className="mt-6">
        {asset ? (
          <Button asChild size="lg" className="w-full gap-2 font-semibold">
            <a href={asset.url}>
              <DownloadIcon className="size-4" />
              다운로드 ({formatBytes(asset.size)})
            </a>
          </Button>
        ) : (
          <Button disabled size="lg" className="w-full gap-2 font-semibold">
            <DownloadIcon className="size-4" />
            준비중
          </Button>
        )}
        {asset && (
          <p className="mt-2 truncate text-center text-[11px] text-muted-foreground">
            {asset.name}
          </p>
        )}
      </div>
    </div>
  );
}
