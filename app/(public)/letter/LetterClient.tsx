'use client';

import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MomentOfSilence from '@/components/MomentOfSilence';
import TypewriterText from '@/components/TypewriterText';
import {
  cinematicFadeVariants,
} from '@/lib/animations';
import { H1, P, Whisper } from '@/components/ui/Typography';
import { EmptyState } from '@/components/dashboard/EmptyState';

export interface LetterItem {
  id: string;
  title: string;
  content: string;
  order: number;
  published: boolean;
  image?: {
    publicUrl: string;
  } | null;
}

interface Props {
  letters: LetterItem[];
}

export default function LetterClient({ letters }: Props) {
  const router = useRouter();
  const letterRef = useRef(null);
  const isLetterInView = useInView(letterRef, { once: true, margin: '-10%' });
  const [printMode, setPrintMode] = useState(false);
  const [showPostscript, setShowPostscript] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Time-on-page postscript: appears after 3 minutes of reading
  useEffect(() => {
    if (!isLetterInView || letters.length === 0) return;
    const alreadySeen = sessionStorage.getItem('letter_ps_seen');
    if (alreadySeen) return;
    const timer = setTimeout(() => {
      setShowPostscript(true);
      sessionStorage.setItem('letter_ps_seen', '1');
    }, 3 * 60 * 1000); // 3 minutes
    return () => clearTimeout(timer);
  }, [isLetterInView, letters.length]);

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 300);
  };

  const navigateToFlower = () => {
    setIsTransitioning(true);
    setTimeout(() => router.push('/flower-animation'), 700);
  };

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
            transition={{ duration: 1.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] as [number, number, number, number] }}
            onClick={() => navigateToFlower()}
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

          <H1 className="mb-6 text-purple-primary" style={{ color: '#4a3880' }}>Surat Untukmu</H1>

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

      {/* Letter content */}
      <section className="section-breathe" ref={letterRef}>
        <div className="max-w-2xl mx-auto px-4">
          {letters.length === 0 ? (
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
                    className="bg-white/75 backdrop-blur-md border border-purple-secondary/30 border-l-4 border-l-purple-accent rounded-2xl p-8 md:p-12 shadow-romantic"
                  >
                    {/* Letter image (if any) */}
                    {letter.image?.publicUrl && (
                      <div className="relative w-full h-64 mb-8 rounded-xl overflow-hidden">
                        <img
                          src={letter.image.publicUrl}
                          alt={letter.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                      </div>
                    )}

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

                    {/* Letter paragraphs — only fade in; TypewriterText IS the entrance animation */}
                    <div className="space-y-8 print:space-y-5">
                      {paragraphs.map((paragraph, index) => (
                        <motion.p
                          key={index}
                          className="text-intimate text-neutral-dark leading-relaxed relative pb-2"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true, margin: '-5%' }}
                          transition={{ duration: 0.4, delay: index * 0.12 }}
                        >
                          {printMode ? (
                            paragraph
                          ) : (
                            <TypewriterText
                              text={paragraph}
                              speed={22}
                              startDelay={620 + index * 150}
                              showSkip={index === 0}
                            />
                          )}
                        </motion.p>
                      ))}
                    </div>

                    {/* Signature */}
                    <motion.div
                      className="mt-12 pt-8 border-t border-purple-secondary/30 text-center print:mt-8"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.8 }}
                    >
                      <Whisper className="block mb-6 uppercase tracking-widest text-xs text-purple-warm/70">
                        Dengan sepenuh hati,
                      </Whisper>
                      <motion.span
                        className="text-5xl inline-block filter drop-shadow-sm print:animate-none"
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

                      {/* Print button — hidden in print view */}
                      <motion.button
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1.5 }}
                        onClick={handlePrint}
                        className="mt-8 text-[0.6rem] tracking-widest uppercase font-serif-body opacity-40 hover:opacity-80 transition-opacity print:hidden"
                        style={{ color: 'rgba(155,94,162,0.6)' }}
                      >
                        ↓ Cetak surat ini
                      </motion.button>
                    </motion.div>

                    {/* Time-on-page postscript — appears only after 3 minutes of reading */}
                    <AnimatePresence>
                      {showPostscript && (
                        <motion.div
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
                          className="mt-10 pt-8 border-t border-dashed"
                          style={{ borderColor: 'rgba(196,176,238,0.3)' }}
                        >
                          <p
                            className="font-serif-body text-sm italic leading-relaxed text-center"
                            style={{ color: 'rgba(155,94,162,0.65)' }}
                          >
                            P.S. — Kalau kamu masih membaca sampai sejauh ini,
                            aku ingin kamu tahu: kamu adalah hal terbaik yang pernah
                            terjadi dalam hidupku. Terima kasih sudah ada.
                          </p>
                          <p
                            className="text-center mt-4 text-[0.6rem] tracking-widest uppercase font-serif-body"
                            style={{ color: 'rgba(196,176,238,0.5)' }}
                          >
                            ✦
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
            onClick={() => navigateToFlower()}
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

      {/* Cinematic fade-to-black overlay before /flower-animation */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="flower-transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeInOut' }}
            className="fixed inset-0 bg-black z-[9998] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
