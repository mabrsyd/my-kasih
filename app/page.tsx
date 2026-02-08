'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import AnimatedText from '@/components/AnimatedText';
import { fadeInUpVariants, containerVariants } from '@/lib/animations';
import { HERO_MESSAGES } from '@/lib/constants';
import { useState, useEffect } from 'react';

export default function Home() {
  const [randomMessage, setRandomMessage] = useState('');

  useEffect(() => {
    setRandomMessage(HERO_MESSAGES[Math.floor(Math.random() * HERO_MESSAGES.length)]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-romantic flex flex-col items-center justify-center px-4">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 left-10 text-6xl opacity-10"
        >
          ❤️
        </motion.div>
        <motion.div
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          className="absolute bottom-32 right-10 text-5xl opacity-10"
        >
          💕
        </motion.div>
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 7, repeat: Infinity, delay: 2 }}
          className="absolute top-1/2 right-1/4 text-4xl opacity-10"
        >
          ✨
        </motion.div>
      </div>

      {/* Main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-3xl text-center"
      >
        {/* Top accent */}
        <motion.div
          variants={fadeInUpVariants}
          className="mb-6"
        >
          <div className="inline-block">
            <span className="text-6xl animate-float">❤️</span>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={fadeInUpVariants}
          className="heading-romantic mb-4 text-4xl sm:text-5xl md:text-6xl"
        >
          Untuk Kamu
        </motion.h1>

        {/* Animated message */}
        <motion.div variants={fadeInUpVariants} className="mb-8">
          <p className="text-gray-600 text-lg sm:text-xl mb-6 font-serif-body">
            {randomMessage}
          </p>

          {/* Typing effect subtitle */}
          <div className="min-h-12 flex items-center justify-center">
            <AnimatedText
              text="A romantic journey of memories and love"
              className="text-2xl sm:text-3xl md:text-4xl font-serif-display text-romantic-red font-semibold"
              duration={0.04}
            />
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          variants={fadeInUpVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
        >
          <Link href="/memories">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="button-romantic px-8 py-4 text-lg"
            >
              Lihat Kenangan Kami ❤️
            </motion.button>
          </Link>
          <Link href="/about">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="button-romantic-outline px-8 py-4 text-lg"
            >
              Tentang Kita
            </motion.button>
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-20 text-gray-500 text-sm"
        >
          <p className="mb-2">Scroll untuk melanjutkan</p>
          <p className="text-2xl">↓</p>
        </motion.div>
      </motion.div>

      {/* Bottom accent */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl"
        >
          💝
        </motion.span>
      </motion.div>
    </div>
  );
}
