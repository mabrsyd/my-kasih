'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  totalMemories: number;
  totalGallery: number;
  totalLetters: number;
  publishedLetters: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalMemories: 0,
    totalGallery: 0,
    totalLetters: 0,
    publishedLetters: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('dashboard_token') ?? '' : '';
      const authHeaders: Record<string, string> = token ? { 'X-Dashboard-Token': token } : {};

      const [memoriesRes, galleryRes, lettersRes] = await Promise.all([
        fetch('/api/memories?published=false', { headers: authHeaders }),
        fetch('/api/gallery', { headers: authHeaders }),
        fetch('/api/letters?published=false', { headers: authHeaders }),
      ]);

      // Check if responses are OK
      const memories = memoriesRes.ok ? await memoriesRes.json() : [];
      const gallery = galleryRes.ok ? await galleryRes.json() : [];
      const letters = lettersRes.ok ? await lettersRes.json() : [];

      setStats({
        totalMemories: Array.isArray(memories) ? memories.length : 0,
        totalGallery: Array.isArray(gallery) ? gallery.length : 0,
        totalLetters: Array.isArray(letters) ? letters.length : 0,
        publishedLetters: Array.isArray(letters)
          ? letters.filter((l: any) => l.published).length
          : 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Set default values on error
      setStats({
        totalMemories: 0,
        totalGallery: 0,
        totalLetters: 0,
        publishedLetters: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Loading statistics...</div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Memories',
      count: stats.totalMemories,
      icon: '💭',
      href: '/dashboard/memories',
      color: 'rose',
    },
    {
      title: 'Gallery',
      count: stats.totalGallery,
      icon: '🖼️',
      href: '/dashboard/gallery',
      color: 'pink',
    },
    {
      title: 'Letters',
      count: stats.totalLetters,
      icon: '💌',
      href: '/dashboard/letters',
      color: 'red',
    },
    {
      title: 'Published Letters',
      count: stats.publishedLetters,
      icon: '📬',
      href: '/dashboard/letters',
      color: 'amber',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
        <p className="text-slate-600">
          Manage your romantic content with ease
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-2">
                  {card.title}
                </p>
                <p className="text-4xl font-bold text-slate-900">
                  {card.count}
                </p>
              </div>
              <div className="text-4xl opacity-75 group-hover:opacity-100 transition-opacity">
                {card.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard/memories?new=true"
            className="px-4 py-3 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors text-center"
          >
            ➕ New Memory
          </Link>
          <Link
            href="/dashboard/gallery?new=true"
            className="px-4 py-3 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors text-center"
          >
            ➕ New Gallery Item
          </Link>
          <Link
            href="/dashboard/letters?new=true"
            className="px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors text-center"
          >
            ➕ New Letter
          </Link>
          <Link
            href="/dashboard/settings"
            className="px-4 py-3 bg-slate-500 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors text-center"
          >
            ⚙️ Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
