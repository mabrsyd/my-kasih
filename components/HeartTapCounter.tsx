'use client';

/**
 * HeartTapCounter — Tombol hati yang hitungannya tersimpan di localStorage
 * Setiap kali diklik, angka bertambah dan memunculkan animasi hati
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { PiHeartFill } from 'react-icons/pi';

const STORAGE_KEY = 'heart_tap_count';

interface FloatingHeart {
  id: number;
  x: number;
}

export default function HeartTapCounter() {
  const [count, setCount] = useState(0);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [burst, setBurst] = useState(false);
  let nextId = 0;

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setCount(parseInt(saved, 10));
  }, []);

  const handleTap = useCallback(() => {
    setCount(prev => {
      const next = prev + 1;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });

    // Tambah floating heart
    const id = ++nextId;
    const x = (Math.random() - 0.5) * 60;
    setFloatingHearts(prev => [...prev, { id, x }]);
    setTimeout(() => setFloatingHearts(prev => prev.filter(h => h.id !== id)), 1200);

    // Burst effect setiap 10 klik
    setCount(c => {
      if ((c + 1) % 10 === 0) {
        setBurst(true);
        setTimeout(() => setBurst(false), 600);
      }
      return c;
    });
  }, []);

  const formatted = count.toLocaleString('id-ID');

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {/* Tombol hati */}
      <div className="relative">
        {/* Floating hearts */}
        <AnimatePresence>
          {floatingHearts.map(h => (
            <motion.span
              key={h.id}
              initial={{ opacity: 1, y: 0, x: h.x, scale: 0.6 }}
              animate={{ opacity: 0, y: -60, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="absolute bottom-1/2 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{ color: '#9B5EA2', fontSize: '1.1rem' }}
            >
              ♥
            </motion.span>
          ))}
        </AnimatePresence>

        <motion.button
          onClick={handleTap}
          whileTap={{ scale: 0.85 }}
          animate={burst ? { scale: [1, 1.35, 1] } : {}}
          transition={{ duration: 0.3 }}
          className="relative w-20 h-20 rounded-full flex items-center justify-center cursor-pointer active:opacity-90"
          style={{
            background: 'rgba(196,176,238,0.15)',
            border: '1.5px solid rgba(196,176,238,0.4)',
          }}
          aria-label="Tap with love"
        >
          <motion.span
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <PiHeartFill
              size={36}
              style={{ color: burst ? '#c850a0' : '#9B5EA2', filter: 'drop-shadow(0 0 6px rgba(155,94,162,0.4))' }}
            />
          </motion.span>
        </motion.button>
      </div>

      {/* Angka */}
      <div className="text-center">
        <motion.p
          key={count}
          initial={{ scale: 1.3, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="font-serif-display text-2xl font-semibold"
          style={{ color: '#4a3880' }}
        >
          {formatted}
        </motion.p>
        <p
          className="text-xs tracking-widest uppercase mt-1 font-serif-body"
          style={{ color: 'rgba(114,80,200,0.5)' }}
        >
          {count === 0
            ? 'sentuh hati ini'
            : count < 10
            ? 'kamu menyentuh hatiku'
            : count < 50
            ? 'terima kasih sayang ♡'
            : 'betapa banyak cintamu'}
        </p>
      </div>
    </div>
  );
}
