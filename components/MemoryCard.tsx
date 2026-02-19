'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ImageLightbox from './ImageLightbox';


interface MemoryCardProps {
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
  index?: number;
}

export default function MemoryCard({
  date,
  title,
  description,
  emoji,
  cover,
  index = 0,
}: MemoryCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-8%' }}
      whileHover={{ y: -6 }}
      className="group relative rounded-2xl overflow-hidden shadow-romantic hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm border border-purple-secondary/20"
    >
      {/* Image */}
      {cover ? (
        <ImageLightbox
          src={cover.publicUrl}
          alt={title}
          width={cover.width || 600}
          height={cover.height || 400}
        >
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <Image
              src={cover.publicUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              unoptimized={cover.publicUrl.startsWith('/')}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute top-3 left-3">
              <span className="text-xs font-medium text-white/90 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                {formattedDate}
              </span>
            </div>
            <div className="absolute top-3 right-3 text-2xl drop-shadow-lg">
              {emoji}
            </div>
          </div>
        </ImageLightbox>
      ) : (
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
          <div className="absolute inset-0 bg-linear-to-br from-purple-100 via-pink-50 to-purple-50 flex items-center justify-center">
            <span className="text-6xl opacity-40">{emoji}</span>
          </div>
          <div className="absolute top-3 left-3">
            <span className="text-xs font-medium text-purple-700 bg-purple-50/80 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-200">
              {formattedDate}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {!cover && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{emoji}</span>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
              {formattedDate}
            </span>
          </div>
        )}

        <h3 className="text-base font-semibold text-slate-800 leading-snug mb-2 line-clamp-2 font-serif-body">
          {title}
        </h3>

        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
          {description}
        </p>

        <div className="mt-4 h-px w-full bg-linear-to-r from-purple-200 via-pink-200 to-transparent" />
        <div className="mt-3 flex items-center">
          <span className="text-xs text-purple-400/70 tracking-wider uppercase font-medium">kenangan indah</span>
          <span className="ml-auto text-purple-300 text-lg">✦</span>
        </div>
      </div>
    </motion.div>
  );
}
