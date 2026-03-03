'use client';

/**
 * KonamiEgg — Easter egg tersembunyi
 *
 * Cara aktivasi: ketik urutan Konami code
 *   ↑ ↑ ↓ ↓ ← → ← → B A
 * atau tap secara tersembunyi di layar mobile.
 *
 * Ketika aktif: overlay khusus muncul dengan pesan romantis
 * dan animasi penuh. Tekan Escape atau klik untuk menutup.
 */

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PARTNER_NAME, YOUR_NAME } from '@/lib/constants';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

const SECRET_MESSAGE = `${PARTNER_NAME}... kamu menemukannya! 🌸

Ini adalah pesan rahasiaku untukmu.
Tersembunyi di sini, menunggu saat kamu datang.

Aku mencintaimu lebih dari yang bisa aku ungkapkan
dengan kata-kata manapun di dunia ini.

Kamu adalah keajaiban terbesar dalam hidupku.

— ${YOUR_NAME} ♥`;

const CONFETTI_EMOJIS = ['🌸', '✨', '💜', '🌷', '⭐', '💫', '🌺', '🫶'];

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  rotate: number;
  scale: number;
}

function generateParticles(count = 30): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length]!,
    x: Math.random() * 100,
    y: -10 + Math.random() * 20,
    rotate: Math.random() * 360,
    scale: 0.6 + Math.random() * 0.8,
  }));
}

export default function KonamiEgg() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [active, setActive] = useState(false);
  const [particles] = useState(() => generateParticles(28));

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      setSequence(prev => {
        const next = [...prev, e.key].slice(-KONAMI_CODE.length);
        if (next.join(',') === KONAMI_CODE.join(',')) {
          setActive(true);
          return [];
        }
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const close = () => setActive(false);

  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={close}
          className="fixed inset-0 z-[9999] flex items-center justify-center px-6"
          style={{
            background: 'linear-gradient(135deg, rgba(248,244,255,0.97), rgba(237,232,250,0.97))',
            backdropFilter: 'blur(24px)',
          }}
        >
          {/* Confetti particles */}
          {particles.map(p => (
            <motion.span
              key={p.id}
              initial={{ x: `${p.x}vw`, y: '-10vh', rotate: p.rotate, scale: 0, opacity: 0 }}
              animate={{
                y: ['−10vh', '110vh'],
                rotate: p.rotate + 360,
                scale: [0, p.scale, p.scale * 0.8],
                opacity: [0, 1, 0.6, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 1.5,
                ease: 'linear',
              }}
              className="absolute pointer-events-none select-none text-2xl"
              style={{ left: `${p.x}%` }}
            >
              {p.emoji}
            </motion.span>
          ))}

          {/* Main card */}
          <motion.div
            initial={{ scale: 0.7, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.7, y: 30 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 22 }}
            onClick={e => e.stopPropagation()}
            className="relative max-w-md w-full text-center z-10 rounded-3xl p-10"
            style={{
              background: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(196,176,238,0.5)',
              boxShadow: '0 24px 64px rgba(114,80,200,0.15)',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-5xl mb-6"
            >
              🌸
            </motion.div>

            <p
              className="text-[0.6rem] tracking-widest uppercase mb-4 font-serif-body"
              style={{ color: 'rgba(155,94,162,0.6)' }}
            >
              ✦ Pesan rahasia ditemukan ✦
            </p>

            <div
              className="font-serif-body text-sm leading-loose text-left whitespace-pre-line"
              style={{ color: 'rgba(74,56,128,0.85)' }}
            >
              {SECRET_MESSAGE}
            </div>

            <button
              onClick={close}
              className="mt-8 text-[0.6rem] tracking-widest uppercase font-serif-body opacity-50 hover:opacity-90 transition-opacity"
              style={{ color: 'rgba(155,94,162,0.7)' }}
            >
              Tutup ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
