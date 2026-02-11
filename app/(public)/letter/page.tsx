'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MomentOfSilence from '@/components/MomentOfSilence';
import {
  cinematicFadeVariants,
  letterContentVariants,
} from '@/lib/animations';
import { H1, P, Whisper } from '@/components/ui/Typography';
import { RomanticLoader } from '@/components/dashboard/RomanticLoaders';
import { EmptyState } from '@/components/dashboard/EmptyState';

interface LetterItem {
  id: string;
  title: string;
  content: string;
  order: number;
  published: boolean;
  image?: {
    publicUrl: string;
  };
}

export default function Letter() {
  const router = useRouter();
  const letterRef = useRef(null);
  const isLetterInView = useInView(letterRef, { once: true, margin: '-10%' });
  const [letters, setLetters] = useState<LetterItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/letters')
      .then((res) => res.json())
      .then((data) => setLetters(data))
      .catch(() => setLetters([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Vignette */}
      <div className="vignette" />

      {/* Hero section */}
      <section className="min-h-screen flex items-center justify-center pt-32 pb-16 md:pb-24 relative">
        <motion.div
          variants={cinematicFadeVariants}
          initial="hidden"
          animate="visible"
          className="text-center content-intimate px-4"
        >
          {/* Decorative envelope */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0, rotateY: -20 }}
            animate={{ scale: 1, opacity: 0.6, rotateY: 0 }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            onClick={() => router.push('/flower-animation')}
            className="text-6xl md:text-7xl mb-10 filter drop-shadow-sm cursor-pointer hover:opacity-100 transition-opacity group"
          >
            <motion.span
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="group-hover:scale-125 transition-transform inline-block"
            >
              ✉
            </motion.span>
          </motion.div>

          <H1 className="mb-6 text-purple-primary">Surat Untukmu</H1>

          <P className="mb-12 max-w-lg mx-auto text-purple-warm opacity-90 text-lg">
            Kata-kata dari hatiku yang terdalam,
            <br />
            <span className="text-sm opacity-75">
              ditulis hanya untukmu...
            </span>
          </P>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 2, duration: 1 }}
            className="mt-8"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-purple-accent/40"
            >
              <Whisper className="block text-xs tracking-widest uppercase mb-2">
                Baca Surat
              </Whisper>
              <span className="text-2xl">↓</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Letter content from database */}
      <section className="section-breathe" ref={letterRef}>
        <div className="max-w-2xl mx-auto px-4">
          {loading ? (
            <RomanticLoader message="Membuka amplop dengan hati-hati..." />
          ) : letters.length === 0 ? (
            <EmptyState
              icon="✉"
              title="Surat Sedang Ditulis"
              description="Kata-kata terdalam dari hati sedang disusun dengan penuh kehati-hatian. Setiap kalimat adalah pelukan, setiap kata adalah bisikan cinta yang tak terlupakan."
              actionLabel="← Kembali ke Beranda"
              actionHref="/"
            />
          ) : (
            <div className="space-y-12">
              {letters.map((letter) => {
                const paragraphs = letter.content
                  .split('\n')
                  .filter((p) => p.trim());

                return (
                  <motion.div
                    key={letter.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isLetterInView
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-white/70 backdrop-blur-md border border-l-4 border-purple-secondary rounded-2xl p-8 md:p-12 shadow-romantic border-l-purple-accent"
                  >
                    {/* Letter title */}
                    <motion.h2
                      className="text-handwritten text-xl text-purple-accent mb-8 font-serif-body"
                      initial={{ opacity: 0, y: 10 }}
                      animate={
                        isLetterInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 10 }
                      }
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      {letter.title}
                    </motion.h2>

                    {/* Letter paragraphs */}
                    <div className="space-y-6">
                      {paragraphs.map((paragraph, index) => (
                        <motion.p
                          key={index}
                          className="text-intimate text-neutral-dark leading-relaxed"
                          custom={index}
                          variants={letterContentVariants}
                          initial="hidden"
                          animate={isLetterInView ? 'visible' : 'hidden'}
                          transition={{ delay: 0.5 + index * 0.1 }}
                        >
                          {paragraph}
                        </motion.p>
                      ))}
                    </div>

                    {/* Signature */}
                    <motion.div
                      className="mt-12 pt-8 border-t border-purple-secondary/30 text-center"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.8 }}
                    >
                      <Whisper className="block mb-6 uppercase tracking-widest text-xs text-purple-warm/70">
                        Dengan sepenuh hati,
                      </Whisper>
                      <motion.span
                        className="text-5xl inline-block filter drop-shadow-sm"
                        animate={{ scale: [1, 1.12, 1] }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        ♥
                      </motion.span>
                      <p className="text-sm text-purple-accent mt-4 font-serif-body italic">
                        Selamanya milikmu
                      </p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Emotional climax */}
      <MomentOfSilence quote="Baca surat ini setiap kali kamu perlu diingatkan betapa berartinya dirimu bagiku" />

      {/* Final message */}
      <section className="section-breathe">
        <div className="content-intimate text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onClick={() => router.push('/flower-animation')}
            className="cursor-pointer group"
          >
            <motion.span
              className="text-6xl block mb-6 drop-shadow-sm group-hover:scale-110 transition-transform"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              ✉
            </motion.span>
            <Whisper className="text-lg text-purple-warm/80 group-hover:text-purple-warm transition-colors">
              Dengan cinta tak terbatas...
            </Whisper>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
