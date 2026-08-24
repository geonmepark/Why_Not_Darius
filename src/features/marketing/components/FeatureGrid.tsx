import {
  Plug,
  Trophy,
  MoonStar,
  PanelBottomClose,
  ShieldCheck,
  Github,
  type LucideIcon,
} from 'lucide-react';
import { SectionHeader } from './SectionHeader';

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const FEATURES: Feature[] = [
  {
    icon: Plug,
    title: 'LCU 자동 연동',
    desc: '리그 클라이언트가 켜지는 순간 자동으로 붙습니다. 별도 설정도, 로그인도 필요 없어요.',
  },
  {
    icon: Trophy,
    title: '1·2·3순위 카운터',
    desc: '챔피언별 카운터를 우선순위로 등록. 1순위는 픽창에서 한 번 더 강조됩니다.',
  },
  {
    icon: MoonStar,
    title: '픽창 친화 다크 UI',
    desc: '리그 픽창의 어두운 톤에 맞춘 색감과 타이포. 시선이 분산되지 않게 디자인했어요.',
  },
  {
    icon: PanelBottomClose,
    title: '트레이 상주, 조용한 동작',
    desc: '게임 외 시간엔 트레이에 숨어있고, 픽창에서만 카드를 띄웁니다. 거슬리지 않아요.',
  },
  {
    icon: ShieldCheck,
    title: '데이터는 100% 로컬',
    desc: '계정 가입 없음, 서버 없음. 모든 카운터 설정은 내 컴퓨터에만 저장됩니다.',
  },
  {
    icon: Github,
    title: '무료 · 오픈소스',
    desc: '소스가 공개되어 있어요. 신뢰할 수 있고, 원한다면 직접 빌드도 가능합니다.',
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="border-b border-border/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow="features"
          title={
            <>
              가볍지만,{' '}
              <span className="bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                필요한 건 다
              </span>
            </>
          }
          description="필요한 것만 넣었습니다. 픽창에서 쓸 만큼만, 깔끔하게."
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group flex flex-col gap-3 bg-card p-6 transition-colors hover:bg-card/70"
              >
                <div className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-base font-bold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
