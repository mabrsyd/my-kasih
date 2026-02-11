'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { memoryCardVariants } from '@/lib/animations';

interface TimelineItem {
  id: string | number;
  date: string;
  title: string;
  description: string;
  emoji: string;
}

interface LoveTimelineProps {
  items: readonly TimelineItem[];
}

export default function LoveTimeline({ items }: LoveTimelineProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="relative"
    >
      {/* Timeline line - subtle */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-romantic-red/20 to-transparent" />

      <div className="space-y-16">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            variants={memoryCardVariants}
            className={`flex gap-6 md:gap-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
          >
            {/* Content */}
            <div className="flex-1">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="glass rounded-2xl p-6 md:p-8 shadow-romantic hover-glow"
              >
                {/* Date - whisper style */}
                <p className="text-whisper uppercase tracking-widest text-xs mb-4">
                  {new Date(item.date).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>

                {/* Title with subtle icon */}
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-xl opacity-60">{item.emoji}</span>
                  <h3 className="font-serif-display text-lg text-dark-rose">
                    {item.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-intimate leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            </div>

            {/* Timeline dot - minimal */}
            <div className="flex justify-center flex-shrink-0 w-8 md:w-auto relative">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className="w-3 h-3 rounded-full bg-romantic-red/60 border-2 border-cream shadow-lg z-10"
              />
            </div>

            {/* Empty space for alternating layout */}
            <div className="hidden md:block flex-1" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
