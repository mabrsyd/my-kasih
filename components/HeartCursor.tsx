'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CursorPosition {
  x: number;
  y: number;
}

export default function HeartCursor() {
  const [mousePosition, setMousePosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Hide default cursor */}
      <style>{`
        body {
          cursor: none;
        }
      `}</style>

      {/* Custom heart cursor */}
      <motion.div
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        className="fixed pointer-events-none z-50 text-2xl"
      >
        ❤️
      </motion.div>

      {/* Trail of smaller hearts */}
      {isVisible && (
        <motion.div
          animate={{
            x: mousePosition.x - 8,
            y: mousePosition.y - 8,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed pointer-events-none z-40 text-sm opacity-30"
        >
          💕
        </motion.div>
      )}
    </>
  );
}
