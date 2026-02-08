'use client';

import { motion } from 'framer-motion';
import LoveTimeline from '@/components/LoveTimeline';
import { MEMORIES_DATA } from '@/lib/constants';
import MomentOfSilence from '@/components/MomentOfSilence';
import ScrollReveal from '@/components/ScrollReveal';
import { cinematicFadeVariants } from '@/lib/animations';

export default function Memories() {
  return (
    <div className="relative">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Hero section */}
      <section className="min-h-[50vh] flex items-center justify-center section-breathe pt-24">
        <motion.div
          variants={cinematicFadeVariants}
          initial="initial"
          animate="animate"
          className="text-center content-intimate"
        >
          <motion.span 
            className="text-4xl block mb-8 opacity-60"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            ✦
          </motion.span>
          <h1 className="text-poetry text-dark-rose mb-6">Kenangan Indah</h1>
          <p className="text-intimate">
            Setiap momen bersamamu adalah harta yang kusimpan selamanya
          </p>
        </motion.div>
      </section>

      {/* Timeline section */}
      <section className="section-breathe">
        <div className="max-w-4xl mx-auto px-4">
          <LoveTimeline items={MEMORIES_DATA} />
        </div>
      </section>

      {/* Emotional pause */}
      <MomentOfSilence 
        quote="Kenangan kita adalah harta lebih berharga dari emas, cerita lebih indah dari dongeng manapun"
      />

      {/* Closing */}
      <section className="section-breathe">
        <div className="content-intimate text-center">
          <ScrollReveal>
            <motion.div
              className="text-4xl mb-8 opacity-60"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              ∞
            </motion.div>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <p className="text-whisper">
              Dan masih banyak kenangan indah yang akan kita ciptakan...
            </p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
