'use client';

import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Champion } from '@/types/champion';
import { cn } from '@/lib/utils';

const SIZE_MAP = {
  sm: 32,
  md: 48,
  lg: 64,
} as const;

interface ChampionAvatarProps {
  champion: Champion;
  size?: keyof typeof SIZE_MAP;
  className?: string;
}

export function ChampionAvatar({ champion, size = 'md', className }: ChampionAvatarProps) {
  const [errored, setErrored] = useState(false);
  const px = SIZE_MAP[size];

  if (errored) {
    return <Skeleton className={cn('rounded', className)} style={{ width: px, height: px }} />;
  }

  return (
    <img
      src={champion.imageUrl}
      alt={champion.name}
      width={px}
      height={px}
      className={cn('rounded object-cover', className)}
      onError={() => setErrored(true)}
      style={{ width: px, height: px }}
    />
  );
}
