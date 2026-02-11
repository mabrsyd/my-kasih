'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface PublishToggleProps {
  id: string;
  published: boolean;
  endpoint: string;
  onSuccess?: (newStatus: boolean) => void;
}

export function PublishToggle({ id, published, endpoint, onSuccess }: PublishToggleProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [localPublished, setLocalPublished] = useState(published);

  const handleToggle = async () => {
    setIsToggling(true);
    const newStatus = !localPublished;

    try {
      const token = sessionStorage.getItem('dashboard_token');
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'X-Dashboard-Token': token }),
        },
        body: JSON.stringify({ published: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      setLocalPublished(newStatus);
      toast.success(newStatus ? '🟢 Published!' : '⚪ Unpublished');
      onSuccess?.(newStatus);
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Status Badge */}
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
          localPublished
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-gray-100 text-gray-600 border border-gray-200'
        }`}
      >
        {localPublished ? '🟢 Published' : '⚪ Draft'}
      </span>

      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        disabled={isToggling}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-accent focus:ring-offset-2 ${
          localPublished ? 'bg-green-500' : 'bg-gray-300'
        } ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <motion.span
          layout
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition ${
            localPublished ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

interface StatusBadgeProps {
  published: boolean;
}

export function StatusBadge({ published }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        published
          ? 'bg-green-100 text-green-700 border border-green-200'
          : 'bg-gray-100 text-gray-600 border border-gray-200'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${published ? 'bg-green-500' : 'bg-gray-400'}`} />
      {published ? 'Published' : 'Draft'}
    </span>
  );
}
