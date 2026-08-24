'use client';

import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// CommunityDragon "latest" alias — 항상 최신 패치 자동 추적
const championImg = (id: number) => `https://cdn.communitydragon.org/latest/champion/${id}/square`;

interface MockChampion {
  id: number;
  name: string;
}

const opponent: MockChampion = { id: 114, name: '피오라' };
// 1순위가 다리우스인 건 앱 이름 콜백 (Why Not Darius?)
const counters: MockChampion[] = [
  { id: 122, name: '다리우스' },
  { id: 54, name: '말파이트' },
  { id: 80, name: '판테온' },
];

export function HeroPreviewCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative w-full max-w-sm rounded-2xl border border-border/60 bg-card/80 p-5 shadow-2xl shadow-primary/10 backdrop-blur-xl',
        'before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-primary/[0.08] before:via-transparent before:to-transparent',
        className,
      )}
    >
      <div className="relative">
        <div className="mb-4 flex items-center gap-3">
          <ChampImg champion={opponent} ringClass="ring-2 ring-destructive/70" />
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">상대 픽</p>
            <p className="truncate text-lg font-bold leading-tight">{opponent.name}</p>
          </div>
          <div className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-destructive/15 px-2 py-1 text-[10px] font-semibold text-destructive">
            <span className="size-1.5 animate-pulse rounded-full bg-destructive" />
            확정
          </div>
        </div>

        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            추천 카운터픽
          </p>
          <p className="text-[10px] text-muted-foreground/70">미리 등록된 3장</p>
        </div>

        <div className="flex gap-3">
          {counters.map((c, i) => (
            <div key={c.id} className="flex flex-1 flex-col items-center gap-1.5">
              <div className={cn('relative', i === 0 && 'rounded-md ring-2 ring-primary')}>
                <ChampImg champion={c} />
                {i === 0 && (
                  <span className="absolute -right-1.5 -top-1.5 rounded bg-primary px-1 py-px text-[9px] font-bold text-primary-foreground">
                    1순위
                  </span>
                )}
              </div>
              <span className="text-xs text-foreground/80">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChampImg({ champion, ringClass }: { champion: MockChampion; ringClass?: string }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return <Skeleton className={cn('size-16 rounded-md', ringClass)} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={championImg(champion.id)}
      alt={champion.name}
      width={64}
      height={64}
      className={cn('size-16 rounded-md object-cover', ringClass)}
      onError={() => setErrored(true)}
    />
  );
}
