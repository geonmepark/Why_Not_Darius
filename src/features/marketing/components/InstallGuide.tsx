import { AlertTriangle, MousePointerClick, ShieldQuestion } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

interface Step {
  screen: string;
  detail: string;
  action: string;
  critical?: boolean;
}

/**
 * 서명 인증서가 없어 설치까지 경고를 두 번 넘어야 한다. 2번 단계에서 기본 버튼이
 * "실행 안 함" 이라 안내가 없으면 대부분 여기서 포기한다.
 */
const STEPS: Step[] = [
  {
    screen: '이 형식의 파일은 컴퓨터에 문제를 일으킬 수 있습니다',
    detail: '브라우저가 다운로드를 막습니다. Chrome·Edge 모두 비슷한 문구가 뜹니다.',
    action: '유지',
  },
  {
    screen: 'Windows의 PC 보호',
    detail:
      '파란 전체 화면이 뜨고 "실행 안 함" 버튼만 보입니다. 실행 버튼은 「추가 정보」를 눌러야 나타납니다.',
    action: '추가 정보 → 실행',
    critical: true,
  },
  {
    screen: '설치 진행',
    detail: '이후는 일반적인 설치입니다. 설치가 끝나면 롤 클라이언트를 켜고 앱을 실행하세요.',
    action: '다음 → 설치',
  },
];

export function InstallGuide() {
  return (
    <section id="install-guide" className="border-b border-border/40 py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeader
          eyebrow="install"
          title="설치할 때 경고가 뜹니다"
          description="정상입니다. 넘어가는 방법을 미리 알려드릴게요."
        />

        <div className="mt-8 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
          <ShieldQuestion className="mt-0.5 size-5 shrink-0 text-amber-500" />
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">왜 뜨나요?</span> 코드 서명 인증서가
            없어서입니다. 인증서는 매년 수십만 원이 들어 무료 도구에는 부담이 큽니다. 바이러스가
            검출돼서가 아니라, 서명이 없는 새 파일이면 무조건 뜨는 화면입니다.
          </p>
        </div>

        <ol className="mt-10 space-y-4">
          {STEPS.map((step, i) => (
            <li
              key={step.screen}
              className={[
                'flex gap-4 rounded-2xl border p-5 transition-colors',
                step.critical ? 'border-primary/40 bg-primary/5' : 'border-border bg-card/50',
              ].join(' ')}
            >
              <span
                className={[
                  'inline-flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                  step.critical
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                ].join(' ')}
              >
                {i + 1}
              </span>

              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  화면에 이렇게 뜨면
                  {step.critical && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
                      <AlertTriangle className="size-3" />
                      여기서 대부분 막힙니다
                    </span>
                  )}
                </p>
                <p className="mt-1 font-semibold text-foreground">“{step.screen}”</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-muted/60 px-3 py-1.5 text-sm font-medium text-foreground">
                  <MousePointerClick className="size-4 text-primary" />
                  {step.action}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-center text-xs text-muted-foreground/70">
          다운로드 수가 쌓이면 Windows가 이 파일을 알아보게 되어 경고는 점차 사라집니다.
        </p>
      </div>
    </section>
  );
}
