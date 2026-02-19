'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import AnimatedText from '@/components/AnimatedText';
import FloatingHearts from '@/components/FloatingHearts';
import MomentOfSilence from '@/components/MomentOfSilence';
import ScrollReveal from '@/components/ScrollReveal';
import { cinematicFadeVariants, breatheVariants, whisperVariants } from '@/lib/animations';
import { HERO_MESSAGES } from '@/lib/constants';

export default function Home() {
  const [randomMessage, setRandomMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([...HERO_MESSAGES]);

  useEffect(() => {
    // Try to fetch from Settings API, fall back to constants
    fetch('/api/settings/hero-messages')
      .then((res) => res.json())
      .then((data) => {
        const heroMessages = data.messages && data.messages.length > 0 ? data.messages : [...HERO_MESSAGES];
        setMessages(heroMessages);
        setRandomMessage(heroMessages[Math.floor(Math.random() * heroMessages.length)]);
      })
      .catch(() => {
        // Fallback to constants
        setMessages([...HERO_MESSAGES]);
        setRandomMessage(HERO_MESSAGES[Math.floor(Math.random() * HERO_MESSAGES.length)]);
      });
  }, []);

  return (
    <div className="relative">
      {/* Grain overlay for texture */}
      <div className="grain-overlay" />
      
      {/* Floating hearts background */}
      <FloatingHearts count={6} />

      {/* Hero Section - First 5 seconds impact */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">
        {/* Vignette effect */}
        <div className="vignette" />

        {/* Main content */}
        <motion.div
          variants={cinematicFadeVariants}
          initial="initial"
          animate="animate"
          className="relative z-10 max-w-2xl text-center"
        >
          {/* Subtle breathing heart */}
          <motion.div
            variants={breatheVariants}
            initial="initial"
            animate="animate"
            className="mb-12"
          >
            <span className="text-5xl opacity-60">♥</span>
          </motion.div>

          {/* Main heading - Poetry style */}
          <motion.h1
            className="text-poetry text-dark-rose mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            Untuk Kamu,
            <br />
            <span className="text-romantic-red">Yang Tercinta</span>
          </motion.h1>

          {/* Whisper message */}
          <motion.p
            variants={whisperVariants}
            initial="initial"
            animate="animate"
            className="text-intimate mb-12 max-w-md mx-auto"
          >
            {randomMessage}
          </motion.p>

          {/* Animated subtitle with delay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mb-16"
          >
            <AnimatedText
              text="Perjalanan cinta kita yang indah..."
              className="text-handwritten text-lg text-romantic-red/70"
              duration={0.06}
            />
          </motion.div>

          {/* CTA Buttons - Romantic style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/letter">
              <motion.button
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="btn-romantic hover-glow"
              >
                Baca Surat Cinta ♥
              </motion.button>
            </Link>
            <Link href="/memories">
              <motion.button
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="btn-romantic"
              >
                Lihat Kenangan
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator - subtle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-dark-rose/50 text-center"
          >
            <p className="text-whisper mb-2 text-xs tracking-widest uppercase">Scroll</p>
            <span className="text-lg">↓</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Moment of Silence - Emotional pause */}
      <MomentOfSilence 
        quote="Setiap detik bersamamu adalah hadiah terindah dalam hidupku"
      />

      {/* Story teaser section */}
      <section className="section-breathe">
        <div className="content-intimate text-center">
          <ScrollReveal delay={0.2}>
            <h2 className="text-poetry text-3xl text-dark-rose/80 mb-8">
              Cerita Kita
            </h2>
          </ScrollReveal>
          
          <ScrollReveal delay={0.4}>
            <p className="text-intimate mb-12">
              Dari pertemuan pertama hingga hari ini, setiap momen adalah 
              lembaran indah dalam buku cerita cinta kita...
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.6}>
            <Link href="/about">
              <motion.span 
                className="link-romantic text-sm uppercase tracking-widest"
                whileHover={{ x: 5 }}
              >
                Baca Cerita Lengkap →
              </motion.span>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Gallery teaser */}
      <section className="section-breathe bg-white/30">
        <div className="content-intimate text-center">
          <ScrollReveal>
            <h2 className="text-poetry text-3xl text-dark-rose/80 mb-8">
              Galeri Kenangan
            </h2>
          </ScrollReveal>
          
          <ScrollReveal delay={0.3}>
            <p className="text-intimate mb-8">
              Foto-foto indah yang mengabadikan momen berharga kita bersama.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <Link href="/gallery">
              <motion.span 
                className="link-romantic text-sm uppercase tracking-widest"
                whileHover={{ x: 5 }}
              >
                Lihat Galeri →
              </motion.span>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Final emotional moment */}
      <MomentOfSilence 
        quote="Aku mencintaimu, hari ini, besok, dan selamanya"
        author="Untukmu yang tersayang"
      />
    </div>
  );
}
