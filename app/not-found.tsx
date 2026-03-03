'use client';

/**
 * not-found.tsx — Halaman 404 romantis
 * "Halaman ini tidak ada, tapi cintaku untukmu selalu ada"
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import FloatingHearts from '@/components/FloatingHearts';

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="grain-overlay" />
      <FloatingHearts count={8} />

      {/* Big 404 */}
      <motion.p
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute font-serif-display font-bold select-none pointer-events-none"
        style={{
          fontSize: 'clamp(10rem, 35vw, 28rem)',
          color: '#7250c8',
          letterSpacing: '-0.05em',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          lineHeight: 1,
        }}
      >
        404
      </motion.p>

      {/* Floating heart */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 180 }}
        className="relative z-10 mb-10"
      >
        <motion.span
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-6xl inline-block"
        >
          💌
        </motion.span>
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.7 }}
        className="relative z-10 max-w-md"
      >
        <h1
          className="font-serif-display font-light leading-tight mb-5"
          style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', color: '#4a3880' }}
        >
          Halaman ini tidak ada,
          <br />
          <em style={{ color: '#7250c8' }}>tapi cintaku untukmu selalu ada.</em>
        </h1>

        <p
          className="font-serif-body text-base leading-relaxed mb-10"
          style={{ color: 'rgba(114,80,200,0.65)' }}
        >
          Mungkin kamu tersesat, tapi tidak apa-apa —
          <br />
          aku akan selalu ada untuk membawamu pulang.
        </p>

        <motion.div
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            href="/"
            className="btn-romantic-filled inline-flex items-center gap-2"
          >
            ← Bawa Aku Pulang
          </Link>
        </motion.div>
      </motion.div>

      {/* Subtle quote below */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 text-xs tracking-widest uppercase font-serif-body"
        style={{ color: 'rgba(155,94,162,0.5)' }}
      >
        ✦ Selamanya, bersamamu ✦
      </motion.p>
    </div>
  );
}
