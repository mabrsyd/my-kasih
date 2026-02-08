'use client';

import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/animations';

interface TimelineItem {
  id: number;
  date: string;
  title: string;
  description: string;
  emoji: string;
}

interface LoveTimelineProps {
  items: readonly TimelineItem[];
}

export default function LoveTimeline({ items }: LoveTimelineProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -200px 0px' }}
      className="relative"
    >
      {/* Timeline line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-soft-pink to-pastel-red opacity-30" />

      <div className="space-y-12">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className={`flex gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
          >
            {/* Content */}
            <div className="flex-1">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{item.emoji}</span>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-serif-body">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <h3 className="font-serif-display text-xl font-semibold text-romantic-red mt-1">
                      {item.title}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed font-serif-body">
                  {item.description}
                </p>
              </motion.div>
            </div>

            {/* Timeline dot */}
            <div className="flex justify-center flex-shrink-0 w-12 md:w-auto">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                viewport={{ once: true }}
                className="w-6 h-6 rounded-full bg-gradient-to-r from-romantic-red to-pastel-red border-4 border-cream shadow-lg flex items-center justify-center text-white text-xs font-bold"
              >
                ❤️
              </motion.div>
            </div>

            {/* Empty space */}
            <div className="flex-1" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
