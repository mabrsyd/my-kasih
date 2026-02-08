import { Variants } from 'framer-motion';

// ============================================
// CORE ANIMATION PHILOSOPHY:
// - All easing: "easeInOut" for human-like feel
// - Subtle delays (0.1-0.3s) for breathing room
// - No bounce, no overshoot, gentle & intimate
// ============================================

export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeInOut', delay: 0.1 },
  },
};

export const fadeInDownVariants: Variants = {
  hidden: { opacity: 0, y: -15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeInOut', delay: 0.1 },
  },
};

export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: 'easeInOut', delay: 0.15 },
  },
};

export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: 'easeInOut', delay: 0.15 },
  },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeInOut' },
  },
};

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

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeInOut' },
  },
};

export const floatVariants: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const heartBeatVariants: Variants = {
  animate: {
    scale: [1, 1.08, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const pulseVariants: Variants = {
  animate: {
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.15,
      ease: 'easeInOut',
    },
  },
};

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.7,
      ease: [0.23, 1, 0.320, 1],
    },
  }),
};

export const typewriterVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.1 },
  },
};

export const hoverScaleVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.03,
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
};

export const tapScaleVariants = {
  initial: { scale: 1 },
  tap: { scale: 0.98 },
};

// ============================================
// PREMIUM EMOTIONAL ANIMATIONS
// ============================================

// Gentle breathing animation - for subtle life
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

// Paragraph-by-paragraph reveal for love letter
export const paragraphRevealVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.9,
      ease: 'easeInOut',
    },
  }),
};

// Soft glow hover effect
export const glowHoverVariants = {
  rest: { 
    boxShadow: '0 0 0 rgba(212, 117, 127, 0)',
    scale: 1,
  },
  hover: { 
    boxShadow: '0 0 25px rgba(212, 117, 127, 0.25)',
    scale: 1.02,
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
};

// Very slow float for background elements
export const slowFloatVariants: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Cinematic fade for modals/overlays
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

// Whisper text - very subtle fade
export const whisperVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 0.7,
    transition: { duration: 1.2, ease: 'easeInOut', delay: 0.3 },
  },
};

// Moment of silence - slow dramatic reveal
export const momentRevealVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.5, ease: 'easeInOut' },
  },
};

// Timeline memory card hover
export const memoryCardVariants: Variants = {
  initial: { 
    y: 0,
    opacity: 0,
  },
  animate: { 
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

// Gallery image hover
export const galleryImageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};

