'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cinematicFadeVariants } from '@/lib/animations';
import { H2, P } from '@/components/ui/Typography';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = '✦',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={cinematicFadeVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-6"
    >
      {/* Romantic illustration */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="text-8xl opacity-20"
      >
        {icon}
      </motion.div>

      <div className="space-y-3 max-w-md">
        <H2 className="text-purple-primary">{title}</H2>
        <P className="text-purple-warm/80">{description}</P>
      </div>

      {/* CTA */}
      {(actionLabel && (actionHref || onAction)) && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8"
        >
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-accent hover:bg-purple-primary text-white rounded-lg font-medium transition-colors shadow-lg"
            >
              {actionLabel}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-accent hover:bg-purple-primary text-white rounded-lg font-medium transition-colors shadow-lg"
            >
              {actionLabel}
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export function DashboardEmptyState({
  icon = '📦',
  title,
  description,
  actionLabel = '➕ Create First Item',
  onAction,
}: Omit<EmptyStateProps, 'actionHref'>) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-6xl mb-4 opacity-30">{icon}</div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 mb-6 max-w-md">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
