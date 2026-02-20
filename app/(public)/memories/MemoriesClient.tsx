'use client';

import { motion } from 'framer-motion';
import MemoryCard from '@/components/MemoryCard';
import MomentOfSilence from '@/components/MomentOfSilence';
import ScrollReveal from '@/components/ScrollReveal';
import { cinematicFadeVariants } from '@/lib/animations';
import { H1, P, Whisper } from '@/components/ui/Typography';
import { EmptyState } from '@/components/dashboard/EmptyState';

export interface MemoryItem {
  id: string;
  date: string;
  title: string;
  description: string;
  emoji: string;
  cover?: {
    publicUrl: string;
    width?: number;
    height?: number;
  };
}

interface Props {
  initialMemories: MemoryItem[];
}

export default function MemoriesClient({ initialMemories }: Props) {
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
            className="text-4xl md:text-5xl block mb-8 opacity-40"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [1, 1.1, 1], opacity: 0.5 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ color: '#c4b0ee' }}
          >
            ✦
          </motion.span>

          <H1 className="mb-6" style={{ color: '#4a3880' }}>Kenangan Indah</H1>

          <P className="max-w-lg mx-auto text-lg opacity-90" style={{ color: 'rgba(114,80,200,0.7)' }}>
            Setiap momen bersamamu adalah harta yang kusimpan selamanya dalam
            perjalanan waktu
          </P>
        </motion.div>
      </section>

      {/* Timeline section */}
      <section className="section-breathe">
        <div className="max-w-5xl mx-auto px-4">
          {initialMemories.length === 0 ? (
            <EmptyState
              icon="✦"
              title="Kenangan Sedang Disusun"
              description="Setiap kenangan sedang kami rangkai dengan penuh kasih. Seperti bunga yang mekar di musimnya, cerita indah memerlukan waktu untuk tumbuh sempurna."
              actionLabel="← Kembali ke Beranda"
              actionHref="/"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialMemories.map((memory, index) => (
                <MemoryCard
                  key={memory.id}
                  {...memory}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Emotional pause */}
      <MomentOfSilence quote="Kenangan kita adalah harta lebih berharga dari emas, cerita lebih indah dari dongeng manapun" />

      {/* Closing section */}
      <section className="section-breathe">
        <div className="content-intimate text-center px-4">
          <ScrollReveal>
            <motion.div
              className="text-6xl mb-8 text-purple-secondary opacity-40"
              animate={{ y: [0, -8, 0], scale: [1, 1.08, 1] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
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
