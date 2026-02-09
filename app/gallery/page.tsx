'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { GALLERY_PHOTOS } from '@/lib/constants';
import MomentOfSilence from '@/components/MomentOfSilence';
import ScrollReveal from '@/components/ScrollReveal';
import { 
  cinematicFadeVariants, 
  galleryImageVariants,
  containerVariants,
  itemVariants,
  cardHoverVariants
} from '@/lib/animations';
import { H1, P, Whisper } from '@/components/ui/Typography';

export default function Gallery() {
  const gridRef = useRef(null);
  const isInView = useInView(gridRef, { once: true, margin: "-10%" });

  const staggerContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

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
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            ◇
          </motion.span>
          
          <H1 className="mb-6">Galeri Kenangan</H1>
          
          <P className="max-w-xl mx-auto text-lg text-purple-warm opacity-90">
            Perjalanan visual melalui momen-momen indah yang kami ciptakan bersama
          </P>
        </motion.div>
      </section>

      {/* Gallery Grid */}
      <section className="section-breathe">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            ref={gridRef}
            variants={staggerContainerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
          >
            {GALLERY_PHOTOS.map((photo, index) => (
              <motion.div
                key={photo.id}
                variants={itemVariants}
                whileHover="hover"
                whileTap="tap"
                initial="rest"
                className="group relative overflow-hidden rounded-xl shadow-romantic aspect-[4/5] cursor-pointer transition-all duration-300"
              >
                {/* Background gradient */}
                <div className={`w-full h-full ${photo.placeholder} relative transition-transform duration-700 group-hover:scale-110`}>
                  {/* Gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-primary/40 via-transparent via-40% to-transparent group-hover:from-purple-primary/50 transition-all duration-500" />
                  
                  {/* Hover overlay - title and action */}
                  <div className="absolute inset-0 bg-purple-primary/0 group-hover:bg-purple-primary/30 transition-all duration-500 flex items-center justify-center"  >
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-center"
                    >
                      <p className="text-white font-serif-display text-xl font-medium mb-2">
                        {photo.title}
                      </p>
                      <p className="text-white/80 text-xs tracking-widest uppercase font-light">
                        Lihat Detail
                      </p>
                    </motion.div>
                  </div>
                </div>

                {/* Title overlay at bottom (visible by default) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-purple-primary/70 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                  <p className="text-white text-sm font-serif-body font-medium">
                    {photo.title}
                  </p>
                </div>

                {/* Focus ring for accessibility */}
                <div className="absolute inset-0 border border-transparent group-focus-visible:border-2 group-focus-visible:border-purple-accent rounded-xl pointer-events-none" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Emotional pause section */}
      <MomentOfSilence 
        quote="Setiap foto adalah jendela ke momen yang tak akan pernah terulang, namun akan selamanya hidup di hati"
      />

      {/* Customization guide */}
      <section className="section-breathe">
        <div className="content-intimate text-center px-4">
          <ScrollReveal>
            <P className="mb-4 text-purple-warm">
              Ganti foto-foto ini dengan momen terindah kalian bersama
            </P>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <Whisper className="text-purple-accent/50 block">
              Tambahkan gambar ke folder /public/images
            </Whisper>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
