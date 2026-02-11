import { Variants } from 'framer-motion';

// ============================================
// ANIMATION VARIANTS
// Philosophy: subtle, gentle, intimate
// All easing: "easeInOut" for human-like feel
// ============================================

/** Stagger container for list/grid reveals */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
      ease: 'easeInOut',
    },
  },
};

/** Individual item reveal (used in grids, lists) */
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeInOut' },
  },
};

/** Gentle breathing pulse for subtle emphasis */
export const breatheVariants: Variants = {
  animate: {
    scale: [1, 1.015, 1],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/** Cinematic fade-in with slight scale */
export const cinematicFadeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
};

/** Subtle whisper text appearance */
export const whisperVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 0.7,
    transition: { duration: 1.2, ease: 'easeInOut', delay: 0.3 },
  },
};

/** Memory card entrance animation */
export const memoryCardVariants: Variants = {
  hidden: { y: 0, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

/** Letter content paragraph-by-paragraph reveal */
export const letterContentVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: delay * 0.1,
      duration: 0.7,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

/** Purple accent glow for decorative elements */
export const purpleGlowVariants: Variants = {
  animate: {
    boxShadow: [
      '0 0 0 rgba(107, 63, 160, 0)',
      '0 0 15px rgba(107, 63, 160, 0.3)',
      '0 0 0 rgba(107, 63, 160, 0)',
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};
