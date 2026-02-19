'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageLightboxProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  children?: React.ReactNode;
}

export default function ImageLightbox({
  src,
  alt,
  width = 400,
  height = 300,
  children,
}: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger */}
      <motion.div
        className="cursor-pointer relative overflow-hidden rounded-lg"
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsOpen(true)}
      >
        {children || (
          <div className="relative w-full h-full min-h-[300px] bg-slate-200 rounded-lg overflow-hidden">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="w-full h-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full">
                Click to expand
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                className="relative max-w-4xl max-h-[90vh] w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={src}
                  alt={alt}
                  width={1200}
                  height={800}
                  className="w-full h-auto rounded-lg shadow-2xl object-contain"
                  priority
                />

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(false)}
                  className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
