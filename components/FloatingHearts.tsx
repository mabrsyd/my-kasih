'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Heart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface FloatingHeartsProps {
  count?: number;
  className?: string;
}

export default function FloatingHearts({ count = 8, className = '' }: FloatingHeartsProps) {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const generateHearts = () => {
      const newHearts: Heart[] = [];
      for (let i = 0; i < count; i++) {
        newHearts.push({
          id: i,
          x: Math.random() * 100,
          size: Math.random() * 12 + 8, // 8-20px
          duration: Math.random() * 8 + 12, // 12-20s
          delay: Math.random() * 5,
          opacity: Math.random() * 0.3 + 0.1, // 0.1-0.4
        });
      }
      setHearts(newHearts);
    };

    generateHearts();
  }, [count]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-romantic-red"
          style={{
            left: `${heart.x}%`,
            bottom: '-20px',
            fontSize: `${heart.size}px`,
            opacity: heart.opacity,
          }}
          animate={{
            y: [0, -window.innerHeight - 50],
            x: [0, Math.sin(heart.id) * 30, 0],
            rotate: [0, heart.id % 2 === 0 ? 15 : -15, 0],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );
}
