'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface RomanticLoaderProps {
  message?: string;
}

export function RomanticLoader({ message = 'Memuat kenangan indah...' }: RomanticLoaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 space-y-6"
    >
      {/* Animated heart */}
      <motion.span
        className="text-6xl text-purple-accent/40"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        ♥
      </motion.span>

      {/* Romantic loading text */}
      <motion.p
        className="text-sm uppercase tracking-widest text-purple-warm/70"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {message}
      </motion.p>

      {/* Visual progress bar */}
      <div className="w-32 h-1 bg-purple-secondary/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-accent to-purple-secondary"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-6 md:p-8 shadow-romantic animate-pulse">
      {/* Title skeleton */}
      <div className="h-6 bg-purple-secondary/20 rounded w-3/4 mb-4" />
      
      {/* Content lines */}
      <div className="space-y-3">
        <div className="h-4 bg-purple-secondary/10 rounded w-full" />
        <div className="h-4 bg-purple-secondary/10 rounded w-5/6" />
        <div className="h-4 bg-purple-secondary/10 rounded w-4/6" />
      </div>
    </div>
  );
}

export function SkeletonGallery() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="animate-pulse"
        >
          {/* Image skeleton */}
          <div className="relative aspect-[4/3] bg-purple-secondary/20 rounded-xl mb-4" />
          
          {/* Title skeleton */}
          <div className="h-5 bg-purple-secondary/20 rounded w-3/4 mb-2" />
          
          {/* Description skeleton */}
          <div className="h-4 bg-purple-secondary/10 rounded w-full" />
        </motion.div>
      ))}
    </div>
  );
}

export function SkeletonTimeline() {
  return (
    <div className="relative space-y-16">
      {/* Timeline line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-romantic-red/20 to-transparent" />

      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.2 }}
          className={`flex gap-6 md:gap-12 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''} animate-pulse`}
        >
          <div className="flex-1">
            <div className="glass rounded-2xl p-6 md:p-8">
              {/* Date skeleton */}
              <div className="h-3 bg-purple-secondary/20 rounded w-32 mb-4" />
              
              {/* Title skeleton */}
              <div className="h-6 bg-purple-secondary/20 rounded w-2/3 mb-4" />
              
              {/* Content skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-purple-secondary/10 rounded w-full" />
                <div className="h-4 bg-purple-secondary/10 rounded w-5/6" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function ImageLoadingPlaceholder() {
  return (
    <div className="absolute inset-0 bg-purple-secondary/10 animate-pulse flex items-center justify-center">
      <motion.span
        className="text-4xl text-purple-accent/30"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        ◇
      </motion.span>
    </div>
  );
}
