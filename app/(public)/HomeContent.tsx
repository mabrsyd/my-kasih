'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import AnimatedText from '@/components/AnimatedText';
import FloatingHearts from '@/components/FloatingHearts';
import MomentOfSilence from '@/components/MomentOfSilence';
import ScrollReveal from '@/components/ScrollReveal';
import { HERO_MESSAGES } from '@/lib/constants';
import {
  PiEnvelopeSimpleFill,
  PiStarFourFill,
  PiImagesFill,
  PiHeartFill,
  PiArrowDownLight,
  PiArrowRightLight,
  PiInfinity,
  PiSparkle,
} from 'react-icons/pi';

const NAV_CARDS = [
  {
    href: '/letter',
    Icon: PiEnvelopeSimpleFill,
    label: 'Surat Cinta',
    desc: 'Kata-kata dari hatiku yang terdalam, ditulis hanya untukmu',
  },
  {
    href: '/memories',
    Icon: PiStarFourFill,
    label: 'Kenangan Indah',
    desc: 'Setiap momen bersamamu adalah harta yang kusimpan selamanya',
  },
  {
    href: '/gallery',
    Icon: PiImagesFill,
    label: 'Galeri Foto',
    desc: 'Perjalanan visual melalui momen-momen indah kita bersama',
  },
  {
    href: '/about',
    Icon: PiHeartFill,
    label: 'Tentang Kita',
    desc: 'Cerita cinta kita, dari pertemuan pertama hingga selamanya',
  },
];

interface Props {
  heroMessages: string[];
}

export default function HomeContent({ heroMessages }: Props) {
  const [randomMessage, setRandomMessage] = useState('');

  useEffect(() => {
    // Select a random message on the client side to avoid hydration mismatch
    const msgs = heroMessages.length > 0 ? heroMessages : [...HERO_MESSAGES];
    setRandomMessage(msgs[Math.floor(Math.random() * msgs.length)]);
  }, [heroMessages]);

  return (
    <div className="relative">
      <div className="grain-overlay" />
      <FloatingHearts count={6} />

      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 relative">
        <div className="vignette" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="relative z-10 max-w-2xl text-center"
        >
          {/* Decorative ring */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            className="mb-10 flex justify-center"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 rounded-full border border-dashed"
                style={{ borderColor: 'rgba(196,176,238,0.4)' }}
              />
              <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 flex items-center justify-center"
                style={{ color: 'rgba(155,94,162,0.7)' }}
              >
                <PiHeartFill size={28} />
              </motion.span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="font-serif-display font-light mb-4 leading-tight"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', color: '#4a3880', letterSpacing: '-0.02em' }}
          >
            Untuk Kamu,
            <br />
            <em style={{ color: '#7250c8' }}>Yang Tercinta</em>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="font-serif-body text-lg leading-relaxed mb-10 max-w-md mx-auto"
            style={{ color: 'rgba(114,80,200,0.7)' }}
          >
            {randomMessage}
          </motion.p>

          {/* Animated subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="mb-12"
          >
            <AnimatedText
              text="Perjalanan cinta kita yang indah..."
              className="font-serif-body italic text-base"
              style={{ color: 'rgba(155,94,162,0.6)' }}
              duration={0.05}
            />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/letter">
              <motion.button
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="btn-romantic-filled inline-flex items-center gap-2"
              >
                Baca Surat Cinta <PiHeartFill size={16} />
              </motion.button>
            </Link>
            <Link href="/memories">
              <motion.button
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="btn-romantic"
              >
                Lihat Kenangan
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ color: 'rgba(114,80,200,0.5)' }}
          >
            <p className="text-xs tracking-widest uppercase mb-2 font-serif-body">Scroll</p>
            <PiArrowDownLight size={20} className="mx-auto" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <section className="section-breathe">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-xs tracking-widest uppercase mb-4 font-serif-body flex items-center justify-center gap-2" style={{ color: 'rgba(155,94,162,0.6)' }}>
                <PiSparkle size={13} /> Jelajahi <PiSparkle size={13} />
              </p>
              <h2
                className="font-serif-display font-light leading-tight"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#4a3880' }}
              >
                Ruang Cinta Kita
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {NAV_CARDS.map((card, idx) => (
              <ScrollReveal key={card.href} delay={idx * 0.12}>
                <Link href={card.href}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.98 }}
                    className="card-lilac group p-8 cursor-pointer h-full"
                  >
                    <div className="flex items-start gap-5">
                      {/* Icon */}
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                        style={{ background: 'rgba(196,176,238,0.2)', color: '#7250c8' }}
                      >
                        <motion.span
                          className="flex items-center justify-center"
                          animate={{ scale: [1, 1.12, 1] }}
                          transition={{ duration: 3 + idx * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <card.Icon size={26} />
                        </motion.span>
                      </div>
                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-serif-display font-medium mb-2 transition-colors duration-300 group-hover:text-purple-600"
                          style={{ fontSize: '1.1rem', color: '#4a3880' }}
                        >
                          {card.label}
                        </h3>
                        <p className="text-sm leading-relaxed font-serif-body" style={{ color: 'rgba(114,80,200,0.6)' }}>
                          {card.desc}
                        </p>
                      </div>
                      {/* Arrow */}
                      <motion.span
                        className="shrink-0 mt-1 transition-transform duration-300 group-hover:translate-x-1"
                        style={{ color: 'rgba(196,176,238,0.8)' }}
                      >
                        <PiArrowRightLight size={20} />
                      </motion.span>
                    </div>

                    {/* Bottom accent bar */}
                    <div
                      className="mt-6 h-0.5 rounded-full transition-all duration-500"
                      style={{
                        background: 'linear-gradient(90deg, rgba(196,176,238,0.4), rgba(114,80,200,0.3), transparent)',
                        transformOrigin: 'left',
                      }}
                    />
                  </motion.div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMOTIONAL PAUSE ── */}
      <MomentOfSilence
        quote="Setiap detik bersamamu adalah hadiah terindah dalam hidupku"
      />

      {/* ── CLOSING ── */}
      <section className="section-breathe">
        <div className="content-intimate text-center px-4">
          <ScrollReveal>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="mb-8 flex justify-center"
              style={{ color: 'rgba(196,176,238,0.6)' }}
            >
              <PiInfinity size={56} />
            </motion.div>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <p
              className="font-serif-display italic text-xl md:text-2xl leading-relaxed"
              style={{ color: 'rgba(114,80,200,0.65)' }}
            >
              Aku mencintaimu, hari ini, besok, dan selamanya.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.5}>
            <p className="mt-4 text-xs tracking-widest uppercase font-serif-body" style={{ color: 'rgba(155,94,162,0.5)' }}>
              &mdash; Untukmu yang tersayang
            </p>
          </ScrollReveal>
        </div>
      </section>

      <MomentOfSilence
        quote="Aku mencintaimu bukan karena siapa kamu, tapi karena siapa aku saat bersamamu"
        author="Selamanya milikmu"
      />
    </div>
  );
}
