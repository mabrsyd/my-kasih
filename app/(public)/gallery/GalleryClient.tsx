'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import MomentOfSilence from '@/components/MomentOfSilence';
import MasonryGallery from '@/components/MasonryGallery';
import ScrollReveal from '@/components/ScrollReveal';
import { cinematicFadeVariants } from '@/lib/animations';
import { H1, P, Whisper } from '@/components/ui/Typography';
import { EmptyState } from '@/components/dashboard/EmptyState';

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  order: number;
  image: {
    id: string;
    publicUrl: string;
    fileName: string;
    width?: number;
    height?: number;
  };
}

interface Props {
  photos: GalleryItem[];
}

export default function GalleryClient({ photos }: Props) {
  const gridRef = useRef(null);
  const isInView = useInView(gridRef, { once: true, margin: '-10%' });

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
            className="text-4xl md:text-5xl block mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.45 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{ color: '#c4b0ee' }}
          >
            ◇
          </motion.span>

          <H1 className="mb-6" style={{ color: '#4a3880' }}>Galeri Kenangan</H1>

          <P className="max-w-xl mx-auto text-lg opacity-90" style={{ color: 'rgba(114,80,200,0.7)' }}>
            Perjalanan visual melalui momen-momen indah yang kami ciptakan
            bersama
          </P>
        </motion.div>
      </section>

      {/* Gallery Grid */}
      <section className="section-breathe">
        <div className="max-w-6xl mx-auto px-4">
          {photos.length === 0 ? (
            <EmptyState
              icon="✦"
              title="Segera Hadir"
              description="Setiap momen indah sedang kami persiapkan dengan penuh cinta. Seperti halnya cerita yang sempurna, hal indah butuh waktu untuk mekar."
              actionLabel="← Kembali ke Beranda"
              actionHref="/"
            />
          ) : (
            <MasonryGallery photos={photos} loading={false} />
          )}
        </div>
      </section>

      {/* Emotional pause section */}
      <MomentOfSilence quote="Setiap foto adalah jendela ke momen yang tak akan pernah terulang, namun akan selamanya hidup di hati" />

      {/* Closing section */}
      <section className="section-breathe">
        <div className="content-intimate text-center px-4">
          <ScrollReveal>
            <Whisper className="text-purple-accent/50 block">
              Kelola galeri dari dashboard untuk menambah momen baru
            </Whisper>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
