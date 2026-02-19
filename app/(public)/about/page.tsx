'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import MomentOfSilence from '@/components/MomentOfSilence';
import { cinematicFadeVariants, containerVariants, itemVariants } from '@/lib/animations';
import { H1, P, Whisper } from '@/components/ui/Typography';
import { RomanticLoader } from '@/components/dashboard/RomanticLoaders';
import { EmptyState } from '@/components/dashboard/EmptyState';

interface StoryChapter {
  id: string;
  icon: string;
  title: string;
  content: string;
  order: number;
}

export default function About() {
  const [storyChapters, setStoryChapters] = useState<StoryChapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/about')
      .then((res) => res.json())
      .then((data) => setStoryChapters(data))
      .catch(() => setStoryChapters([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Hero section */}
      <section className="min-h-[60vh] flex items-center justify-center pt-32 pb-16 md:pb-24">
        <motion.div
          variants={cinematicFadeVariants}
          initial="hidden"
          animate="visible"
          className="text-center content-intimate px-4"
        >
          <motion.span 
            className="text-5xl md:text-6xl block mb-8 text-purple-accent opacity-40"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [1, 1.1, 1], opacity: 0.4 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            ♥
          </motion.span>
          
          <H1 className="mb-6" style={{ color: '#4a3880' }}>Tentang Kita</H1>
          
          <P className="max-w-lg mx-auto text-lg text-purple-warm opacity-90">
            Cerita cinta kita, dalam kata-kata dari hatiku yang paling dalam
          </P>
        </motion.div>
      </section>

      {/* Story chapters */}
      <section className="section-breathe">
        <div className="max-w-3xl mx-auto px-4">
          {loading ? (
            <RomanticLoader message="Mengingat cerita kita..." />
          ) : storyChapters.length === 0 ? (
            <EmptyState
              title="Belum ada cerita"
              description="Saatnya dimulai menulis cerita kita bersama..."
            />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              className="space-y-8"
            >
              {storyChapters.map((chapter) => (
                <motion.div
                  key={chapter.id}
                  variants={itemVariants}
                >
                  <div className="card-lilac p-7 md:p-9 flex gap-6 group hover:scale-[1.01]">
                    {/* Icon */}
                    <motion.div
                      className="shrink-0 mt-0.5"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
                        style={{ background: 'rgba(196,176,238,0.2)' }}
                      >
                        {chapter.icon}
                      </div>
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h2
                        className="font-serif-display font-medium mb-3 leading-snug"
                        style={{ fontSize: '1.3rem', color: '#4a3880' }}
                      >
                        {chapter.title}
                      </h2>
                      <p className="font-serif-body text-base leading-relaxed" style={{ color: 'rgba(114,80,200,0.65)' }}>
                        {chapter.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Emotional moment */}
      <MomentOfSilence 
        quote="Aku mencintaimu bukan karena siapa kamu, tapi karena siapa aku saat bersamamu"
        author="Selamanya milikmu"
      />

      {/* Closing section */}
      <section className="section-breathe">
        <div className="content-intimate text-center px-4">
          <ScrollReveal>
            <motion.div
              className="text-6xl mb-8 drop-shadow-sm"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              ♥
            </motion.div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.3}>
            <Whisper className="text-lg text-purple-accent/70">
              Dan cerita kita belum berakhir, masih banyak halaman kosong menunggu untuk kita tulis bersama...
            </Whisper>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
