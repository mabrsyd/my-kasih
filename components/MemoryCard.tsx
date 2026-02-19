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
  id,
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      className="group"
    >
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100"
      >
        {/* Image Section */}
        {cover && (
          <div className="relative h-56 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
            <ImageLightbox
              src={cover.publicUrl}
              alt={title}
              width={cover.width || 400}
              height={cover.height || 300}
            >
              <Image
                src={cover.publicUrl}
                alt={title}
                width={cover.width || 400}
                height={cover.height || 300}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                priority
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </ImageLightbox>
          </div>
        )}

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{emoji}</span>
                <span className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  {formattedDate}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 line-clamp-2">
                {title}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
            {description}
          </p>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              {description.split(' ').length} words
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1 transition-colors"
            >
              Read more
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
