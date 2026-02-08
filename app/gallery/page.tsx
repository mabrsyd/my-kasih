'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { GALLERY_PHOTOS } from '@/lib/constants';
import MomentOfSilence from '@/components/MomentOfSilence';
import ScrollReveal from '@/components/ScrollReveal';
import { cinematicFadeVariants, galleryImageVariants } from '@/lib/animations';

export default function Gallery() {
  const gridRef = useRef(null);
  const isInView = useInView(gridRef, { once: true, margin: "-10%" });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

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
            ◇
          </motion.span>
          <h1 className="text-poetry text-dark-rose mb-6">Galeri Kenangan</h1>
          <p className="text-intimate">
            Perjalanan visual melalui momen-momen indah kita bersama
          </p>
        </motion.div>
      </section>

      {/* Gallery Grid */}
      <section className="section-breathe">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            ref={gridRef}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {GALLERY_PHOTOS.map((photo) => (
              <motion.div
                key={photo.id}
                variants={galleryImageVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="group relative overflow-hidden rounded-xl shadow-romantic aspect-square cursor-pointer hover-glow"
              >
                {/* Background placeholder with gradient */}
                <div className={`w-full h-full ${photo.placeholder} relative transition-transform duration-700 group-hover:scale-110`}>
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-dark-rose/0 group-hover:bg-dark-rose/40 transition-all duration-500 flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="text-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <p className="text-white font-serif-display text-lg font-medium mb-1">
                        {photo.title}
                      </p>
                      <p className="text-white/70 text-xs tracking-widest uppercase">
                        Lihat
                      </p>
                    </motion.div>
                  </div>
                </div>

                {/* Title at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                  <p className="text-white text-sm font-medium drop-shadow-lg">
                    {photo.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Emotional pause */}
      <MomentOfSilence 
        quote="Setiap foto adalah jendela ke momen yang tak akan pernah terulang, namun akan selamanya hidup di hati"
      />

      {/* Note about customization */}
      <section className="section-breathe">
        <div className="content-intimate text-center">
          <ScrollReveal>
            <p className="text-whisper mb-4">
              Ganti foto-foto ini dengan momen terindah kalian bersama
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-xs text-dark-rose/40">
              Tambahkan gambar ke /public/images
            </p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
