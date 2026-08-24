import { ArrowDown, Sparkles } from 'lucide-react';
import { getLatestRelease } from '@/lib/marketing/releases';
import { DownloadCTA } from './DownloadCTA';
import { HeroPreviewCard } from './HeroPreviewCard';

export async function Hero() {
  const release = await getLatestRelease();

  return (
    <section id="hero" className="relative overflow-hidden border-b border-border/40">
      {/* 배경: 상단 글로우 + 도트 그리드 */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-x-0 top-0 h-[640px] opacity-70"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in oklab, var(--primary) 25%, transparent), transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '24px 24px',
            color: 'var(--foreground)',
          }}
        />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:py-32 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        {/* 좌: 카피 */}
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3" />
            픽창 자동 카운터 추천 · 데스크톱 앱
          </span>

          <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl lg:text-[3.75rem]">
            상대가 이미 픽을 보여줬는데,{' '}
            <span className="bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
              왜 그걸 또 못 받아쳐?
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            <strong className="font-semibold text-foreground">Why Not Darius</strong>는 LoL 탑 라인
            카운터픽을 픽창에 들어가는 순간 자동으로 띄워주는 데스크톱 도우미입니다. 외울 필요 없이,
            한 번 등록해두면 그때그때 알려줘요.
          </p>

          <DownloadCTA
            className="mt-8"
            macUrl={release?.mac?.url ?? null}
            winUrl={release?.windows?.url ?? null}
          />

          <a
            href="#problem"
            className="mt-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowDown className="size-3.5 animate-bounce" />
            이게 왜 문제인지부터 보기
          </a>
        </div>

        {/* 우: 떠있는 프리뷰 카드 */}
        <div className="relative flex items-center justify-center lg:justify-end">
          <div className="absolute inset-12 -z-10 rounded-full bg-primary/20 blur-3xl" />
          <HeroPreviewCard className="rotate-[1.5deg] transition-all duration-500 hover:rotate-0 hover:-translate-y-1 hover:scale-[1.02]" />
        </div>
      </div>
    </section>
  );
}
