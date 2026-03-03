import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'My Kasih — Website Cinta';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE || 'My Kasih';
  const partnerName = process.env.NEXT_PUBLIC_PARTNER_NAME || 'Sayangku';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f8f4ff 0%, #ede8fa 60%, #e8dff8 100%)',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Subtle pattern dots */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(196,176,238,0.25) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />

        {/* Center content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', zIndex: 1 }}>
          <div style={{ fontSize: '80px' }}>🌸</div>

          <div
            style={{
              fontSize: '72px',
              fontWeight: 300,
              color: '#4a3880',
              letterSpacing: '-0.02em',
              textAlign: 'center',
              lineHeight: 1.15,
            }}
          >
            Untuk {partnerName},
            <br />
            <span style={{ fontStyle: 'italic', color: '#7250c8' }}>Yang Tercinta</span>
          </div>

          <div
            style={{
              fontSize: '24px',
              color: 'rgba(114,80,200,0.6)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginTop: '8px',
            }}
          >
            {siteTitle}
          </div>
        </div>

        {/* Corner hearts */}
        {['♥', '♥', '♥', '♥'].map((h, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              fontSize: '28px',
              color: 'rgba(196,176,238,0.35)',
              top: i < 2 ? '40px' : undefined,
              bottom: i >= 2 ? '40px' : undefined,
              left: i % 2 === 0 ? '60px' : undefined,
              right: i % 2 === 1 ? '60px' : undefined,
            }}
          >
            {h}
          </div>
        ))}
      </div>
    ),
    { ...size },
  );
}
