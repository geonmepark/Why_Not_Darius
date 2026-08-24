'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Hand = 'rock' | 'paper' | 'scissors';
type Outcome = 'tie' | 'lose' | 'win';

interface Round {
  opponent: Hand;
  you: Hand;
  outcome: Outcome;
  resultLabel: string;
  caption: string;
}

const HAND_EMOJI: Record<Hand, string> = {
  rock: '🪨',
  paper: '📄',
  scissors: '✌️',
};

const HAND_LABEL: Record<Hand, string> = {
  rock: '바위',
  paper: '보',
  scissors: '가위',
};

const ROUNDS: Round[] = [
  {
    opponent: 'scissors',
    you: 'scissors',
    outcome: 'tie',
    resultLabel: '비겼네요',
    caption: '상대 픽을 봤는데도 같은 걸 내면, 그냥 0:50 평타예요.',
  },
  {
    opponent: 'scissors',
    you: 'paper',
    outcome: 'lose',
    resultLabel: '졌어요',
    caption: '잠깐, 상대가 이미 가위를 냈는데 보를 냈다고요? (= 라인전 폭파)',
  },
  {
    opponent: 'scissors',
    you: 'rock',
    outcome: 'win',
    resultLabel: '이겼다',
    caption: '이렇게 받아쳤어야죠. (= 솔킬)',
  },
];

const OUTCOME_COLOR: Record<Outcome, string> = {
  tie: 'text-muted-foreground',
  lose: 'text-destructive',
  win: 'text-primary',
};

const OUTCOME_GLOW: Record<Outcome, string> = {
  tie: 'shadow-none',
  lose: 'shadow-destructive/30',
  win: 'shadow-primary/40',
};

const ROUND_DURATION_MS = 2800;

export function RpsAnalogy() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % ROUNDS.length);
    }, ROUND_DURATION_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index, paused]);

  const round = ROUNDS[index];

  return (
    <section
      id="problem"
      className="relative overflow-hidden border-b border-border/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-5xl px-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          이런 적, 있죠?
        </span>
        <h2 className="mt-6 text-balance text-3xl font-extrabold tracking-tight md:text-5xl">
          상대가 이미 <span className="text-primary">가위</span>를 냈는데
          <br />또 가위·보를 내고 있나요?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground md:text-lg">
          정보가 다 보여졌는데도 답을 못 찾는 순간, 그게 LoL 픽창이에요.
        </p>

        <div
          className="mt-14 grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <PlayerCard
            label="상대"
            sub="이미 픽 공개"
            hand={round.opponent}
            tone="opponent"
            outcome={round.outcome}
          />
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <span className="text-2xl font-light">vs</span>
            <ProgressDots active={index} total={ROUNDS.length} />
          </div>
          <PlayerCard
            label="나"
            sub={`내가 낸 것: ${HAND_LABEL[round.you]}`}
            hand={round.you}
            tone="you"
            outcome={round.outcome}
          />
        </div>

        <div className="mt-10 min-h-[5.5rem]">
          <p
            key={`label-${index}`}
            className={cn(
              'text-2xl font-extrabold tracking-tight md:text-3xl',
              OUTCOME_COLOR[round.outcome],
              'animate-in fade-in slide-in-from-bottom-2 duration-500',
            )}
          >
            {round.resultLabel}
          </p>
          <p
            key={`caption-${index}`}
            className="mt-2 text-muted-foreground md:text-lg animate-in fade-in duration-700"
          >
            {round.caption}
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-primary/30 bg-primary/[0.06] p-6 backdrop-blur-sm md:p-8">
          <p className="text-balance text-lg font-semibold leading-relaxed md:text-xl">
            정보는 다 보여졌습니다. 답을 못 찾을 뿐이죠.
          </p>
          <p className="mt-2 text-balance text-sm text-muted-foreground md:text-base">
            우린 그 답을 미리 적어놓고, 픽창에서 자동으로 띄워줍니다. —{' '}
            <span className="font-semibold text-primary">Why Not Darius?</span>
          </p>
        </div>
      </div>

      {/* 비공식 푸터 가이드 */}
      <p className="mx-auto mt-10 max-w-md px-6 text-center text-[11px] text-muted-foreground/60">
        * 자동 재생됩니다. 카드 위에 마우스를 올리면 멈춰요.
      </p>
    </section>
  );
}

function PlayerCard({
  label,
  sub,
  hand,
  tone,
  outcome,
}: {
  label: string;
  sub: string;
  hand: Hand;
  tone: 'opponent' | 'you';
  outcome: Outcome;
}) {
  // 결과 강조: '나' 카드만 outcome 색조 글로우 받음 (상대는 항상 동일)
  const ownGlow = tone === 'you' ? OUTCOME_GLOW[outcome] : '';

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center gap-3 rounded-2xl border bg-card p-8 transition-shadow duration-500 shadow-xl',
        tone === 'opponent' ? 'border-destructive/30' : 'border-primary/30',
        ownGlow,
      )}
    >
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <div
        key={hand}
        className="text-7xl md:text-8xl animate-in fade-in zoom-in-50 duration-300"
        aria-label={HAND_LABEL[hand]}
      >
        {HAND_EMOJI[hand]}
      </div>
      <p className="text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}

function ProgressDots({ active, total }: { active: number; total: number }) {
  return (
    <div className="flex gap-1.5" role="presentation">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'h-1.5 rounded-full transition-all duration-500',
            i === active ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30',
          )}
        />
      ))}
    </div>
  );
}
