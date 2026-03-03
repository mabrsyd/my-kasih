'use client';

import React, { useEffect, useState } from 'react';
import { useFetch } from '@/hooks';
import {
  ConfirmDialog,
  MediaUploader,
  SearchInput,
  Pagination,
  LoadingSpinner,
  DashboardPageHeader,
} from '@/components/dashboard';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface Memory {
  id: string;
  date: string;
  title: string;
  description: string;
  emoji: string;
  coverId?: string;
  cover?: {
    publicUrl: string;
  };
  publishedAt?: string;
}

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [filteredMemories, setFilteredMemories] = useState<Memory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverId, setCoverId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showBatchConfirm, setShowBatchConfirm] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  // Keep original publishedAt so editing a published memory doesn't reset the date
  const [originalPublishedAt, setOriginalPublishedAt] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    description: '',
    emoji: '💕',
  });

  const { fetch: fetchMemories } = useFetch<Memory[]>('/api/memories?published=false');

  useEffect(() => {
    loadMemories();
  }, []);

  useEffect(() => {
    // Filter memories based on search query
    if (searchQuery) {
      const filtered = memories.filter(
        (memory) =>
          memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          memory.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMemories(filtered);
      setCurrentPage(1);
    } else {
      setFilteredMemories(memories);
    }
  }, [searchQuery, memories]);

  const loadMemories = async () => {
    try {
      const data = await fetchMemories();
      setMemories(data || []);
    } catch (error) {
      console.error('Failed to load memories:', error);
      toast.error('Gagal memuat kenangan');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side guard — cover image is required
    if (!coverId) {
      toast.error('Pilih dan unggah foto sampul terlebih dahulu');
      return;
    }

    setLoading(true);

    try {
      const url = editingId
        ? `/api/memories/${editingId}`
        : '/api/memories';

      const response = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date).toISOString(),
          coverId: coverId || undefined,
          // Send publishedAt: ISO string to publish, null to unpublish
          // Preserve existing publishedAt when editing an already-published memory
          publishedAt: isPublished
            ? (originalPublishedAt ?? new Date().toISOString())
            : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Surface specific Zod validation field errors if present
        if (errorData.details?.length) {
          const messages = errorData.details.map((d: { path: string; message: string }) =>
            d.path ? `${d.path}: ${d.message}` : d.message
          ).join(', ');
          throw new Error(messages);
        }
        throw new Error(errorData.error || 'Failed to save memory');
      }

      await loadMemories();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        title: '',
        description: '',
        emoji: '💕',
      });
      setCoverImage(null);
      setCoverId(null);
      setIsPublished(false);
      setOriginalPublishedAt(null);
      toast.success(editingId ? 'Kenangan berhasil diperbarui!' : 'Kenangan berhasil ditambahkan!');
    } catch (error) {
      console.error('Error saving memory:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan kenangan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/memories/${deleteId}`, {
        method: 'DELETE',
        headers: {
        },
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus kenangan');
      }

      await loadMemories();
      setShowConfirm(false);
      setDeleteId(null);
      toast.success('Kenangan berhasil dihapus');
    } catch (error) {
      console.error('Error deleting memory:', error);
      toast.error('Gagal menghapus kenangan');
    }
  };

  const handleEdit = (memory: Memory) => {
    setFormData({
      date: new Date(memory.date).toISOString().split('T')[0],
      title: memory.title,
      description: memory.description,
      emoji: memory.emoji,
    });
    setCoverImage(memory.cover?.publicUrl || null);
    setCoverId(memory.coverId || null);
    setIsPublished(!!memory.publishedAt);
    setOriginalPublishedAt(memory.publishedAt || null);
    setEditingId(memory.id);
    setShowForm(true);
  };

  const handleBatchDelete = async () => {
    try {
      
      await Promise.all(
        Array.from(selectedItems).map((id) =>
          fetch(`/api/memories/${id}`, {
            method: 'DELETE',
            headers: {
              },
          })
        )
      );

      await loadMemories();
      setSelectedItems(new Set());
      setShowBatchConfirm(false);
      toast.success(`${selectedItems.size} kenangan berhasil dihapus`);
    } catch (error) {
      console.error('Error deleting memories:', error);
      toast.error('Gagal menghapus beberapa kenangan');
    }
  };

  const toggleItemSelection = (id: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === paginatedMemories.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedMemories.map((memory) => memory.id)));
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredMemories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMemories = filteredMemories.slice(startIndex, endIndex);

  if (initialLoading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardPageHeader
        title="Kenangan"
        description={`${filteredMemories.length} kenangan${searchQuery ? ` (dari ${memories.length})` : ''}`}
        badge={memories.length}
        action={
          showForm
            ? undefined
            : {
                label: 'Kenangan Baru',
                onClick: () => {
                  setEditingId(null);
                  setFormData({
                    date: new Date().toISOString().split('T')[0],
                    title: '',
                    description: '',
                    emoji: '💕',
                  });
                  setCoverImage(null);
                  setCoverId(null);
                  setIsPublished(false);
                  setOriginalPublishedAt(null);
                  setShowForm(true);
                },
              }
        }
        secondaryAction={
          showForm
            ? {
                label: 'Batalkan',
                onClick: () => { setShowForm(false); setEditingId(null); },
              }
            : selectedItems.size > 0
            ? {
                label: `Hapus ${selectedItems.size} Dipilih`,
                onClick: () => setShowBatchConfirm(true),
              }
            : undefined
        }
      />

      {/* Search */}
      <SearchInput
        placeholder="Cari kenangan berdasarkan judul atau deskripsi..."
        onSearch={setSearchQuery}
      />

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Emoji
                </label>
                <input
                  type="text"
                  value={formData.emoji}
                  onChange={(e) =>
                    setFormData({ ...formData, emoji: e.target.value })
                  }
                  maxLength={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Judul
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Judul kenangan"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Deskripsi
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Ceritakan kenangan ini..."
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cover Image <span className="text-red-500">*</span>
              </label>
              <MediaUploader
                previewUrl={coverImage || undefined}
                onUploadingChange={setIsImageUploading}
                onSuccess={(mediaId, url) => {
                  setCoverId(mediaId);
                  setCoverImage(url);
                  toast.success('Foto sampul berhasil diunggah');
                }}
                onError={(error) => toast.error(error)}
              />
            </div>

            {/* Publish toggle */}
            <label className="flex items-center gap-3 cursor-pointer select-none p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                />
                <div className={`w-10 h-6 rounded-full transition-colors ${
                  isPublished ? 'bg-violet-600' : 'bg-slate-300'
                }`} />
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  isPublished ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </div>
              <span className="text-sm font-medium text-slate-700">
                {isPublished ? '🌸 Diterbitkan' : '📝 Draft'}
              </span>
            </label>

            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading || isImageUploading}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading && (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {isImageUploading ? 'Mengunggah gambar...' : editingId ? 'Simpan Perubahan' : 'Tambah Kenangan'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Batch Selection */}
      {paginatedMemories.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedItems.size === paginatedMemories.length && paginatedMemories.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
            />
            <span className="text-sm font-medium text-slate-700">
              Pilih semua di halaman ini
            </span>
          </label>
          {selectedItems.size > 0 && (
            <span className="text-sm text-slate-600">
              {selectedItems.size} dipilih
            </span>
          )}
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {paginatedMemories.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
            <p className="text-slate-500 text-lg">
              {searchQuery ? 'Tidak ada kenangan yang cocok dengan pencarianmu.' : 'Belum ada kenangan. Yuk tambahkan yang pertama!'}
            </p>
          </div>
        ) : (
          paginatedMemories.map((memory) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* Selection Checkbox */}
                <div className="flex items-start pt-1">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(memory.id)}
                    onChange={() => toggleItemSelection(memory.id)}
                    className="w-5 h-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                  />
                </div>

                {memory.cover && (
                  <img
                    src={memory.cover.publicUrl}
                    alt={memory.title}
                    className="h-24 w-24 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{memory.emoji}</span>
                        <h3 className="text-lg font-bold text-slate-900">
                          {memory.title}
                        </h3>
                      </div>
                      <p className="text-slate-600 text-sm mb-2">
                        {new Date(memory.date).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-slate-700 text-sm line-clamp-2">
                        {memory.description}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(memory)}
                        className="px-3 py-2 text-sm font-medium text-violet-700 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(memory.id);
                          setShowConfirm(true);
                        }}
                        className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredMemories.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newItemsPerPage) => {
            setItemsPerPage(newItemsPerPage);
            setCurrentPage(1);
          }}
        />
      )}

      {/* Confirm Delete Single */}
      <ConfirmDialog
        isOpen={showConfirm}
        title="Hapus Kenangan"
        message="Yakin ingin menghapus kenangan ini? Tindakan ini tidak bisa dibatalkan."
        onConfirm={handleDelete}
        onCancel={() => {
          setShowConfirm(false);
          setDeleteId(null);
        }}
      />

      {/* Confirm Batch Delete */}
      <ConfirmDialog
        isOpen={showBatchConfirm}
        title={`Hapus ${selectedItems.size} Kenangan`}
        message={`Yakin ingin menghapus ${selectedItems.size} kenangan sekaligus? Tindakan ini tidak bisa dibatalkan.`}
        onConfirm={handleBatchDelete}
        onCancel={() => setShowBatchConfirm(false)}
      />
    </div>
  );
}
