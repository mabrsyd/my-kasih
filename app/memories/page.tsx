'use client';

import { motion } from 'framer-motion';
import LoveTimeline from '@/components/LoveTimeline';
import { MEMORIES_DATA } from '@/lib/constants';
import MomentOfSilence from '@/components/MomentOfSilence';
import ScrollReveal from '@/components/ScrollReveal';
import { cinematicFadeVariants, purpleGlowVariants } from '@/lib/animations';
import { H1, P, Whisper } from '@/components/ui/Typography';

export default function Memories() {
  return (
    <div className="relative">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Hero section */}
      <section className="min-h-[55vh] flex items-center justify-center pt-32 pb-16 md:pb-24">
        <motion.div
          variants={cinematicFadeVariants}
          initial="hidden"
          animate="visible"
          className="text-center content-intimate px-4"
        >
          <motion.span 
            className="text-5xl md:text-6xl block mb-8 text-purple-secondary opacity-40"
            initial={{ scale: 0.6, opacity: 0 }}
            variants={purpleGlowVariants}
            animate="animate"
          >
            ✦
          </motion.span>
          
          <H1 className="mb-6 text-purple-primary">Kenangan Indah</H1>
          
          <P className="max-w-lg mx-auto text-lg text-purple-warm opacity-90">
            Setiap momen bersamamu adalah harta yang kusimpan selamanya dalam perjalanan waktu
          </P>
        </motion.div>
      </section>

      {/* Timeline section */}
      <section className="section-breathe">
        <div className="max-w-5xl mx-auto px-4">
          <LoveTimeline items={MEMORIES_DATA} />
        </div>
      </section>

      {/* Emotional pause */}
      <MomentOfSilence 
        quote="Kenangan kita adalah harta lebih berharga dari emas, cerita lebih indah dari dongeng manapun"
      />

      {/* Closing section */}
      <section className="section-breathe">
        <div className="content-intimate text-center px-4">
          <ScrollReveal>
            <motion.div
              className="text-6xl mb-8 text-purple-secondary opacity-40"
              animate={{ y: [0, -8, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              ∞
            </motion.div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.3}>
            <Whisper className="text-lg text-purple-accent/70">
              Dan masih banyak kenangan indah yang akan kita ciptakan bersama...
            </Whisper>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
