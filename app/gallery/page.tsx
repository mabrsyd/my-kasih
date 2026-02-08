'use client';

import { motion } from 'framer-motion';
import { GALLERY_PHOTOS } from '@/lib/constants';
import { containerVariants, itemVariants, fadeInUpVariants } from '@/lib/animations';

export default function Gallery() {
  return (
    <div className="min-h-screen bg-gradient-warm pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Header */}
          <motion.div variants={fadeInUpVariants} className="text-center mb-16">
            <h1 className="heading-romantic mb-4">Galeri Kenangan 🖼️</h1>
            <p className="text-gray-600 text-lg font-serif-body">
              A visual journey through our beautiful moments together
            </p>
          </motion.div>

          {/* Gallery Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {GALLERY_PHOTOS.map((photo, idx) => (
              <motion.div
                key={photo.id}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl shadow-lg aspect-square cursor-pointer"
              >
                {/* Background placeholder with gradient */}
                <div className={`w-full h-full ${photo.placeholder} relative`}>
                  {/* Overlay on hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      className="text-center"
                    >
                      <p className="text-white font-serif-display text-xl font-semibold mb-2">
                        {photo.title}
                      </p>
                      <p className="text-white/80 text-sm font-serif-body">
                        Click to view
                      </p>
                    </motion.div>
                  </motion.div>

                  {/* Decorative element */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute -top-4 -right-4 text-6xl opacity-20"
                  >
                    ✨
                  </motion.div>
                </div>

                {/* Title at bottom on small screens */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 group-hover:hidden">
                  <p className="text-white font-serif-body text-sm font-semibold">
                    {photo.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Note about customization */}
          <motion.div
            variants={fadeInUpVariants}
            className="text-center mt-16 pt-12 border-t border-white/30"
          >
            <p className="text-gray-600 font-serif-body text-sm italic mb-4">
              ✨ These are placeholder images. Replace them with your favorite photos! ✨
            </p>
            <p className="text-gray-500 text-sm">
              Add your images to <code className="bg-white/40 px-2 py-1 rounded">/public/images</code> and update the gallery component
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
