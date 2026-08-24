import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Why Not Darius — LoL 카운터픽 자동 추천';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 64,
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(153,183,188,0.35), transparent 60%), #090b0f',
          color: '#eeeeee',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: '#99b7bc',
            }}
          />
          <span style={{ fontSize: 22, color: '#8b8f95', fontWeight: 600 }}>
            Why Not Darius?
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              maxWidth: 980,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span>상대가 이미 픽을 보여줬는데,</span>
            <span style={{ color: '#99b7bc' }}>왜 그걸 또 못 받아쳐?</span>
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#8b8f95',
              maxWidth: 900,
              fontWeight: 500,
            }}
          >
            픽창 자동 카운터 추천 데스크톱 앱 · macOS · Windows
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 20, color: '#8b8f95' }}>League of Legends · Top Lane</div>
          <div
            style={{
              padding: '12px 24px',
              borderRadius: 999,
              background: '#99b7bc',
              color: '#111418',
              fontWeight: 700,
              fontSize: 22,
            }}
          >
            무료 다운로드 →
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
