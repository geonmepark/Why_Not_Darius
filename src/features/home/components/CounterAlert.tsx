'use client';

import { useMemo } from 'react';
import { useLcuStore } from '@/store/lcu';
import { useCounterStore } from '@/store/counter';
import { useChampions } from '@/hooks/useChampions';
import { ChampionAvatar } from '@/features/setup/components/ChampionAvatar';
import type { Champion } from '@/types/champion';

export function CounterAlert() {
  const confirmedOpponentIds = useLcuStore((s) => s.confirmedOpponentIds);
  const counters = useCounterStore((s) => s.counters);
  const { data: champions } = useChampions();

  // key(숫자 문자열) → Champion 조회 맵
  const championByKey = useMemo<Record<string, Champion>>(() => {
    if (!champions) return {};
    return Object.fromEntries(champions.map((c) => [c.key, c]));
  }, [champions]);

  // LCU championId(숫자) → String → CounterMap 키 매칭
  const alerts = useMemo(() => {
    return confirmedOpponentIds.flatMap((opponentKey) => {
      const opponent = championByKey[opponentKey];
      const counterKeys = counters[opponentKey] ?? [];
      if (!opponent || counterKeys.length === 0) return [];
      const counterChampions = counterKeys.map((k) => championByKey[k]).filter(Boolean) as Champion[];
      return [{ opponent, counterChampions }];
    });
  }, [confirmedOpponentIds, counters, championByKey]);

  if (alerts.length === 0) {
    return (
      <div className="text-center text-zinc-500 py-8 text-sm">
        상대 챔피언 픽을 기다리는 중...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {alerts.map(({ opponent, counterChampions }) => (
        <div key={opponent.key} className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
          <div className="flex items-center gap-3 mb-4">
            <ChampionAvatar champion={opponent} size="lg" className="rounded-md ring-2 ring-red-500" />
            <div>
              <p className="text-xs text-zinc-400 mb-0.5">상대 픽</p>
              <p className="font-bold text-zinc-100 text-lg">{opponent.name}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-zinc-400 mb-2">추천 카운터픽</p>
            <div className="flex gap-3">
              {counterChampions.map((c, i) => (
                <div key={c.key} className="flex flex-col items-center gap-1.5">
                  <div className={`relative ${i === 0 ? 'ring-2 ring-blue-400 rounded-md' : ''}`}>
                    <ChampionAvatar champion={c} size="lg" className="rounded-md" />
                    {i === 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[9px] font-bold px-1 rounded">
                        1순위
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-zinc-300">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
