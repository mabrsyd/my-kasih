'use client';

/**
 * OnThisDay — Menampilkan kenangan yang terjadi di hari yang sama tahun lalu
 * Efek psychologis: terasa serendipitous, padahal by design
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

export interface Memory {
  id: string;
  date: string;
  title: string;
  description: string;
  emoji: string;
  cover?: { publicUrl: string; width?: number; height?: number } | null;
}

interface Props {
  memories: Memory[];
}

export default function OnThisDay({ memories }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (memories.length === 0) return null;

  const today = new Date();
  const todayMMDD = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const matched = memories.filter(m => {
    const d = new Date(m.date);
    const mmdd = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return mmdd === todayMMDD;
  });

  if (matched.length === 0) return null;

  const memory = matched[0];
  const yearAgo = today.getFullYear() - new Date(memory.date).getFullYear();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="w-full max-w-xl mx-auto"
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(196,176,238,0.18), rgba(155,94,162,0.08))',
          border: '1px solid rgba(196,176,238,0.35)',
        }}
      >
        {/* Header */}
        <button
          onClick={() => setExpanded(v => !v)}
          className="w-full flex items-center justify-between px-6 py-4 text-left group"
        >
          <div>
            <p
              className="text-[0.6rem] tracking-widest uppercase font-serif-body mb-1"
              style={{ color: 'rgba(155,94,162,0.7)' }}
            >
              ✦ Pada Hari Ini
            </p>
            <p
              className="font-serif-display text-sm font-medium"
              style={{ color: '#4a3880' }}
            >
              {yearAgo === 0
                ? 'Tahun ini kita membuat kenangan baru'
                : `${yearAgo} tahun lalu, kita...`}
            </p>
          </div>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ color: 'rgba(196,176,238,0.7)' }}
            className="text-lg shrink-0"
          >
            ↓
          </motion.span>
        </button>

        {/* Expandable content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6">
                {/* Cover image */}
                {memory.cover?.publicUrl && (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden mb-4">
                    <Image
                      src={memory.cover.publicUrl}
                      alt={memory.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 560px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                )}

                {/* Memory detail */}
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">{memory.emoji}</span>
                  <div>
                    <p
                      className="font-serif-display font-semibold mb-1"
                      style={{ color: '#4a3880', fontSize: '1.05rem' }}
                    >
                      {memory.title}
                    </p>
                    <p
                      className="text-sm font-serif-body leading-relaxed"
                      style={{ color: 'rgba(114,80,200,0.75)' }}
                    >
                      {memory.description}
                    </p>
                    <p
                      className="text-[0.65rem] tracking-wide uppercase mt-3 font-serif-body"
                      style={{ color: 'rgba(155,94,162,0.55)' }}
                    >
                      {new Date(memory.date).toLocaleDateString('id-ID', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
