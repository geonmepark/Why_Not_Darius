'use client';

import Link from 'next/link';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLcuStore } from '@/store/lcu';
import { LcuStatusBadge } from './LcuStatusBadge';
import { CounterAlert } from './CounterAlert';

export function HomePageClient() {
  const status = useLcuStore((s) => s.status);
  const phase = useLcuStore((s) => s.phase);

  const isPickPhase = ['PLANNING', 'BAN_PICK', 'FINALIZATION'].includes(phase);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <span className="font-bold text-base text-blue-400">Why Not Darius</span>
          <LcuStatusBadge />
        </div>
        <Button asChild variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-100">
          <Link href="/setup">
            <Settings className="w-5 h-5" />
          </Link>
        </Button>
      </header>

      <main className="flex-1 px-5 py-6">
        {status === 'disconnected' ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <p className="text-zinc-400">League of Legends 클라이언트를 실행해주세요</p>
            <p className="text-zinc-600 text-sm">클라이언트 실행 시 자동으로 연결됩니다</p>
          </div>
        ) : !isPickPhase ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-zinc-400">챔피언 선택 화면을 기다리는 중...</p>
          </div>
        ) : (
          <CounterAlert />
        )}
      </main>
    </div>
  );
}
