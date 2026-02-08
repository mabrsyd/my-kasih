'use client';

import { motion } from 'framer-motion';
import LoveTimeline from '@/components/LoveTimeline';
import { MEMORIES_DATA } from '@/lib/constants';
import { fadeInUpVariants, containerVariants } from '@/lib/animations';

export default function Memories() {
  return (
    <div className="min-h-screen bg-gradient-romantic pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Header */}
          <motion.div variants={fadeInUpVariants} className="text-center mb-16">
            <h1 className="heading-romantic mb-4">Kenangan Indah Kita 📸</h1>
            <p className="text-gray-600 text-lg font-serif-body">
              Every moment with you is a memory I treasure forever
            </p>
          </motion.div>

          {/* Timeline */}
          <LoveTimeline items={MEMORIES_DATA} />

          {/* Bottom message */}
          <motion.div
            variants={fadeInUpVariants}
            className="text-center mt-20 pt-12 border-t border-white/30"
          >
            <p className="text-gray-600 font-serif-body text-lg italic">
              "Our memories are treasure more precious than gold, stories more beautiful than any fairytale."
            </p>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-6 inline-block text-5xl"
            >
              📖
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
