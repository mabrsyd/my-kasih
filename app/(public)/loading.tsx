/**
 * loading.tsx — Loading screen romantis
 * Muncul saat Next.js sedang memuat halaman baru
 */
'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #f8f4ff 0%, #ede8fa 60%, #f3eeff 100%)' }}
    >
      {/* Pulsing heart */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-6 text-5xl"
        style={{ filter: 'drop-shadow(0 4px 16px rgba(114,80,200,0.25))' }}
      >
        🌸
      </motion.div>

      {/* Dots */}
      <div className="flex gap-2 mb-5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
            className="block w-2 h-2 rounded-full"
            style={{ background: '#7250c8' }}
          />
        ))}
      </div>

      <motion.p
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="text-xs tracking-widest uppercase font-serif-body"
        style={{ color: 'rgba(155,94,162,0.6)' }}
      >
        Memuat cinta...
      </motion.p>
    </div>
  );
}
