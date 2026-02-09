'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="w-full section-breathe border-t border-purple-secondary/20"
    >
      <div className="max-w-2xl mx-auto px-6">
        {/* Decorative line */}
        <motion.div 
          className="w-16 h-px bg-purple-accent/20 mx-auto mb-12"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />

        {/* Main content */}
        <div className="text-center mb-12">
          <motion.h3 
            className="font-serif-display text-lg text-purple-primary mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {SITE_NAME}
          </motion.h3>
          
          <motion.p 
            className="text-whisper text-purple-warm/70 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Dibangun dengan cinta, dirancang untuk emosi
          </motion.p>

          {/* Navigation links */}
          <motion.div 
            className="flex justify-center gap-6 md:gap-8 flex-wrap mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            {[
              { label: 'Beranda', href: '/' },
              { label: 'Kenangan', href: '/memories' },
              { label: 'Galeri', href: '/gallery' },
              { label: 'Surat', href: '/letter' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-purple-primary/60 hover:text-purple-accent text-xs tracking-widest uppercase transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>

          {/* Heart */}
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-3xl text-purple-accent/50 mb-8"
          >
            ♥
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-xs text-purple-primary/35 tracking-wide">
            © {currentYear} — Semua momen disimpan selamanya
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
