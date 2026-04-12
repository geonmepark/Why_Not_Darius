'use client';

import { useLcuStore } from '@/store/lcu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function LcuStatusBadge() {
  const status = useLcuStore((s) => s.status);

  const config = {
    disconnected: { label: 'LoL 클라이언트 미연결', className: 'bg-zinc-700 text-zinc-300' },
    connecting: { label: '연결 중...', className: 'bg-yellow-600 text-white' },
    connected: { label: 'LoL 연결됨', className: 'bg-green-600 text-white' },
  };

  const { label, className } = config[status];

  return <Badge className={cn('text-xs font-medium border-0', className)}>{label}</Badge>;
}
