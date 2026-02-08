'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface AnimatedTextProps {
  text: string;
  delay?: number;
  className?: string;
  duration?: number;
}

export default function AnimatedText({
  text,
  delay = 0,
  className = '',
  duration = 0.05,
}: AnimatedTextProps) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, duration * 1000);

    return () => clearInterval(interval);
  }, [text, duration]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className={className}
    >
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="ml-1 inline-block"
      >
        |
      </motion.span>
    </motion.span>
  );
}
