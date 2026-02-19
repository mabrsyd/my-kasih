'use client';

import { motion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';
import React from 'react';

// â”€â”€â”€ SVG Shape Library â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const Flower1: React.FC<{ size?: number; opacity?: number; color?: string }> = ({ size = 100, opacity = 0.22, color = '#c4b0ee' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" suppressHydrationWarning>
    {[...Array(8)].map((_, i) => (
      <ellipse
        key={i}
        cx={50 + 28 * Math.cos((i * Math.PI * 2) / 8)}
        cy={50 + 28 * Math.sin((i * Math.PI * 2) / 8)}
        rx="11" ry="16"
        fill={color} opacity={opacity}
        transform={`rotate(${i * 45} 50 50)`}
      />
    ))}
    <circle cx="50" cy="50" r="9" fill="#fff" opacity={opacity * 1.5} />
    <circle cx="50" cy="50" r="5" fill={color} opacity={opacity * 1.8} />
  </svg>
);

const Flower2: React.FC<{ size?: number; opacity?: number; color?: string }> = ({ size = 100, opacity = 0.22, color = '#b97ba8' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" suppressHydrationWarning>
    {[...Array(6)].map((_, i) => (
      <path
        key={i}
        d={`M50 50 Q${50 + 38 * Math.cos((i * Math.PI * 2) / 6 - 0.3)} ${50 + 38 * Math.sin((i * Math.PI * 2) / 6 - 0.3)} ${50 + 36 * Math.cos((i * Math.PI * 2) / 6)} ${50 + 36 * Math.sin((i * Math.PI * 2) / 6)} Q${50 + 38 * Math.cos((i * Math.PI * 2) / 6 + 0.3)} ${50 + 38 * Math.sin((i * Math.PI * 2) / 6 + 0.3)} 50 50`}
        fill={color} opacity={opacity}
      />
    ))}
    {[...Array(6)].map((_, i) => (
      <ellipse
        key={`p${i}`}
        cx={50 + 30 * Math.cos((i * Math.PI * 2) / 6)}
        cy={50 + 30 * Math.sin((i * Math.PI * 2) / 6)}
        rx="12" ry="18"
        fill={color} opacity={opacity * 0.9}
        transform={`rotate(${i * 60 + 30} 50 50)`}
      />
    ))}
    <circle cx="50" cy="50" r="8" fill="#fde8f4" opacity={opacity * 1.4} />
  </svg>
);

const Flower3: React.FC<{ size?: number; opacity?: number; color?: string }> = ({ size = 100, opacity = 0.22, color = '#a98de4' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" suppressHydrationWarning>
    {[...Array(5)].map((_, i) => (
      <ellipse
        key={i}
        cx={50 + 30 * Math.cos((i * Math.PI * 2) / 5)}
        cy={50 + 30 * Math.sin((i * Math.PI * 2) / 5)}
        rx="13" ry="20"
        fill={color} opacity={opacity}
        transform={`rotate(${(i * 72) + 36} 50 50)`}
      />
    ))}
    <circle cx="50" cy="50" r="10" fill="#eeddfb" opacity={opacity * 1.3} />
    <circle cx="50" cy="50" r="4" fill={color} opacity={opacity * 2} />
  </svg>
);

const Flower4: React.FC<{ size?: number; opacity?: number; color?: string }> = ({ size = 100, opacity = 0.22, color = '#daccf5' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" suppressHydrationWarning>
    {[...Array(10)].map((_, i) => (
      <path
        key={i}
        d={`M50 50 C${50 + 8 * Math.cos((i * Math.PI * 2) / 10 - 0.4)} ${50 + 8 * Math.sin((i * Math.PI * 2) / 10 - 0.4)} ${50 + 36 * Math.cos((i * Math.PI * 2) / 10)} ${50 + 26 * Math.sin((i * Math.PI * 2) / 10)} ${50 + 36 * Math.cos((i * Math.PI * 2) / 10)} ${50 + 36 * Math.sin((i * Math.PI * 2) / 10)}`}
        stroke={color} strokeWidth="2.5" fill="none" opacity={opacity * 1.2}
      />
    ))}
    <circle cx="50" cy="50" r="7" fill={color} opacity={opacity * 1.6} />
  </svg>
);

const Flower5: React.FC<{ size?: number; opacity?: number; color?: string }> = ({ size = 80, opacity = 0.2, color = '#e8b4c8' }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" suppressHydrationWarning>
    {[...Array(4)].map((_, i) => (
      <ellipse
        key={i}
        cx={40 + 22 * Math.cos((i * Math.PI * 2) / 4)}
        cy={40 + 22 * Math.sin((i * Math.PI * 2) / 4)}
        rx="14" ry="14"
        fill={color} opacity={opacity}
        transform={`rotate(${i * 90} 40 40)`}
      />
    ))}
    {[...Array(4)].map((_, i) => (
      <ellipse
        key={`d${i}`}
        cx={40 + 22 * Math.cos((i * Math.PI * 2) / 4 + Math.PI / 4)}
        cy={40 + 22 * Math.sin((i * Math.PI * 2) / 4 + Math.PI / 4)}
        rx="10" ry="10"
        fill={color} opacity={opacity * 0.8}
        transform={`rotate(${i * 90 + 45} 40 40)`}
      />
    ))}
    <circle cx="40" cy="40" r="8" fill="#fff" opacity={opacity * 1.5} />
  </svg>
);

const HeartSvg: React.FC<{ size?: number; opacity?: number; color?: string }> = ({ size = 50, opacity = 0.25, color = '#c4b0ee' }) => (
  <svg width={size} height={size} viewBox="0 0 50 50" fill="none" suppressHydrationWarning>
    <path d="M25 42 C25 42 6 28 6 16 C6 10 10.5 6 16 6 C19.5 6 22.5 7.8 25 11 C27.5 7.8 30.5 6 34 6 C39.5 6 44 10 44 16 C44 28 25 42 25 42Z" fill={color} opacity={opacity} />
  </svg>
);

const Butterfly: React.FC<{ size?: number; opacity?: number; color?: string }> = ({ size = 80, opacity = 0.2, color = '#c4b0ee' }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 80 56" fill="none" suppressHydrationWarning>
    {/* Left wings */}
    <ellipse cx="22" cy="20" rx="20" ry="14" fill={color} opacity={opacity} transform="rotate(-20 22 20)" />
    <ellipse cx="18" cy="38" rx="14" ry="10" fill={color} opacity={opacity * 0.8} transform="rotate(15 18 38)" />
    {/* Right wings */}
    <ellipse cx="58" cy="20" rx="20" ry="14" fill={color} opacity={opacity} transform="rotate(20 58 20)" />
    <ellipse cx="62" cy="38" rx="14" ry="10" fill={color} opacity={opacity * 0.8} transform="rotate(-15 62 38)" />
    {/* Wing patterns */}
    <circle cx="26" cy="18" r="5" fill="white" opacity={opacity * 0.6} />
    <circle cx="54" cy="18" r="5" fill="white" opacity={opacity * 0.6} />
    {/* Body */}
    <ellipse cx="40" cy="28" rx="3" ry="14" fill="#9b5ea2" opacity={opacity * 1.2} />
    {/* Antennae */}
    <path d="M40 14 Q35 6 32 4" stroke="#9b5ea2" strokeWidth="1.2" fill="none" opacity={opacity} />
    <path d="M40 14 Q45 6 48 4" stroke="#9b5ea2" strokeWidth="1.2" fill="none" opacity={opacity} />
    <circle cx="32" cy="4" r="1.5" fill="#9b5ea2" opacity={opacity} />
    <circle cx="48" cy="4" r="1.5" fill="#9b5ea2" opacity={opacity} />
  </svg>
);

const Sparkle: React.FC<{ size?: number; opacity?: number; color?: string }> = ({ size = 40, opacity = 0.35, color = '#c4b0ee' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" suppressHydrationWarning>
    <path d="M20 2 L22 18 L38 20 L22 22 L20 38 L18 22 L2 20 L18 18 Z" fill={color} opacity={opacity} />
    <path d="M20 8 L21 18 L20 28 L19 18 Z" fill="white" opacity={opacity * 0.5} />
  </svg>
);

const MusicNote: React.FC<{ size?: number; opacity?: number; color?: string }> = ({ size = 50, opacity = 0.25, color = '#a98de4' }) => (
  <svg width={size} height={size} viewBox="0 0 50 50" fill="none" suppressHydrationWarning>
    <ellipse cx="14" cy="40" rx="8" ry="6" fill={color} opacity={opacity} transform="rotate(-15 14 40)" />
    <ellipse cx="36" cy="35" rx="8" ry="6" fill={color} opacity={opacity} transform="rotate(-15 36 35)" />
    <path d="M22 40 L22 12 L44 6 L44 35" stroke={color} strokeWidth="3" fill="none" opacity={opacity} strokeLinecap="round" />
    <line x1="22" y1="12" x2="44" y2="6" stroke={color} strokeWidth="3" opacity={opacity} strokeLinecap="round" />
  </svg>
);

const Petal: React.FC<{ size?: number; opacity?: number; color?: string }> = ({ size = 40, opacity = 0.25, color = '#e8b4c8' }) => (
  <svg width={size} height={size * 1.5} viewBox="0 0 40 60" fill="none" suppressHydrationWarning>
    <path d="M20 2 C30 10 34 25 30 42 C26 55 14 58 10 45 C6 32 6 15 20 2Z" fill={color} opacity={opacity} />
    <path d="M20 8 C24 18 24 32 20 45" stroke="white" strokeWidth="1" fill="none" opacity={opacity * 0.7} strokeLinecap="round" />
  </svg>
);

const Ribbon: React.FC<{ size?: number; opacity?: number; color?: string }> = ({ size = 60, opacity = 0.2, color = '#b97ba8' }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" suppressHydrationWarning>
    {/* Bow left */}
    <path d="M30 30 C18 22 10 28 12 36 C14 44 24 42 30 30Z" fill={color} opacity={opacity} />
    {/* Bow right */}
    <path d="M30 30 C42 22 50 28 48 36 C46 44 36 42 30 30Z" fill={color} opacity={opacity} />
    {/* Bow top left */}
    <path d="M30 30 C18 18 12 10 18 6 C24 2 30 14 30 30Z" fill={color} opacity={opacity * 0.85} />
    {/* Bow top right */}
    <path d="M30 30 C42 18 48 10 42 6 C36 2 30 14 30 30Z" fill={color} opacity={opacity * 0.85} />
    {/* Center knot */}
    <circle cx="30" cy="30" r="5" fill={color} opacity={opacity * 1.3} />
    <circle cx="30" cy="30" r="3" fill="white" opacity={opacity * 0.8} />
    {/* Tails */}
    <path d="M27 34 L20 48 L25 50 L30 36Z" fill={color} opacity={opacity * 0.7} />
    <path d="M33 34 L40 48 L35 50 L30 36Z" fill={color} opacity={opacity * 0.7} />
  </svg>
);

const Star: React.FC<{ size?: number; opacity?: number; color?: string }> = ({ size = 30, opacity = 0.3, color = '#daccf5' }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" fill="none" suppressHydrationWarning>
    <path d="M15 2 L17.5 11 L27 11 L19.5 16.5 L22 26 L15 20.5 L8 26 L10.5 16.5 L3 11 L12.5 11 Z" fill={color} opacity={opacity} />
  </svg>
);

const Diamond: React.FC<{ size?: number; opacity?: number; color?: string }> = ({ size = 28, opacity = 0.3, color = '#c4b0ee' }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" suppressHydrationWarning>
    <path d="M14 2 L26 14 L14 26 L2 14 Z" fill={color} opacity={opacity} />
    <path d="M14 6 L22 14 L14 22 L6 14 Z" fill="white" opacity={opacity * 0.4} />
  </svg>
);

const CrescentMoon: React.FC<{ size?: number; opacity?: number; color?: string }> = ({ size = 45, opacity = 0.22, color = '#a98de4' }) => (
  <svg width={size} height={size} viewBox="0 0 45 45" fill="none" suppressHydrationWarning>
    <path d="M30 8 C18 12 14 24 18 35 C10 32 6 22 10 13 C14 4 24 2 30 8Z" fill={color} opacity={opacity} />
    <circle cx="34" cy="14" r="2" fill={color} opacity={opacity * 0.7} />
    <circle cx="36" cy="22" r="1.5" fill={color} opacity={opacity * 0.5} />
    <circle cx="32" cy="8" r="1" fill={color} opacity={opacity * 0.5} />
  </svg>
);

const Dots: React.FC<{ opacity?: number; color?: string }> = ({ opacity = 0.25, color = '#c4b0ee' }) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" suppressHydrationWarning>
    {[10, 20, 30].map((cx) =>
      [10, 20, 30].map((cy) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.5" fill={color} opacity={opacity} />
      ))
    )}
  </svg>
);

// â”€â”€â”€ Element Types & Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// â”€â”€â”€ Animation Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const floating = (duration: number, yRange: number, rotate = 0) => ({
  animate: {
    y: [0, -yRange, 0],
    rotate: rotate ? [0, rotate, 0] : undefined,
    transition: { duration, repeat: Infinity, repeatType: 'loop' as const, ease: 'easeInOut' as const },
  },
});

const fadeIn = (delay: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 1.8, delay } },
});

// â”€â”€â”€ Element Definitions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type ElementType = 'flower1' | 'flower2' | 'flower3' | 'flower4' | 'flower5' |
  'heart' | 'butterfly' | 'sparkle' | 'musicnote' | 'petal' | 'ribbon' | 'star' | 'diamond' | 'crescent' | 'dots';

interface FloatingEl {
  id: string;
  type: ElementType;
  x: number; y: number;
  size: number;
  dur: number; delay: number;
  yRange: number;
  rotate: number;
  opacity: number;
  color: string;
}

// Curated palette
const PALETTE = ['#c4b0ee', '#a98de4', '#b97ba8', '#9b5ea2', '#daccf5', '#e8b4c8', '#d8a8e0', '#bda8f5', '#f0e6ff'];

const ELEMENT_CONFIGS: { type: ElementType; weight: number; sizeRange: [number, number]; opacityRange: [number, number] }[] = [
  { type: 'flower1',   weight: 7,  sizeRange: [70, 120],  opacityRange: [0.12, 0.22] },
  { type: 'flower2',   weight: 6,  sizeRange: [65, 110],  opacityRange: [0.12, 0.22] },
  { type: 'flower3',   weight: 6,  sizeRange: [70, 115],  opacityRange: [0.12, 0.22] },
  { type: 'flower4',   weight: 5,  sizeRange: [55, 100],  opacityRange: [0.12, 0.20] },
  { type: 'flower5',   weight: 5,  sizeRange: [50, 90],   opacityRange: [0.12, 0.20] },
  { type: 'heart',     weight: 8,  sizeRange: [30, 65],   opacityRange: [0.18, 0.30] },
  { type: 'butterfly', weight: 5,  sizeRange: [60, 95],   opacityRange: [0.15, 0.25] },
  { type: 'sparkle',   weight: 8,  sizeRange: [20, 44],   opacityRange: [0.25, 0.45] },
  { type: 'musicnote', weight: 4,  sizeRange: [35, 60],   opacityRange: [0.18, 0.28] },
  { type: 'petal',     weight: 6,  sizeRange: [25, 55],   opacityRange: [0.18, 0.30] },
  { type: 'ribbon',    weight: 3,  sizeRange: [45, 75],   opacityRange: [0.15, 0.25] },
  { type: 'star',      weight: 6,  sizeRange: [18, 38],   opacityRange: [0.22, 0.38] },
  { type: 'diamond',   weight: 5,  sizeRange: [16, 36],   opacityRange: [0.22, 0.35] },
  { type: 'crescent',  weight: 3,  sizeRange: [35, 60],   opacityRange: [0.15, 0.26] },
  { type: 'dots',      weight: 4,  sizeRange: [30, 50],   opacityRange: [0.18, 0.30] },
];

function buildElements(): FloatingEl[] {
  // Weighted pool
  const pool: ElementType[] = [];
  for (const cfg of ELEMENT_CONFIGS) {
    for (let w = 0; w < cfg.weight; w++) pool.push(cfg.type);
  }

  const elements: FloatingEl[] = [];
  const TARGET = 32;

  // Deterministic-ish positions to avoid hydration mismatch â€” seeded grid
  for (let i = 0; i < TARGET; i++) {
    const t = i / TARGET;
    const cfg = ELEMENT_CONFIGS[i % ELEMENT_CONFIGS.length];
    const [sMin, sMax] = cfg.sizeRange;
    const [oMin, oMax] = cfg.opacityRange;
    // spread positions with slight jitter via sin/cos
    const col = i % 8;
    const row = Math.floor(i / 8);
    const x = (col / 7) * 96 + 2 + Math.sin(i * 2.3) * 3;
    const y = (row / 3) * 92 + 4 + Math.cos(i * 1.7) * 4;

    elements.push({
      id: `el-${i}`,
      type: cfg.type,
      x: Math.max(2, Math.min(96, x)),
      y: Math.max(2, Math.min(95, y)),
      size: sMin + ((i * 137) % (sMax - sMin + 1)),
      dur: 10 + (i * 83 % 12),
      delay: (i * 61 % 30) / 10,
      yRange: 14 + (i * 47 % 28),
      rotate: (i % 3 === 0) ? (8 + (i * 23 % 18)) * (i % 2 === 0 ? 1 : -1) : 0,
      opacity: oMin + ((i * 97) % 100) / 100 * (oMax - oMin),
      color: PALETTE[i % PALETTE.length],
    });
  }
  return elements;
}

const SHAPE_MAP: Record<ElementType, React.FC<{ size?: number; opacity?: number; color?: string }>> = {
  flower1:   Flower1,
  flower2:   Flower2,
  flower3:   Flower3,
  flower4:   Flower4,
  flower5:   Flower5,
  heart:     HeartSvg,
  butterfly: Butterfly,
  sparkle:   Sparkle,
  musicnote: MusicNote,
  petal:     Petal,
  ribbon:    Ribbon,
  star:      Star,
  diamond:   Diamond,
  crescent:  CrescentMoon,
  dots:      Dots,
};

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function RomanticBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const elements = useMemo(() => buildElements(), []);

  return (
    <>
      {/* Base parchment gradient */}
      <div
        className="fixed inset-0 -z-50 pointer-events-none"
        style={{ background: 'linear-gradient(155deg, #f7f3ff 0%, #fbf8ff 35%, #f4effc 65%, #fdf9ff 100%)' }}
        suppressHydrationWarning
      />

      {/* Bokeh glow orbs â€” large blurred circles for depth */}
      <div className="fixed inset-0 -z-49 pointer-events-none" suppressHydrationWarning>
        {[
          { x: '10%',  y: '8%',  w: '42vw', h: '42vw', color: 'rgba(196,176,238,0.18)' },
          { x: '72%',  y: '5%',  w: '32vw', h: '32vw', color: 'rgba(184,134,184,0.14)' },
          { x: '5%',   y: '55%', w: '38vw', h: '38vw', color: 'rgba(169,141,228,0.12)' },
          { x: '70%',  y: '60%', w: '44vw', h: '44vw', color: 'rgba(218,204,245,0.20)' },
          { x: '45%',  y: '30%', w: '28vw', h: '28vw', color: 'rgba(155,94,162,0.09)'  },
          { x: '85%',  y: '35%', w: '22vw', h: '22vw', color: 'rgba(196,176,238,0.10)' },
          { x: '25%',  y: '75%', w: '30vw', h: '30vw', color: 'rgba(232,180,200,0.12)' },
        ].map((orb, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: orb.x, top: orb.y,
              width: orb.w, height: orb.h,
              background: `radial-gradient(ellipse, ${orb.color} 0%, transparent 70%)`,
              borderRadius: '50%',
              filter: 'blur(8px)',
              transform: 'translate(-50%,-50%)',
            }}
            suppressHydrationWarning
          />
        ))}
      </div>

      {/* Floating 2D elements */}
      <div className="fixed inset-0 -z-40 pointer-events-none overflow-hidden" suppressHydrationWarning>
        {mounted && elements.map((el) => {
          const Shape = SHAPE_MAP[el.type];
          return (
            <motion.div
              key={el.id}
              className="absolute"
              suppressHydrationWarning
              style={{ left: `${el.x}%`, top: `${el.y}%`, transform: 'translate(-50%,-50%)' }}
              {...fadeIn(el.delay * 0.4)}
            >
              <motion.div {...floating(el.dur, el.yRange, el.rotate)} animate="animate">
                <Shape size={el.size} opacity={el.opacity} color={el.color} />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Soft vignette rim */}
      <div
        className="fixed inset-0 -z-35 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(90,50,160,0.06) 100%)' }}
        suppressHydrationWarning
      />
    </>
  );
}
