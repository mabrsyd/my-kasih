'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { NAVIGATION_LINKS, SITE_NAME } from '@/lib/constants';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed w-full top-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="font-serif-display text-2xl font-bold bg-gradient-to-r from-romantic-red to-pastel-red bg-clip-text text-transparent"
            >
              {SITE_NAME}
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8">
            {NAVIGATION_LINKS.map((link, idx) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="font-serif-body text-sm text-gray-700 hover:text-romantic-red transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-romantic-red to-pastel-red group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-soft-pink/20 transition-colors"
          >
            <div className="space-y-1">
              <motion.div
                animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-romantic-red rounded-full"
              />
              <motion.div
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-6 h-0.5 bg-romantic-red rounded-full"
              />
              <motion.div
                animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-romantic-red rounded-full"
              />
            </div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden md:hidden"
        >
          <div className="py-4 space-y-2 border-t border-white/10">
            {NAVIGATION_LINKS.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-soft-pink/30 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
