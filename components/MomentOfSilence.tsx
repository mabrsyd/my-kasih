'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface MomentOfSilenceProps {
  quote?: string;
  author?: string;
  className?: string;
}

export default function MomentOfSilence({
  quote = "Setiap momen bersamamu adalah hadiah terindah...",
  author,
  className = ''
}: MomentOfSilenceProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section
      ref={ref}
      className={`moment-pause section-breathe ${className}`}
    >
      <div className="content-intimate text-center px-6">
        {/* Top shimmer line */}
        <motion.div
          className="h-px mx-auto mb-14 max-w-xs"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(196,176,238,0.7) 40%, rgba(114,80,200,0.5) 50%, rgba(196,176,238,0.7) 60%, transparent)' }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
        />

        {/* Decorative symbol */}
        <motion.span
          className="block text-2xl mb-8"
          style={{ color: 'rgba(196,176,238,0.6)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          ✦
        </motion.span>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="font-serif-display text-2xl md:text-3xl leading-relaxed italic mb-8"
          style={{ color: '#5b3dad' }}
        >
          &ldquo;{quote}&rdquo;
        </motion.blockquote>

        {/* Author */}
        {author && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="text-sm tracking-widest uppercase"
            style={{ color: 'rgba(155,94,162,0.65)', fontFamily: 'Lora, serif' }}
          >
            — {author}
          </motion.p>
        )}

        {/* Bottom shimmer line */}
        <motion.div
          className="h-px mx-auto mt-14 max-w-xs"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(196,176,238,0.7) 40%, rgba(114,80,200,0.5) 50%, rgba(196,176,238,0.7) 60%, transparent)' }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 0.6 }}
        />
      </div>
    </section>
  );
}

