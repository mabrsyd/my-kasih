'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import {
  ConfirmDialog,
  LoadingSpinner,
  SearchInput,
  DashboardPageHeader,
  DashboardCard,
  DashboardInsetCard,
  DashboardEmptyState,
} from '@/components/dashboard';
import toast from 'react-hot-toast';

interface AboutChapter {
  id: string;
  icon: string;
  title: string;
  content: string;
  order: number;
}

const emptyForm = { icon: '', title: '', content: '', order: 0 };

export default function AboutPage() {
  const [chapters, setChapters] = useState<AboutChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      const res = await fetch('/api/about');
      const data = await res.json();
      setChapters(data);
    } catch {
      toast.error('Gagal memuat bab cerita');
    } finally {
      setLoading(false);
    }
  };

  const filteredChapters = chapters.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.icon || !formData.title || !formData.content) {
      toast.error('Isi semua field terlebih dahulu');
      return;
    }
    setSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/about/${editingId}` : '/api/about';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Gagal menyimpan');
      toast.success(editingId ? 'Bab diperbarui' : 'Bab ditambahkan');
      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);
      fetchChapters();
    } catch {
      toast.error('Gagal menyimpan bab');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (chapter: AboutChapter) => {
    setFormData(chapter);
    setEditingId(chapter.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/about/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus');
      toast.success('Bab dihapus');
      setShowConfirm(false);
      setDeleteId(null);
      fetchChapters();
    } catch {
      toast.error('Gagal menghapus bab');
    }
  };

  const openNew = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Tentang Kita"
        description="Kelola bab-bab cerita yang tampil di halaman About."
        badge={chapters.length}
        action={showForm ? undefined : { label: 'Tambah Bab', onClick: openNew }}
        secondaryAction={
          showForm
            ? { label: 'Batalkan', onClick: () => { setShowForm(false); setEditingId(null); setFormData(emptyForm); } }
            : undefined
        }
      />

      {/* Inline Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          <DashboardCard title={editingId ? 'Edit Bab' : 'Bab Baru'}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Ikon / Emoji <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="?"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Urutan
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Judul <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Judul bab cerita..."
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Isi Cerita <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Tulis cerita bab ini..."
                  rows={5}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-y"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingId(null); setFormData(emptyForm); }}
                  className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? 'Simpan Perubahan' : 'Tambah Bab'}
                </button>
              </div>
            </form>
          </DashboardCard>
        </motion.div>
      )}

      {/* Search */}
      {chapters.length > 0 && (
        <SearchInput onSearch={setSearchQuery} placeholder="Cari bab cerita..." />
      )}

      {/* Chapters List */}
      <DashboardCard>
        {filteredChapters.length === 0 ? (
          <DashboardEmptyState
            icon="??"
            title={searchQuery ? 'Tidak ditemukan' : 'Belum ada bab cerita'}
            description={
              searchQuery
                ? `Tidak ada bab yang cocok dengan "${searchQuery}".`
                : 'Tambahkan bab pertama cerita kalian bersama.'
            }
            actionLabel={searchQuery ? undefined : 'Tambah Bab Pertama'}
            onAction={searchQuery ? undefined : openNew}
          />
        ) : (
          <div className="space-y-3">
            {filteredChapters.map((chapter) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:border-violet-200 hover:bg-slate-50 transition-all group"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: 'rgba(196,176,238,0.15)' }}
                >
                  {chapter.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-semibold text-slate-900 text-sm">{chapter.title}</h3>
                    <span className="text-xs text-slate-400">#{chapter.order}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{chapter.content}</p>
                </div>
                <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(chapter)}
                    className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { setDeleteId(chapter.id); setShowConfirm(true); }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </DashboardCard>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Hapus Bab"
        message="Yakin ingin menghapus bab ini? Tindakan ini tidak bisa dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={handleDelete}
        onCancel={() => { setShowConfirm(false); setDeleteId(null); }}
        isDangerous
      />
    </div>
  );
}
