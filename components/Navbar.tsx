'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { NAVIGATION_LINKS, SITE_NAME } from '@/lib/constants';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-romantic border-b border-white/30' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="font-serif-display text-xl font-semibold text-dark-rose"
            >
              {SITE_NAME}
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-10">
            {NAVIGATION_LINKS.map((link, idx) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
              >
                <Link
                  href={link.href}
                  className="font-serif-body text-sm text-dark-rose/70 hover:text-romantic-red transition-colors duration-300 relative group tracking-wide"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-romantic-red group-hover:w-full transition-all duration-400 ease-out" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-full hover:bg-soft-pink/30 transition-colors"
          >
            <div className="space-y-1.5">
              <motion.div
                animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-5 h-0.5 bg-romantic-red rounded-full"
              />
              <motion.div
                animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className="w-5 h-0.5 bg-romantic-red rounded-full"
              />
              <motion.div
                animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-5 h-0.5 bg-romantic-red rounded-full"
              />
            </div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden md:hidden"
        >
          <div className="py-6 space-y-1">
            {NAVIGATION_LINKS.map((link, idx) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, x: -20 }}
                animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
              >
                <Link
                  href={link.href}
                  className="block px-4 py-3 rounded-xl text-dark-rose/80 hover:bg-soft-pink/30 hover:text-romantic-red transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
