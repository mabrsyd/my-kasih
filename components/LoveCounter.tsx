'use client';

/**
 * LoveCounter — Simplified: total days together + live seconds elapsed today
 * Less data = more emotional. One number felt, not eight numbers calculated.
 */

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { LOVE_START_DATE, PARTNER_BIRTHDAY } from '@/lib/constants';

function getDaysUntilBirthday(birthdayMMDD: string): number {
  const [mm, dd] = birthdayMMDD.split('-').map(Number);
  const now  = new Date();
  const next = new Date(now.getFullYear(), (mm ?? 1) - 1, dd ?? 1);
  if (next < now) next.setFullYear(now.getFullYear() + 1);
  return Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function LoveCounter() {
  const startDate = new Date(LOVE_START_DATE);
  const [totalDays, setTotalDays] = useState(0);
  const [secondsToday, setSecondsToday] = useState(0);
  const [daysUntilBirthday, setDaysUntilBirthday] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDaysUntilBirthday(getDaysUntilBirthday(PARTNER_BIRTHDAY));

    const tick = () => {
      const now = new Date();
      setTotalDays(Math.floor((now.getTime() - startDate.getTime()) / 86400000));
      // seconds elapsed since midnight
      setSecondsToday(
        now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
      );
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.4 }}
      className="w-full max-w-lg mx-auto text-center"
    >
      {/* Primary stat — total days */}
      <div
        className="relative py-10 px-8 rounded-3xl mb-4"
        style={{
          background: 'linear-gradient(135deg, rgba(196,176,238,0.12), rgba(114,80,200,0.06))',
          border: '1px solid rgba(196,176,238,0.28)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <p
          className="text-[0.6rem] tracking-widest uppercase mb-3 font-serif-body"
          style={{ color: 'rgba(155,94,162,0.6)' }}
        >
          Kita telah bersama selama
        </p>

        <motion.p
          key={totalDays}
          initial={{ scale: 1.04, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="font-serif-display tabular-nums leading-none mb-2"
          style={{ fontSize: 'clamp(4rem, 15vw, 7rem)', color: '#4a3880', fontWeight: 600 }}
        >
          {totalDays.toLocaleString('id-ID')}
        </motion.p>

        <p
          className="font-serif-elegant italic text-xl"
          style={{ color: 'rgba(114,80,200,0.6)' }}
        >
          hari kebahagiaan
        </p>

        {/* Live seconds pulse — a heartbeat beneath the days */}
        <motion.div
          className="mt-6 flex items-center justify-center gap-2"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ background: 'rgba(155,94,162,0.5)' }}
          />
          <motion.span
            key={secondsToday}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="font-serif-body tabular-nums text-sm"
            style={{ color: 'rgba(155,94,162,0.55)' }}
          >
            {secondsToday.toLocaleString('id-ID')} detik hari ini
          </motion.span>
        </motion.div>
      </div>

      {/* Birthday countdown — shown only when relevant */}
      {daysUntilBirthday > 0 && daysUntilBirthday <= 60 && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-sm font-serif-body"
          style={{ color: 'rgba(155,94,162,0.6)' }}
        >
          🎂 {daysUntilBirthday} hari lagi ulang tahunmu
        </motion.p>
      )}
    </motion.div>
  );
}
