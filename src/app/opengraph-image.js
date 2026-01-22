import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'The Tip - Receive Tips, Grow Wealth';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 280,
            height: 280,
            background: '#1E1B4B',
            borderRadius: 60,
            border: '8px solid rgba(255, 255, 255, 0.1)',
            marginBottom: 40,
            boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
          }}
        >
          <span
            style={{
              fontSize: 200,
              fontWeight: 900,
              color: 'white',
              lineHeight: 1,
            }}
          >
            T
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: 100,
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-0.03em',
              marginBottom: 10,
            }}
          >
            The Tip
          </span>
          <span
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: '#FBBF24',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
            }}
          >
            Receive Tips, Grow Wealth
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
