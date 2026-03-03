'use client';

/**
 * TypewriterText — Teks yang muncul karakter demi karakter
 * seperti sedang diketik secara live
 *
 * Fitur:
 * - Pause natural di tanda baca (, . ! ? ;)
 * - Tombol "Skip" untuk pembaca yang tidak sabaran
 * - Berkedip di akhir kalimat saat sudah selesai
 * - Hanya mulai saat elemen masuk viewport
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

interface Props {
  text: string;
  speed?: number;                // ms per character
  className?: string;
  style?: React.CSSProperties;
  /** Delay sebelum typing dimulai (ms) */
  startDelay?: number;
  /** Apakah tampilkan tombol Skip */
  showSkip?: boolean;
  /** Callback saat typing selesai */
  onComplete?: () => void;
}

// Pause lebih lama di tanda baca tertentu
const PAUSE_MAP: Record<string, number> = {
  '.': 320,
  ',': 140,
  '!': 280,
  '?': 280,
  ';': 160,
  ':': 120,
};

export default function TypewriterText({
  text,
  speed = 28,
  className = '',
  style,
  startDelay = 0,
  showSkip = true,
  onComplete,
}: Props) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleNext = () => {
    if (indexRef.current >= text.length) {
      setDone(true);
      onComplete?.();
      return;
    }

    const char = text[indexRef.current]!;
    const extraPause = PAUSE_MAP[char] ?? 0;
    const delay = speed + extraPause;

    timerRef.current = setTimeout(() => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));
      scheduleNext();
    }, delay);
  };

  // Start when in view
  useEffect(() => {
    if (!inView || skipped) return;

    const timeout = setTimeout(() => {
      scheduleNext();
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  // Skip handler — show all immediately
  const handleSkip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDisplayed(text);
    setDone(true);
    setSkipped(true);
    onComplete?.();
  };

  return (
    <span ref={ref} className={`relative inline ${className}`} style={style}>
      {displayed}

      {/* blinking cursor — only while typing */}
      {!done && inView && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-block w-[2px] h-[1em] align-middle ml-[1px] rounded-full"
          style={{ background: 'rgba(155,94,162,0.6)' }}
        />
      )}

      {/* Skip button */}
      <AnimatePresence>
        {!done && showSkip && inView && (
          <motion.button
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 0.6, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            onClick={handleSkip}
            className="absolute -bottom-6 right-0 text-[0.6rem] tracking-widest uppercase font-serif-body hover:opacity-100 transition-opacity"
            style={{ color: 'rgba(155,94,162,0.5)' }}
          >
            lewati →
          </motion.button>
        )}
      </AnimatePresence>
    </span>
  );
}
