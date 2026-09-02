import { ChevronDown } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

const FAQS = [
  {
    q: '라이엇 게임즈 약관 위반 아닌가요?',
    a: '아닙니다. 본 앱은 게임 클라이언트가 공식 제공하는 LCU(로컬 클라이언트 API) 만 사용합니다. 게임 메모리에 접근하거나 패킷을 조작하지 않으며, 픽창의 정보를 사용자에게 보여주는 동작만 합니다.',
  },
  {
    q: '내 데이터는 어디로 전송되나요?',
    a: '전송되지 않습니다. 카운터픽 설정과 사용 정보는 모두 본인의 컴퓨터에만 저장됩니다. 별도의 서버나 계정도 없습니다.',
  },
  {
    q: '자동 업데이트가 되나요?',
    a: '자동 설치는 되지 않습니다. 대신 새 버전이 나오면 앱 상단에 알림 배너가 떠서, 눌러 받으러 가실 수 있어요. 서명 인증서가 없는 상태에서 자동 설치를 붙이면 설치 경고를 매번 다시 만나게 되어 오히려 번거로워집니다.',
  },
  {
    q: '실행할 때 보안 경고가 떠요.',
    a: '코드 서명 인증서가 없어서입니다. 바이러스가 검출돼서가 아니라, 서명 없는 새 파일이면 무조건 뜨는 화면이에요. Windows는 "추가 정보 → 실행" 을 누르면 됩니다. 다운로드 페이지에 단계별 안내가 있습니다.',
  },
  {
    q: '카운터픽 추천 근거는 무엇인가요?',
    a: '본인이 직접 등록한 카운터픽을 우선순위 그대로 보여줍니다. 자동 추천 알고리즘은 1차 범위가 아니에요 — 본인의 챔피언 풀과 라인전 경험에 맞춰 직접 큐레이션하시는 구조입니다.',
  },
];

export function FaqAccordion() {
  return (
    <section id="faq" className="border-b border-border/40 py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeader
          eyebrow="faq"
          title="자주 묻는 질문"
          description="결정 전에 한 번 훑어보세요."
        />

        <div className="mt-12 space-y-3">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-xl border border-border bg-card/40 px-5 py-4 transition-colors open:border-primary/30 open:bg-card hover:bg-card/70 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold">
                <span>{faq.q}</span>
                <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
