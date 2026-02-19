'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import ImageLightbox from './ImageLightbox';

interface GalleryPhoto {
  id: string;
  title: string;
  description?: string;
  image: {
    publicUrl: string;
    width?: number;
    height?: number;
  };
}

interface MasonryGalleryProps {
  photos: GalleryPhoto[];
  loading?: boolean;
}

export default function MasonryGallery({ photos, loading = false }: MasonryGalleryProps) {
  if (loading) {
    return (
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="bg-slate-200/60 animate-pulse rounded-2xl break-inside-avoid mb-4"
            style={{ height: `${180 + (i % 3) * 80}px` }}
          />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p className="text-lg">No photos yet... 📸</p>
        <p className="text-sm mt-2">Create your first memory</p>
      </div>
    );
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      transition={{ staggerChildren: 0.08, delayChildren: 0.2 }}
      className="columns-1 sm:columns-2 lg:columns-3 gap-5"
    >
      {photos.map((photo) => (
        <motion.div
          key={photo.id}
          variants={itemVariants}
          className="group break-inside-avoid mb-5"
        >
          <ImageLightbox
            src={photo.image.publicUrl}
            alt={photo.title}
            width={photo.image.width || 600}
            height={photo.image.height || 400}
          >
            <div className="relative w-full rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-shadow duration-500 bg-linear-to-br from-purple-50 to-pink-50">
              <Image
                src={photo.image.publicUrl}
                alt={photo.title}
                width={photo.image.width || 600}
                height={photo.image.height || 400}
                className="w-full h-auto block group-hover:scale-105 transition-transform duration-700 ease-out"
                unoptimized={photo.image.publicUrl.startsWith('/')}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Always-visible bottom gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

              {/* Text on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
                <h3 className="text-white font-semibold text-sm leading-snug line-clamp-1 drop-shadow">
                  {photo.title}
                </h3>
                {photo.description && (
                  <p className="text-white/75 text-xs line-clamp-2 mt-0.5">
                    {photo.description}
                  </p>
                )}
              </div>

              {/* Center heart on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <motion.div
                  initial={{ scale: 0.5 }}
                  whileHover={{ scale: 1.15 }}
                  className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30"
                >
                  <span className="text-white text-xl drop-shadow">♥</span>
                </motion.div>
              </div>
            </div>
          </ImageLightbox>
        </motion.div>
      ))}
    </motion.div>
  );
}
