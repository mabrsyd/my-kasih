'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Try to auto-play on mount
    const audio = audioRef.current;
    if (audio) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Auto-play failed, user needs to click
            setIsPlaying(false);
          });
      }
    }
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="fixed bottom-6 right-6 z-40 bg-white/80 backdrop-blur-md rounded-full shadow-lg p-4 border border-white/50"
    >
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src="/music/romantic-instrumental.mp3"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        loop
      />

      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePlayPause}
          className="text-xl hover:text-romantic-red transition-colors"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </motion.button>

        {/* Time Info */}
        <div className="text-xs text-gray-600 min-w-12 text-center">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        {/* Progress Bar */}
        <div className="hidden sm:block w-24 h-1 bg-gray-200 rounded-full cursor-pointer group overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-romantic-red to-pastel-red rounded-full"
            style={{
              width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
            }}
          />
        </div>

        {/* Volume/Info */}
        <div className="text-sm font-serif-body text-gray-600 hidden md:block">
          🎵
        </div>
      </div>

      {/* Animated music note indicator */}
      {isPlaying && (
        <motion.div
          className="absolute -top-8 -right-2 text-lg"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ♪
        </motion.div>
      )}
    </motion.div>
  );
}
