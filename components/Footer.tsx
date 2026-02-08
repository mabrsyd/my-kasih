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
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="w-full bg-white/40 backdrop-blur-sm border-t border-white/20 mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="font-serif-display text-xl font-bold bg-gradient-to-r from-romantic-red to-pastel-red bg-clip-text text-transparent mb-2">
              {SITE_NAME}
            </h3>
            <p className="text-gray-600 text-sm">
              A romantic journey of love and memories
            </p>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-serif-body font-semibold text-gray-700 mb-3">
              Navigate
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'Memories', href: '/memories' },
                { label: 'Gallery', href: '/gallery' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-romantic-red text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social & Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-serif-body font-semibold text-gray-700 mb-3">
              Connect
            </h4>
            <p className="text-gray-600 text-sm mb-2">
              Built with love, designed for emotions.
            </p>
            <p className="text-gray-600 text-sm">
              ❤️ Made with Framer Motion & Next.js
            </p>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm text-center md:text-left">
              © {currentYear} {SITE_NAME}. All moments cherished forever.
            </p>
            <div className="flex gap-4">
              <motion.a
                whileHover={{ scale: 1.2 }}
                href="#"
                className="text-gray-500 hover:text-romantic-red transition-colors"
                title="Heart"
              >
                ❤️
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2 }}
                href="#"
                className="text-gray-500 hover:text-romantic-red transition-colors"
                title="Love"
              >
                💌
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2 }}
                href="#"
                className="text-gray-500 hover:text-romantic-red transition-colors"
                title="Music"
              >
                🎵
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
