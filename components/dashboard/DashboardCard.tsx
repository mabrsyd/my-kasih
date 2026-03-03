'use client';

import React from 'react';

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  noPadding?: boolean;
}

export function DashboardCard({
  children,
  className = '',
  title,
  description,
  noPadding = false,
}: DashboardCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-sm ${
        noPadding ? '' : 'p-6'
      } ${className}`}
    >
      {(title || description) && (
        <div className={`${noPadding ? 'px-6 pt-6' : ''} mb-5`}>
          {title && (
            <h2 className="text-base font-semibold text-slate-800">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

/** Muted background inset card — for form sections, sub-panels */
export function DashboardInsetCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-slate-50 rounded-xl border border-slate-200 p-5 ${className}`}
    >
      {children}
    </div>
  );
}
