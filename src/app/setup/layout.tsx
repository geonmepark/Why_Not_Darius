import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Why Not Darius — 카운터 픽 설정',
};

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-screen-xl mx-auto flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-bold transition-colors"
          >
            <Home className="w-4 h-4" />
            Why Not Darius
          </Link>
          <ChevronRight className="w-4 h-4 text-zinc-600" />
          <span className="text-zinc-400">카운터 픽 설정</span>
        </div>
      </header>
      <main className="max-w-screen-xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
