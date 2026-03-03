'use client';

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { DashboardPageHeader, DashboardCard } from '@/components/dashboard';
import toast from 'react-hot-toast';

interface Setting {
  key: string;
  value: string;
  description?: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch {
      toast.error('Gagal memuat pengaturan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-7 h-7 text-violet-500 animate-spin" />
      </div>
    );
  }

  const displaySettings = settings.filter((s) => s.key !== 'HERO_MESSAGES');

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Pengaturan Situs"
        description="Konfigurasi dan parameter teknis dari database."
      />

      <DashboardCard
        title="Konfigurasi"
        description="Nilai-nilai pengaturan yang tersimpan di database."
      >
        {displaySettings.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <p className="text-sm">Tidak ada pengaturan tersimpan.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displaySettings.map((setting) => (
              <div
                key={setting.key}
                className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-violet-100 text-violet-700">
                      {setting.key}
                    </span>
                  </div>
                  {setting.description && (
                    <p className="text-xs text-slate-500 mb-1.5">{setting.description}</p>
                  )}
                  <p className="text-sm text-slate-700 font-mono break-all">{setting.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardCard>

      <DashboardCard
        title="Pesan Hero"
        description="Dikelola di halaman Halaman Depan."
      >
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Pesan yang tampil di halaman utama diatur dari menu{' '}
            <strong className="text-slate-700">Halaman Depan</strong>.
          </p>
          <a
            href="/dashboard/home"
            className="shrink-0 px-4 py-2 text-sm font-medium text-violet-700 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors"
          >
            Ke Halaman Depan →
          </a>
        </div>
      </DashboardCard>
    </div>
  );
}
