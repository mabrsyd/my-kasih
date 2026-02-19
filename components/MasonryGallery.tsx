'use client';

import React from 'react';
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
  // Create masonry columns
  const getColumns = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const [columns] = React.useState(getColumns());

  // Distribute photos into columns
  const columnPhotos: GalleryPhoto[][] = Array(columns)
    .fill(null)
    .map(() => []);

  photos.forEach((photo, index) => {
    columnPhotos[index % columns].push(photo);
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-slate-200 animate-pulse rounded-lg h-64" />
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

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
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {photos.map((photo) => (
        <motion.div key={photo.id} variants={itemVariants} className="group">
          <ImageLightbox
            src={photo.image.publicUrl}
            alt={photo.title}
            width={photo.image.width || 400}
            height={photo.image.height || 400}
          >
            <div className="relative w-full h-64 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden cursor-pointer">
              {/* Image */}
              <Image
                src={photo.image.publicUrl}
                alt={photo.title}
                width={photo.image.width || 400}
                height={photo.image.height || 400}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Text Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white font-bold text-lg line-clamp-1">
                  {photo.title}
                </h3>
                {photo.description && (
                  <p className="text-gray-200 text-sm line-clamp-2 mt-1">
                    {photo.description}
                  </p>
                )}
              </div>

              {/* Hover Icon */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </ImageLightbox>
        </motion.div>
      ))}
    </motion.div>
  );
}
