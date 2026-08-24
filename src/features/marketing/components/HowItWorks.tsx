import { Download, ListOrdered, Bell } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

const STEPS = [
  {
    icon: Download,
    title: '다운로드 & 실행',
    desc: '설치 후 트레이에 조용히 상주합니다. 게임 중이 아니면 화면을 차지하지 않아요.',
  },
  {
    icon: ListOrdered,
    title: '카운터픽 등록',
    desc: '챔피언별로 1·2·3순위 카운터픽을 한 번만 등록해두면 됩니다. 외울 필요 X.',
  },
  {
    icon: Bell,
    title: 'LoL 켜고 픽창 진입',
    desc: '상대 챔피언이 확정되는 순간 카운터픽 카드가 자동으로 떠요. 따로 켤 필요 없습니다.',
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how" className="border-b border-border/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow="3 steps"
          title="이렇게 씁니다"
          description="설정 한 번이면 끝. 그 다음부터는 알아서 동작해요."
        />

        <ol className="mt-14 grid gap-6 md:grid-cols-3 md:gap-5">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="group relative flex flex-col rounded-2xl border border-border bg-card/50 p-6 transition-all hover:border-primary/40 hover:bg-card hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                    <Icon className="size-5" />
                  </div>
                  <span className="text-4xl font-extrabold leading-none text-muted-foreground/20">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-lg font-bold leading-tight">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
