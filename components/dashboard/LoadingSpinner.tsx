'use client';

import React from 'react';

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div
        className={`${sizeClasses[size]} border-rose-500 border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
}

export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-slate-700 font-medium">{message}</p>
      </div>
    </div>
  );
}
