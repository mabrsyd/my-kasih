'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { cinematicFadeVariants, whisperVariants } from '@/lib/animations';

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
      <motion.div
        className="content-intimate text-center"
        variants={cinematicFadeVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Decorative line */}
        <motion.div 
          className="w-12 h-px bg-romantic-red/30 mx-auto mb-12"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
        />

        {/* Quote */}
        <motion.blockquote
          className="text-poetry text-dark-rose/80 mb-8"
          variants={whisperVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <span className="text-romantic-red/40 text-4xl leading-none">&ldquo;</span>
          {quote}
          <span className="text-romantic-red/40 text-4xl leading-none">&rdquo;</span>
        </motion.blockquote>

        {/* Author */}
        {author && (
          <motion.p
            className="text-whisper"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            — {author}
          </motion.p>
        )}

        {/* Decorative line */}
        <motion.div 
          className="w-12 h-px bg-romantic-red/30 mx-auto mt-12"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
        />
      </motion.div>
    </section>
  );
}
