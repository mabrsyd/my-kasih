'use client';

import { motion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';
import React from 'react';

// Modern elegant flower variations
const Flower1: React.FC<{ size?: number; opacity?: number }> = ({
  size = 120,
  opacity = 0.25,
}) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" suppressHydrationWarning>
    <defs>
      <filter id="flowerGlow1">
        <feGaussianBlur stdDeviation="2.5" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.8" />
        </feComponentTransfer>
      </filter>
    </defs>
    {[...Array(8)].map((_, i) => (
      <circle
        key={i}
        cx={60 + 35 * Math.cos((i * Math.PI * 2) / 8)}
        cy={60 + 35 * Math.sin((i * Math.PI * 2) / 8)}
        r="12"
        fill="#d4a373"
        opacity={opacity}
        filter="url(#flowerGlow1)"
      />
    ))}
    <circle cx="60" cy="60" r="10" fill="#e8c4a0" opacity={opacity * 1.2} filter="url(#flowerGlow1)" />
  </svg>
);

const Flower2: React.FC<{ size?: number; opacity?: number }> = ({
  size = 120,
  opacity = 0.25,
}) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" suppressHydrationWarning>
    <defs>
      <filter id="flowerGlow2">
        <feGaussianBlur stdDeviation="2.5" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.8" />
        </feComponentTransfer>
      </filter>
    </defs>
    {[...Array(6)].map((_, i) => (
      <ellipse
        key={i}
        cx={60 + 40 * Math.cos((i * Math.PI * 2) / 6)}
        cy={60 + 40 * Math.sin((i * Math.PI * 2) / 6)}
        rx="16"
        ry="20"
        fill="#d9b8a8"
        opacity={opacity}
        filter="url(#flowerGlow2)"
        transform={`rotate(${(i * 60) + 30} 60 60)`}
      />
    ))}
    <circle cx="60" cy="60" r="12" fill="#f0dcc8" opacity={opacity * 1.3} filter="url(#flowerGlow2)" />
  </svg>
);

const Flower3: React.FC<{ size?: number; opacity?: number }> = ({
  size = 120,
  opacity = 0.25,
}) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" suppressHydrationWarning>
    <defs>
      <filter id="flowerGlow3">
        <feGaussianBlur stdDeviation="2.5" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.8" />
        </feComponentTransfer>
      </filter>
    </defs>
    {[...Array(5)].map((_, i) => (
      <path
        key={i}
        d="M 60 20 Q 80 40 70 60 Q 80 65 60 80 Q 40 65 40 60 Q 30 40 60 20"
        fill="#daa58a"
        opacity={opacity}
        filter="url(#flowerGlow3)"
        transform={`rotate(${(i * 72)} 60 60)`}
      />
    ))}
    <circle cx="60" cy="60" r="11" fill="#f5dcc4" opacity={opacity} filter="url(#flowerGlow3)" />
  </svg>
);

const Flower4: React.FC<{ size?: number; opacity?: number }> = ({
  size = 120,
  opacity = 0.25,
}) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" suppressHydrationWarning>
    <defs>
      <filter id="flowerGlow4">
        <feGaussianBlur stdDeviation="2.5" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.8" />
        </feComponentTransfer>
      </filter>
    </defs>
    {[...Array(7)].map((_, i) => (
      <circle
        key={i}
        cx={60 + 32 * Math.cos((i * Math.PI * 2) / 7)}
        cy={60 + 32 * Math.sin((i * Math.PI * 2) / 7)}
        r="13"
        fill="#c9a878"
        opacity={opacity}
        filter="url(#flowerGlow4)"
      />
    ))}
    <circle cx="60" cy="60" r="14" fill="#ead5ba" opacity={opacity} filter="url(#flowerGlow4)" />
  </svg>
);

// Colorful Heart
const HeartSvg: React.FC<{ size?: number; opacity?: number; color?: string }> = ({
  size = 60,
  opacity = 0.3,
  color = '#d946ef',
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" suppressHydrationWarning>
    <defs>
      <filter id="heartGlow">
        <feGaussianBlur stdDeviation="2.5" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.8" />
        </feComponentTransfer>
      </filter>
    </defs>
    <path
      d="M50 85 C20 65, 5 50, 15 35 C25 22, 40 20, 50 30 C60 20, 75 22, 85 35 C95 50, 80 65, 50 85 Z"
      fill={color}
      opacity={opacity}
      filter="url(#heartGlow)"
    />
  </svg>
);

// Animation variants
const floatingVariants = (duration: number, yRange: number) => ({
  animate: {
    y: [0, -yRange, 0],
    transition: {
      duration,
      repeat: Infinity,
      repeatType: 'loop' as const,
      ease: 'easeInOut' as const,
    },
  },
});

const fadeInVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 1.5,
    },
  },
};

interface FloatingElement {
  id: string;
  type: 'flower' | 'heart';
  flowerType?: 1 | 2 | 3 | 4;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  yRange: number;
  baseOpacity: number;
  heartColor?: string;
}

export default function RomanticBackground() {
  // Subtle, elegant color palette - soft warm tones
  const heartColors = ['#fbbf24', '#fcd34d', '#fef3c7'];
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate random floating elements - minimal aesthetic
  const floatingElements: FloatingElement[] = useMemo(() => {
    const elements: FloatingElement[] = [];

    // Add subtle flowers - only 4 flowers for elegance
    for (let i = 0; i < 4; i++) {
      elements.push({
        id: `flower-${i}`,
        type: 'flower',
        flowerType: ((i % 4) + 1) as 1 | 2 | 3 | 4,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 60 + Math.random() * 40,
        duration: 12 + Math.random() * 6,
        delay: Math.random() * 2,
        yRange: 20 + Math.random() * 30,
        baseOpacity: 0.08 + Math.random() * 0.08,
      });
    }

    // Add subtle hearts - only 6 hearts for refinement
    for (let i = 0; i < 6; i++) {
      elements.push({
        id: `heart-${i}`,
        type: 'heart',
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 25 + Math.random() * 25,
        duration: 10 + Math.random() * 8,
        delay: Math.random() * 2,
        yRange: 15 + Math.random() * 25,
        baseOpacity: 0.1 + Math.random() * 0.12,
        heartColor: heartColors[Math.floor(Math.random() * heartColors.length)],
      });
    }

    return elements;
  }, []);

  return (
    <>
      {/* Base gradient - clean, minimal aesthetic */}
      <div
        className="fixed inset-0 -z-50 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #fafaf9 0%, #f5f3f0 50%, #faf9f7 100%)',
        }}
        suppressHydrationWarning
      />

      {/* Subtle warm accent - minimal overlay */}
      <div
        className="fixed inset-0 -z-49 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, rgba(251, 146, 60, 0.05) 0%, transparent 70%)',
        }}
        suppressHydrationWarning
      />

      {/* Animated colorful elements container */}
      <div className="fixed inset-0 -z-40 pointer-events-none overflow-hidden" suppressHydrationWarning>
        {isMounted && floatingElements.map((element) => {
          const FlowerComponent =
            element.type === 'flower'
              ? element.flowerType === 1
                ? Flower1
                : element.flowerType === 2
                  ? Flower2
                  : element.flowerType === 3
                    ? Flower3
                    : Flower4
              : null;

          return (
            <motion.div
              key={element.id}
              className="absolute"
              suppressHydrationWarning
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial="initial"
              animate="animate"
              variants={fadeInVariants}
              transition={{
                delay: element.delay * 0.15,
              }}
            >
              <motion.div variants={floatingVariants(element.duration, element.yRange)} animate="animate">
                {element.type === 'flower' && FlowerComponent ? (
                  <FlowerComponent size={element.size} opacity={element.baseOpacity} />
                ) : (
                  <HeartSvg size={element.size} opacity={element.baseOpacity} color={element.heartColor} />
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Subtle vignette */}
      <div
        className="fixed inset-0 -z-35 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(120, 113, 108, 0.02) 100%)',
        }}
        suppressHydrationWarning
      />

      {/* CSS animation support for reduced motion */}
      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}
