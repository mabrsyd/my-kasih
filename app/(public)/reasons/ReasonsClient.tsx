'use client';

/**
 * ReasonsClient — Halaman alasan aku mencintaimu
 * Setiap alasan muncul satu per satu saat scroll,
 * dengan typing effect yang dramatis dan personal
 */

import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { useInView } from 'framer-motion';
import FloatingHearts from '@/components/FloatingHearts';
import ScrollReveal from '@/components/ScrollReveal';
import { LOVE_REASONS, PARTNER_NAME, YOUR_NAME } from '@/lib/constants';

interface ReasonCardProps {
  reason: { emoji: string; text: string };
  index: number;
}

function ReasonCard({ reason, index }: ReasonCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const [revealed, setRevealed] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24, y: 12 }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: 0.1,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      }}
      onAnimationComplete={() => setRevealed(true)}
      className="flex items-start gap-5 group"
    >
      {/* Number + emoji */}
      <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
        <motion.span
          animate={inView ? { scale: [0.5, 1.2, 1], opacity: [0, 1, 1] } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl"
        >
          {reason.emoji}
        </motion.span>
        <span
          className="text-[0.55rem] tracking-wide font-serif-body tabular-nums"
          style={{ color: 'rgba(196,176,238,0.5)' }}
        >
          #{String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Text */}
      <div
        className="flex-1 min-w-0 py-4 px-5 rounded-xl transition-all duration-500"
        style={{
          background: inView
            ? 'linear-gradient(135deg, rgba(196,176,238,0.12), rgba(155,94,162,0.06))'
            : 'transparent',
          border: '1px solid rgba(196,176,238,0.2)',
        }}
      >
        <p
          className="font-serif-body leading-relaxed text-base"
          style={{ color: 'rgba(74,56,128,0.85)' }}
        >
          {reason.text}
        </p>
      </div>
    </motion.div>
  );
}

export default function ReasonsClient() {
  return (
    <div className="relative min-h-screen">
      <div className="grain-overlay" />
      <FloatingHearts count={5} />

      {/* Hero */}
      <section className="min-h-[60vh] flex flex-col items-center justify-center pt-28 pb-12 px-6 text-center">
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-10"
          style={{ color: 'rgba(196,176,238,0.6)' }}
        >
          <span className="text-5xl">🌸</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xs tracking-widest uppercase mb-5 font-serif-body"
          style={{ color: 'rgba(155,94,162,0.6)' }}
        >
          ✦ Untuk {PARTNER_NAME} ✦
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-serif-display font-light leading-tight mb-6"
          style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', color: '#4a3880' }}
        >
          Alasan aku
          <br />
          <em style={{ color: '#7250c8' }}>mencintaimu</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="font-serif-body text-base leading-relaxed max-w-sm mx-auto"
          style={{ color: 'rgba(114,80,200,0.65)' }}
        >
          Ini bukan daftar yang lengkap —<br />
          karena alasanku terus bertambah setiap hari.
        </motion.p>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          transition={{ delay: 2 }}
          className="mt-12"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <p className="text-[0.65rem] tracking-widest uppercase mb-2 font-serif-body" style={{ color: 'rgba(155,94,162,0.5)' }}>
              Scroll
            </p>
            <span style={{ color: 'rgba(114,80,200,0.4)', fontSize: '1.25rem' }}>↓</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Reasons list */}
      <section className="section-breathe">
        <div className="max-w-xl mx-auto px-6 space-y-6">
          {LOVE_REASONS.map((reason, i) => (
            <ReasonCard key={i} reason={reason} index={i} />
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="section-breathe">
        <div className="max-w-lg mx-auto px-6 text-center">
          <ScrollReveal>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="mb-8 text-4xl"
            >
              ♾️
            </motion.div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p
              className="font-serif-display italic text-xl leading-relaxed"
              style={{ color: 'rgba(114,80,200,0.7)' }}
            >
              Dan masih banyak lagi, setiap hari semakin bertambah.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.4}>
            <p
              className="mt-4 text-xs tracking-widest uppercase font-serif-body"
              style={{ color: 'rgba(155,94,162,0.45)' }}
            >
              — {YOUR_NAME}
            </p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
