'use client';

import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { SectionHeader } from './SectionHeader';

const championImg = (id: number) => `https://cdn.communitydragon.org/latest/champion/${id}/square`;

interface MockChampion {
  id: number;
  name: string;
}

interface AlertData {
  opponent: MockChampion;
  counters: MockChampion[];
}

const ALERTS: AlertData[] = [
  {
    opponent: { id: 114, name: '피오라' },
    counters: [
      { id: 122, name: '다리우스' },
      { id: 54, name: '말파이트' },
      { id: 80, name: '판테온' },
    ],
  },
  {
    opponent: { id: 92, name: '리븐' },
    counters: [
      { id: 86, name: '가렌' },
      { id: 75, name: '나서스' },
      { id: 122, name: '다리우스' },
    ],
  },
];

export function LivePreview() {
  return (
    <section className="relative overflow-hidden border-b border-border/40 py-24 md:py-32">
      {/* 배경 글로우 */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-50"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 50%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 70%)',
        }}
      />

      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow="live preview"
          title="픽창에선 이렇게 보입니다"
          description="실제 앱 화면 그대로. 카드 위에 마우스를 올려보세요."
        />

        <div className="relative mt-16 flex justify-center perspective-[1500px]">
          <AppWindow className="w-full max-w-md transition-transform duration-700 ease-out hover:[transform:rotateX(0deg)_rotateY(0deg)] [transform:rotateX(8deg)_rotateY(-6deg)]" />
        </div>

        <p className="mx-auto mt-10 max-w-md text-center text-xs text-muted-foreground">
          예시는 피오라·리븐을 상대로 미리 등록해둔 카운터픽이 자동으로 표시되는 모습입니다.
        </p>
      </div>
    </section>
  );
}

function AppWindow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-primary/20',
        className,
      )}
    >
      <TitleBar />
      <div className="flex flex-col gap-3 bg-gradient-to-b from-background to-muted/30 p-5">
        <StatusRow />
        {ALERTS.map((alert) => (
          <CounterCard key={alert.opponent.id} {...alert} />
        ))}
      </div>
    </div>
  );
}

function TitleBar() {
  return (
    <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
      <span className="size-3 rounded-full bg-[#ff5f57]" />
      <span className="size-3 rounded-full bg-[#febc2e]" />
      <span className="size-3 rounded-full bg-[#28c840]" />
      <p className="ml-3 text-xs font-medium text-muted-foreground">Why Not Dari</p>
    </div>
  );
}

function StatusRow() {
  return (
    <div className="flex items-center justify-between rounded-lg bg-card/60 px-3 py-2">
      <div className="inline-flex items-center gap-2 text-xs">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        <span className="font-medium text-foreground/80">LCU 연결됨</span>
      </div>
      <span className="text-[11px] text-muted-foreground">픽창 진행 중</span>
    </div>
  );
}

function CounterCard({ opponent, counters }: AlertData) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <ChampImg champion={opponent} ringClass="ring-2 ring-destructive/70" />
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">상대 픽</p>
          <p className="truncate text-base font-bold leading-tight">{opponent.name}</p>
        </div>
        <div className="ml-auto inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 text-[9px] font-semibold text-destructive">
          <span className="size-1 rounded-full bg-destructive" />
          확정
        </div>
      </div>
      <p className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
        추천 카운터픽
      </p>
      <div className="flex gap-3">
        {counters.map((c, i) => (
          <div key={c.id} className="flex flex-1 flex-col items-center gap-1.5">
            <div className={cn('relative', i === 0 && 'rounded-md ring-2 ring-primary')}>
              <ChampImg champion={c} />
              {i === 0 && (
                <span className="absolute -right-1.5 -top-1.5 rounded bg-primary px-1 py-px text-[8px] font-bold text-primary-foreground">
                  1순위
                </span>
              )}
            </div>
            <span className="text-[11px] text-foreground/80">{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChampImg({ champion, ringClass }: { champion: MockChampion; ringClass?: string }) {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return <Skeleton className={cn('size-14 rounded-md', ringClass)} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={championImg(champion.id)}
      alt={champion.name}
      width={56}
      height={56}
      className={cn('size-14 rounded-md object-cover', ringClass)}
      onError={() => setErrored(true)}
      loading="lazy"
    />
  );
}
