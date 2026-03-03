/**
 * Dashboard Overview
 */
'use client';

import Link from 'next/link';
import { Brain, Image, Mail, MailOpen, Settings, Loader2, BookOpen, LayoutDashboard } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useDashboardStats } from '@/lib/hooks/queries';
import { DashboardCard } from '@/components/dashboard';

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: stats, isLoading, isError } = useDashboardStats();

  const username = session?.user?.name || 'Admin';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-7 h-7 text-violet-500 animate-spin" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-500 gap-3">
        <span className="text-4xl">😔</span>
        <p className="text-sm">Gagal memuat statistik. Coba refresh halaman.</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Kenangan',
      count: stats.totalMemories,
      Icon: Brain,
      href: '/dashboard/memories',
      description: 'momen tersimpan',
    },
    {
      title: 'Galeri',
      count: stats.totalGallery,
      Icon: Image,
      href: '/dashboard/gallery',
      description: 'foto tersimpan',
    },
    {
      title: 'Surat',
      count: stats.totalLetters,
      Icon: Mail,
      href: '/dashboard/letters',
      description: 'total surat',
    },
    {
      title: 'Diterbitkan',
      count: stats.publishedLetters,
      Icon: MailOpen,
      href: '/dashboard/letters',
      description: 'surat publik',
    },
  ];

  const quickActions = [
    { label: 'Kenangan Baru', href: '/dashboard/memories', Icon: Brain },
    { label: 'Foto Galeri Baru', href: '/dashboard/gallery', Icon: Image },
    { label: 'Surat Baru', href: '/dashboard/letters', Icon: Mail },
    { label: 'Halaman Depan', href: '/dashboard/home', Icon: LayoutDashboard },
    { label: 'Tentang Kita', href: '/dashboard/about', Icon: BookOpen },
    { label: 'Pengaturan', href: '/dashboard/settings', Icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <DashboardCard>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Halo, {username} 💜
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Kelola kenangan indah dengan mudah dari sini.
            </p>
          </div>
          <Link
            href="/"
            target="_blank"
            className="text-xs text-violet-600 hover:text-violet-700 underline underline-offset-2"
          >
            Lihat situs →
          </Link>
        </div>
      </DashboardCard>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ title, count, Icon, href, description }) => (
          <Link
            key={title}
            href={href}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-violet-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-violet-50 text-violet-600 group-hover:bg-violet-100 transition-colors">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-3xl font-bold text-slate-900">{count}</span>
            </div>
            <p className="text-sm font-medium text-slate-700">{title}</p>
            <p className="text-xs text-slate-400 mt-0.5">{description}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <DashboardCard title="Akses Cepat" description="Navigasi langsung ke halaman yang kamu butuhkan">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quickActions.map(({ label, href, Icon }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-200 hover:border-violet-200 hover:bg-violet-50 text-slate-700 hover:text-violet-700 transition-all text-sm font-medium"
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
