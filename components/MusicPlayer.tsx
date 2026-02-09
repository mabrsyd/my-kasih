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
      className="fixed bottom-6 right-6 z-40"
    >
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src="/music/pamungkas-monolog.mp3"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        loop
      />

      {/* Cassette Tape Design */}
      <div className="w-40 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-lg p-4 shadow-2xl border-2 border-gray-700 hover:border-purple-500 transition-colors">
        {/* Cassette Label */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded px-2 py-1 mb-3 text-center">
          <p className="text-white text-xs font-bold tracking-wider">♫ LOVE ♫</p>
        </div>

        {/* Spinning Reels */}
        <div className="flex justify-between items-center mb-4 gap-3">
          {/* Left Reel */}
          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 rounded-full border-4 border-gray-600 flex items-center justify-center bg-gray-700/50"
          >
            <div className="w-6 h-6 rounded-full border-2 border-gray-500 flex items-center justify-center">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            </div>
          </motion.div>

          {/* Right Reel */}
          <motion.div
            animate={isPlaying ? { rotate: -360 } : { rotate: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 rounded-full border-4 border-gray-500 flex items-center justify-center bg-gray-700/50"
          >
            <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            </div>
          </motion.div>
        </div>

        {/* Tape Display */}
        <div className="bg-black rounded px-2 py-2 mb-3 border border-gray-700">
          <div className="flex justify-between items-center gap-2">
            <span className="text-xs text-purple-400 font-mono font-bold">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{
                  width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="text-xs text-purple-400 font-mono font-bold">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Play/Pause Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePlayPause}
          className="w-full py-2 px-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold rounded transition-all shadow-lg flex items-center justify-center gap-2"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          <span className="text-lg">
            {isPlaying ? '⏸' : '▶'}
          </span>
          <span className="text-sm">
            {isPlaying ? 'Playing' : 'Play'}
          </span>
        </motion.button>

        {/* Cassette Details */}
        <div className="mt-3 text-center text-xs text-gray-400 font-mono">
          <p>Rosyid & Ennou</p>
          <p className="text-purple-400">♥ Forever ♥</p>
        </div>
      </div>
    </motion.div>
  );
}
