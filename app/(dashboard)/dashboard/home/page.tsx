'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Trash2 } from 'lucide-react';
import { DashboardPageHeader, DashboardCard, DashboardInsetCard } from '@/components/dashboard';

export default function HomeDashboardPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/settings/hero-messages');
      const data = await res.json();
      setMessages(Array.isArray(data.messages) ? data.messages : []);
    } catch {
      toast.error('Gagal memuat pesan hero');
    } finally {
      setLoading(false);
    }
  };

  const saveMessages = async (updated: string[]) => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings/hero-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menyimpan');
      }

      setMessages(updated);
      toast.success('Pesan hero disimpan!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = () => {
    const trimmed = newMessage.trim();
    if (!trimmed) {
      toast.error('Pesan tidak boleh kosong');
      return;
    }
    if (messages.includes(trimmed)) {
      toast.error('Pesan ini sudah ada');
      return;
    }
    setNewMessage('');
    saveMessages([...messages, trimmed]);
  };

  const handleEdit = (index: number, value: string) => {
    const updated = messages.map((m, i) => (i === index ? value : m));
    setMessages(updated);
  };

  const handleSaveEdit = (index: number) => {
    const trimmed = messages[index]?.trim();
    if (!trimmed) {
      toast.error('Pesan tidak boleh kosong');
      return;
    }
    saveMessages([...messages]);
  };

  const handleDelete = (index: number) => {
    saveMessages(messages.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    if (!confirm('Hapus SEMUA pesan hero?')) return;
    saveMessages([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-7 h-7 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Halaman Depan"
        description="Pesan-pesan hero yang tampil secara acak di halaman utama situs."
        badge={messages.length}
        secondaryAction={
          messages.length > 0
            ? { label: 'Hapus Semua', onClick: handleClearAll, disabled: saving }
            : undefined
        }
      />

      {/* Add new message */}
      <DashboardCard title="Tambah Pesan Baru">
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder='Contoh: "Kamu adalah alasan terbaik aku bangun setiap pagi"'
            className="flex-1 px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            maxLength={200}
          />
          <button
            onClick={handleAdd}
            disabled={saving || !newMessage.trim()}
            className="px-5 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors disabled:opacity-50 shrink-0"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Tambah'}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2">{newMessage.length}/200 karakter</p>
      </DashboardCard>

      {/* Messages list */}
      <DashboardCard title={`Daftar Pesan (${messages.length})`}>
        {messages.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-dashed border-slate-200">
            <p className="text-3xl mb-3">??</p>
            <p className="text-sm font-medium text-slate-600">Belum ada pesan hero.</p>
            <p className="text-xs text-slate-400 mt-1">
              Tambahkan pesan pertamamu di atas.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 group hover:border-violet-200 transition-colors"
              >
                <span className="text-slate-400 text-xs font-mono w-5 text-center shrink-0">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => handleEdit(index, e.target.value)}
                  onBlur={() => handleSaveEdit(index)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(index)}
                  className="flex-1 text-sm text-slate-700 bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-violet-400 rounded px-1 py-0.5"
                  maxLength={200}
                />
                <button
                  onClick={() => handleDelete(index)}
                  disabled={saving}
                  className="shrink-0 opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-50 rounded transition-all disabled:opacity-50"
                  title="Hapus pesan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </DashboardCard>

      {/* Preview */}
      {messages.length > 0 && (
        <DashboardInsetCard>
          <p className="text-xs font-semibold text-violet-700 uppercase tracking-wider mb-3">
            Pratinjau (acak)
          </p>
          <p className="text-violet-800 italic text-base leading-relaxed">
            &ldquo;{messages[Math.floor(Math.random() * messages.length)]}&rdquo;
          </p>
          <p className="text-violet-400 text-xs mt-2">
            ? Ini yang dilihat pengunjung di halaman utama
          </p>
        </DashboardInsetCard>
      )}
    </div>
  );
}
